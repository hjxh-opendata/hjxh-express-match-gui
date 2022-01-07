import * as csv from '@fast-csv/parse';
import * as fs from 'fs';
import iconv from 'iconv-lite';

import { mainGetSetting } from '../../settings';
import { ENABLE_DB_UPSERT_MODE, ENABLE_PARSE_WITH_HEADER } from '../../settings/boolean_settings';
import { SET_PARSE_FILE_RETURN_FREQ } from '../../settings/number_settings';
import {
  MsgParseFileFinished,
  MsgParseHeaderError,
  MsgSaveDbFinished,
} from '../../settings/string_settings';
import { GenericError } from '../base/GenericError';
import { MyProgrammeError } from '../base/error_types';
import { IpcMainEvent, reply } from '../base/response';
import { IDbInsertResult, initDbInsertResult, initDbUpdateResult } from '../db/db_result';
import {
  DB_INSERT_DUPLICATED,
  DB_INSERT_SUCCESS,
  DB_TABLE_NOT_EXISTED,
  DB_TIMEOUT,
} from '../db/db_status';
import { isDbFinished } from '../db/db_utils';

import { RequestParseFile } from './channels';
import { ErpCols, TrdCols, erpCols, trdCols } from './cols';
import { dbCreateErp } from './db';
import { ErrorParsingRow, ErrorPreParsingRows } from './error_types';
import { SizeTransformer } from './handler/SizeTransformer';
import { preParsing } from './handler/checkCsvEncoding';
import { Row, initParseResult } from './handler/parse_base';
import { genResParseParseError } from './handler/parse_error';
import { IContentParseFinish, genResParseFinish } from './handler/parse_finish';
import { genResParsePreParseError } from './handler/parse_pre_error';
import { IContentParseSuccess, IErpItem, genResParseSuccess } from './handler/parse_success';
import { IContentValidateError, genResContentValidateError } from './handler/parse_validate';
import { validateErpItemWithHeader } from './handler/validators';
import { ErrorValidate } from './handler/validators/error_types';
import { IReqParseFile } from './request';

const updateDBResult = async (result, item) => {
  result.dbResult.nTotal += 1;
  if (mainGetSetting('boolean', ENABLE_DB_UPSERT_MODE)) {
    throw new Error('todo');
    // const _ = result.dbResult as IDbUpdateResult;
    // switch (dbStatus) {
    //   case DB_UPDATED:
    //     _.nUpdated += 1;
    //     break;
    //   case DB_TIMEOUT:
    //     _.nTimeout += 1;
    //     break;
    //   case DB_TABLE_NOT_EXISTED:
    //     _.nTableNotExist += 1;
    //     break;
    //   default:
    //     _.nUnknown += 1;
    //     break;
    // }
  } else {
    const dbStatus = await dbCreateErp(item);
    const _ = result.dbResult as IDbInsertResult;
    switch (dbStatus) {
      case DB_INSERT_SUCCESS:
        _.nInserted += 1;
        break;
      case DB_INSERT_DUPLICATED:
        _.nDuplicated += 1;
        break;
      case DB_TIMEOUT:
        _.nTimeout += 1;
        break;
      case DB_TABLE_NOT_EXISTED:
        _.nTableNotExist += 1;
        break;
      default:
        _.nUnknown += 1;
        break;
    }
  }
};

/**
 *
 * @param e - electron event
 * @param {string} fp - file path
 * @param {boolean} withHeader -
 *  - withHeader = true: more readable but slower, better for debug
 *  - withHeader = false: faster but obscure, better for prod
 * @param {(e, msg: string) => void} onParseError - called when '""' detected, `fast-csv` would stop parsing, then I will expect to stop this stream at backend and frontend
 * @param {(e, err: IParseError) => void} onValidateError - called when row is not qualified, e.g. duplicated, null, failed for constraint, ... and would better report to the frontend user
 * @param {(e, data: IParseData) => void} onData - called when row is parsed successfully, and would store into database
 * @param {(e) => void} onFinish - called when the stream is over, then the frontend would response for this signal
 */
export interface ReqParseFile {
  fp: string;
  withHeader: boolean;
  isErp: boolean;
  onPreParseError?: (error: GenericError<ErrorPreParsingRows>) => void;
  onParseError?: (error: GenericError<ErrorParsingRow>) => void;
  onValidateError?: (content: IContentValidateError, error: GenericError<ErrorValidate>) => void;
  onData?: (content: IContentParseSuccess) => void;
  onFinish?: (content: IContentParseFinish) => void;
}

