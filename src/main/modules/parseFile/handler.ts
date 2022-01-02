import * as csv from '@fast-csv/parse';
import fs from 'fs';
import iconv from 'iconv-lite';
import progressStream from 'progress-stream';

import {
  ENABLE_DB_UPSERT_MODE,
  MsgParseFileFinished,
  MsgSaveDBFinished,
  MsgWhenParseHeaderError,
} from '../../../config/configBusiness';
import { PARSE_WITH_HEADERS } from '../../../config/configSettings';
import { DbInsertStatus, DbUpsertStatus, IDbInsertResult, IDbUpdateResult, isDbFinished } from '../../db';
import { GenericError } from '../base/GenericError';
import { IpcMainEvent, reply } from '../base/response';

import { RequestParseFile } from './channels';
import { dbCreateErp, dbUpsertErp } from './db';
import { ErrorParsingRow } from './error_types';
import { checkCsvEncoding } from './handler/checkCsvEncoding';
import { ValidEncoding } from './handler/const';
import { ParseErpWithHeader } from './handler/parseHeader/parseErpWithHeader';
import { ErrorValidate } from './handler/parseValidate/error_types';
import { Row } from './handler/parse_base';
import { genResParseParseError } from './handler/parse_error';
import { IContentParseFinish, genResParseFinish } from './handler/parse_finish';
import { IContentParseSuccess, genResParseSuccess } from './handler/parse_success';
import { IContentValidateError, genResContentValidateError } from './handler/parse_validate';
import { IReqParseFile } from './request';

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

  // monitor stream
  let progress;
  // time: 100
  const pipeProgress = progressStream({ length: fs.statSync(fp).size }, (_) => (progress = _));

  let result: (IDbInsertResult | IDbUpdateResult) & { nFailedValidation: number };
  if (ENABLE_DB_UPSERT_MODE) {
    result = { nTotal: 0, nUpdated: 0, nDropped: 0, nTimeout: 0, nUnknown: 0, nFailedValidation: 0 };
  } else {
    result = { nTotal: 0, nInserted: 0, nDuplicated: 0, nTimeout: 0, nUnknown: 0, nFailedValidation: 0 };
  }

  let line = 0;
  // TODO: [-----] support no header
  const handler = new ParseErpWithHeader();

  s.pipe(pipeProgress)
    .pipe(csv.parse({ headers: withHeader }))
    .on('data', async (row: Row) => {
      result.nTotal += 1;
      try {
        const item = handler.handle(row);
        if (item) {
          // backend: store into database
          if (ENABLE_DB_UPSERT_MODE) {
            const dbStatus = await dbUpsertErp(item);
            let _ = result as IDbUpdateResult;
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
            let _ = result as IDbInsertResult;
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
          // frontend
          if (onData) {
            onData({ line, row, progress, item });
          }
        }
      } catch (err) {
        if (err instanceof GenericError) {
          result.nFailedValidation += 1;
          console.error(err.toString());
          if (onValidateError)
            // prettier-ignore
            onValidateError({ line, row, progress }, err);
        } else {
          throw err;
        }
      }
      line += 1;
      if (onFinish && isDbFinished(result)) {
        onFinish({ msg: MsgSaveDBFinished, total: result.nTotal });
      }

      // console.log(JSON.stringify(result));
    })
    .on('error', (err) => {
      console.error(err);
      if (onParseError) onParseError(new GenericError(ErrorParsingRow, MsgWhenParseHeaderError));
    })
    .on('close', () => {
      console.log('finished');
      if (onFinish) {
        onFinish({ msg: MsgParseFileFinished, total: result.nTotal });
      }
    });
};

export const handleParseFile = async (e: IpcMainEvent, req: IReqParseFile) => {
  let cnt = 0;
  const { fp } = req;

  await handleParseFileBase({
    fp,
    withHeader: PARSE_WITH_HEADERS,
    onParseError: (error) => {
      reply(e, RequestParseFile, genResParseParseError(error));
    },
    onValidateError: (content, error) => {
      cnt += 1;
      reply(e, RequestParseFile, genResContentValidateError(content, error));
    },
    onData: (content) => {
      cnt += 1;
      if (cnt % 10000 === 0) {
        reply(e, RequestParseFile, genResParseSuccess(content));
      }
    },
    onFinish: (content) => {
      reply(e, RequestParseFile, genResParseFinish(content));
    },
  });
};
