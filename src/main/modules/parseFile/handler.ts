import * as csv from '@fast-csv/parse';
import * as fs from 'fs';
import iconv from 'iconv-lite';

import {
  DbInsertStatus,
  DbUpsertStatus,
  IDbInsertResult,
  IDbUpdateResult,
  initDbInsertResult,
  initDbUpdateResult,
  isDbFinished,
} from '../../db';
import { mainGetSetting } from '../../settings';
import { ENABLE_DB_UPSERT_MODE, ENABLE_PARSE_WITH_HEADER } from '../../settings/boolean_settings';
import { SET_PARSE_FILE_RETURN_FREQ } from '../../settings/number_settings';
import { MsgParseFileFinished, MsgParseHeaderError, MsgSaveDbFinished } from '../../settings/string_settings';
import { GenericError } from '../base/GenericError';
import { IpcMainEvent, reply } from '../base/response';

import { RequestParseFile } from './channels';
import { dbCreateErp, dbUpsertErp } from './db';
import { ErrorParsingRow } from './error_types';
import { SizeTransformer } from './handler/SizeTransformer';
import { checkCsvEncoding } from './handler/checkCsvEncoding';
import { ValidEncoding } from './handler/const';
import { ParseErpWithHeader } from './handler/parseHeader/parseErpWithHeader';
import { ErrorValidate } from './handler/parseValidate/error_types';
import { Row, initParseResult } from './handler/parse_base';
import { genResParseParseError } from './handler/parse_error';
import { IContentParseFinish, genResParseFinish } from './handler/parse_finish';
import { IContentParseSuccess, genResParseSuccess } from './handler/parse_success';
import { IContentValidateError, genResContentValidateError } from './handler/parse_validate';
import { IReqParseFile } from './request';

const updateDBResult = async (result, item) => {
  result.dbResult.nTotal += 1;
  if (mainGetSetting('boolean', ENABLE_DB_UPSERT_MODE)) {
    const dbStatus = await dbUpsertErp(item);
    const _ = result.dbResult as IDbUpdateResult;
    switch (dbStatus) {
      case DbUpsertStatus.updated:
        _.nUpdated += 1;
        break;
      case DbUpsertStatus.timeout:
        _.nTimeout += 1;
        break;
      default:
        _.nUnknown += 1;
        break;
    }
  } else {
    const dbStatus = await dbCreateErp(item);
    const _ = result.dbResult as IDbInsertResult;
    switch (dbStatus) {
      case DbInsertStatus.inserted:
        _.nInserted += 1;
        break;
      case DbInsertStatus.duplicated:
        _.nDuplicated += 1;
        break;
      case DbInsertStatus.timeout:
        _.nTimeout += 1;
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
  onParseError?: (error: GenericError<ErrorParsingRow>) => void;
  onValidateError?: (content: IContentValidateError, error: GenericError<ErrorValidate>) => void;
  onData?: (content: IContentParseSuccess) => void;
  onFinish?: (content: IContentParseFinish) => void;
}

export const handleParseFileBase = async (req: ReqParseFile) => {
  const { fp, withHeader, onData, onFinish, onParseError, onValidateError } = req;
  console.log(`reading file, name: ${fp}`);

  /**
   * encoding
   */
  const encoding = await checkCsvEncoding(fp);
  if (!(encoding in ValidEncoding)) return console.log('ErrorUnknownEncoding');

  /**
   * create stream
   */
  let s = fs.createReadStream(fp);
  if (encoding === ValidEncoding.gbk)
    // @ts-ignore
    s = s.pipe(iconv.decodeStream('gbk')).pipe(iconv.encodeStream('utf-8'));

  let hasFinishedParsing = false;
  const dbResult = mainGetSetting('boolean', ENABLE_DB_UPSERT_MODE) ? initDbUpdateResult() : initDbInsertResult();
  const result = { dbResult, parseResult: initParseResult() };

  // TODO: [-----] support no header
  const handler = new ParseErpWithHeader();

  s.pipe(new SizeTransformer(fs.statSync(fp).size, (pct) => (result.parseResult.sizePct = pct)))
    .pipe(csv.parse({ headers: withHeader }))
    .on('data', async (row: Row) => {
      try {
        result.parseResult.nTotalRows += 1;
        const item = handler.handle(row);
        if (item) {
          // backend: store into database
          await updateDBResult(result, item);
          result.parseResult.rowsPct = (result.parseResult.nSavedRows += 1) / result.parseResult.nTotalRows;
          // frontend
          if (onData) {
            onData({ row, item, result });
          }
        }
      } catch (err) {
        if (err instanceof GenericError) {
          result.parseResult.nFailedValidation += 1;
          console.error(err.toString());
          result.parseResult.rowsPct = (result.parseResult.nSavedRows += 1) / result.parseResult.nTotalRows;
          if (onValidateError)
            // prettier-ignore
            onValidateError({ row, result }, err);
        } else {
          throw err;
        }
      }
      if (hasFinishedParsing && isDbFinished(result.dbResult)) {
        hasFinishedParsing = false;
        if (onFinish) {
          result.parseResult.dbMileSeconds =
            (result.parseResult.dbEndTime = new Date()).getTime() - result.parseResult.startTime.getTime();
          console.log(result);
          onFinish({ msg: mainGetSetting('string', MsgSaveDbFinished), result });
        }
      }

      // console.log(JSON.stringify(result));
    })
    .on('error', (err) => {
      console.error(err);
      if (onParseError) onParseError(new GenericError(ErrorParsingRow, mainGetSetting('string', MsgParseHeaderError)));
    })
    .on('end', () => {
      hasFinishedParsing = true;
      console.log('finished');
      if (onFinish) {
        result.parseResult.parseMileSeconds =
          (result.parseResult.parseEndTime = new Date()).getTime() - result.parseResult.startTime.getTime();
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
    withHeader: mainGetSetting('boolean', ENABLE_PARSE_WITH_HEADER),
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