export const handleParseFileBase = async (req: ReqParseFile) => {
  const { fp, withHeader, onData, onFinish, onPreParseError, onParseError, onValidateError } = req;
  console.log(`reading file, name: ${fp}`);

  /**
   * encoding
   */
  let useIconv;
  try {
    useIconv = await preParsing(fp, req.isErp);
  } catch (e) {
    console.error(e);
    if (onPreParseError) onPreParseError(e as unknown as GenericError<ErrorPreParsingRows>);
    return;
  }

  /**
   * create stream
   */
  const s = fs.createReadStream(fp);
  const s2 = useIconv ? s.pipe(iconv.decodeStream('gbk')).pipe(iconv.encodeStream('utf-8')) : s;

  let hasFinishedParsing = false;
  const dbResult = mainGetSetting('boolean', ENABLE_DB_UPSERT_MODE)
    ? initDbUpdateResult()
    : initDbInsertResult();
  const result = { dbResult, parseResult: initParseResult() };

  // TODO: [-----] support no header

  const cols = req.isErp ? erpCols : trdCols;
  s2.pipe(new SizeTransformer(fs.statSync(fp).size, (pct) => (result.parseResult.sizePct = pct)))
    .pipe(csv.parse({ headers: withHeader }))
    .on('data', async (row: Row) => {
      try {
        validateErpItemWithHeader(row);

        const item = row as unknown as IErpItem;
        result.parseResult.nTotalRows += 1;
        Object.keys(item).forEach((k) => {
          if (!cols.includes(k as ErpCols)) delete item[k];
        });
        // backend: store into database
        await updateDBResult(result, row);
        result.parseResult.rowsPct =
          (result.parseResult.nSavedRows += 1) / result.parseResult.nTotalRows;
        // frontend
        if (onData) {
          onData({ item, result });
        }
      } catch (err) {
        console.error(err);
        if (err instanceof GenericError) {
          result.parseResult.nFailedValidation += 1;
          result.parseResult.rowsPct =
            (result.parseResult.nSavedRows += 1) / result.parseResult.nTotalRows;
          if (onValidateError) onValidateError({ row, result }, err);
        } else {
          throw new GenericError(MyProgrammeError, 'MyProgrammeError on ValidateError Detect');
        }
      }
      if (hasFinishedParsing && isDbFinished(result.dbResult)) {
        hasFinishedParsing = false;
        if (onFinish) {
          result.parseResult.dbMileSeconds =
            (result.parseResult.dbEndTime = new Date()).getTime() -
            result.parseResult.startTime.getTime();
          console.log(result);
          onFinish({ msg: mainGetSetting('string', MsgSaveDbFinished), result });
        }
      }

      // console.log(JSON.stringify(result));
    })
    .on('error', (err) => {
      console.error(err);
      if (onParseError)
        onParseError(
          new GenericError(ErrorParsingRow, mainGetSetting('string', MsgParseHeaderError))
        );
    })
    .on('end', () => {
      hasFinishedParsing = true;
      console.log('finished');
      if (onFinish) {
        result.parseResult.parseMileSeconds =
          (result.parseResult.parseEndTime = new Date()).getTime() -
          result.parseResult.startTime.getTime();
        console.log(result);
        onFinish({ msg: mainGetSetting('string', MsgParseFileFinished), result });
      }
    });
};

export const handleParseFile = async (e: IpcMainEvent, req: IReqParseFile) => {
  let cnt = 0;
  const { fp } = req;

  await handleParseFileBase({
    fp,
    isErp: req.isErp,
    withHeader: mainGetSetting('boolean', ENABLE_PARSE_WITH_HEADER),
    onPreParseError: (error) => {
      reply(e, RequestParseFile, genResParsePreParseError(error));
    },
    onParseError: (error) => {
      reply(e, RequestParseFile, genResParseParseError(error));
    },
    onValidateError: (content, error) => {
      cnt += 1;
      reply(e, RequestParseFile, genResContentValidateError(content, error));
    },
    onData: (content) => {
      cnt += 1;
      if (cnt % mainGetSetting('number', SET_PARSE_FILE_RETURN_FREQ) === 1) {
        reply(e, RequestParseFile, genResParseSuccess(content));
      }
    },
    onFinish: (content) => {
      reply(e, RequestParseFile, genResParseFinish(content));
    },
  });
};
