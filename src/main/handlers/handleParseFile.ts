import * as csv from '@fast-csv/parse';
import fs from 'fs';
import iconv from 'iconv-lite';
import progressStream from 'progress-stream';

import { RequestParseFile } from '../@types/channels';
import { IParseData, IParseError } from '../@types/erp_parse';
import { ValidEncoding } from '../@types/erp_read';
import { MyError } from '../@types/errors';
import { ErrorParsingRow } from '../@types/errors/parse';
import { IpcMainEvent, MsgLevel, OVER } from '../@types/event';

import { MsgWhenParseHeaderError } from '../config/configBusiness';
import { makeMsgFromMain, reply } from '../utils';

import { ParseErpWithHeader } from './parse/parseErpWithHeader';
import { ParseErpWithoutHeader } from './parse/parseErpWithoutHeader';
import { checkCsvEncoding } from './parse/utils';

export type IOnParseError = (e: IpcMainEvent, msg: string) => void;

export type IOnValidateError = (e: IpcMainEvent, err: IParseError) => void;

export type IOnData = (e: IpcMainEvent, data: IParseData) => void;

export type IOnFinish = (e: IpcMainEvent) => void;

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
const handleParseFileBase = async (
  e: IpcMainEvent,
  fp: string,
  withHeader = false,
  onParseError?: IOnParseError,
  onValidateError?: IOnValidateError,
  onData?: IOnData,
  onFinish?: IOnFinish
) => {
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

  /**
   * monitor stream
   */
  let progress;
  // time: 100
  const pipeProgress = progressStream(
    { length: fs.statSync(fp).size },
    (_) => (progress = _)
  );

  /**
   * parse stream
   * @type {number}
   */
  let line = 0;
  const handler = withHeader
    ? new ParseErpWithHeader()
    : new ParseErpWithoutHeader();

  s.pipe(pipeProgress)
    .pipe(csv.parse({ headers: withHeader }))
    .on('data', (row: any) => {
      try {
        line += 1;
        // console.log(JSON.stringify(row));
        const data = handler.handle(row);
        // console.dir(data);
        if (data && onData) onData(e, { line, row, progress, data });
      } catch (err) {
        console.error((err as unknown as MyError).toString());
        if (onValidateError)
          onValidateError(e, {
            line,
            row,
            progress,
            errorType: (err as unknown as MyError).errorType,
          });
      }
    })
    .on('error', (err) => {
      console.error(err);
      if (onParseError) onParseError(e, MsgWhenParseHeaderError);
    })
    .on('end', () => {
      console.log('finished');
      if (onFinish) {
        onFinish(e);
      }
    });
};

export const handleParseFile = (e: IpcMainEvent, fp: string) => {
  const onParseError: IOnParseError = (e1, msg) => {
    reply(
      e1,
      RequestParseFile,
      makeMsgFromMain(ErrorParsingRow, msg, MsgLevel.error)
    );
  };

  const onValidateError: IOnValidateError = (e1, err) => {
    reply(
      e1,
      RequestParseFile,
      makeMsgFromMain(err.errorType, err, MsgLevel.warn)
    );
  };

  const onData: IOnData = () => {
    //  do nothing
  };

  const onFinish: IOnFinish = (e1) => {
    reply(
      e1,
      RequestParseFile,
      makeMsgFromMain(undefined, OVER, MsgLevel.info)
    );
  };

  handleParseFileBase(
    e,
    fp,
    false,
    onParseError,
    onValidateError,
    onData,
    onFinish
  );
};
