import { MyProgrammeError } from './base/interface/errors';
import { Ping } from './modules/heartBeats/const';
import {
  ErpRequestParseFile,
  RequestParseFile,
  TrdRequestParseFile,
} from './modules/parseFile/interface/channels';
import { errorParsingFiles } from './modules/parseFile/interface/errors';
import { errorValidators } from './modules/parseFile/interface/errors/validatingRoes';
import { RequestQueryDatabase } from './modules/queryDB/interface';
import {
  ErpRequestSelectFile,
  RequestSelectFile,
  TrdRequestSelectFile,
} from './modules/selectFile/interface/channels';
import { errorSelectFiles } from './modules/selectFile/interface/error_types';

export type Channels =
  | Ping

  /**
   * selectFile
   */
  | RequestSelectFile
  | ErpRequestSelectFile
  | TrdRequestSelectFile

  /**
   * parseFile
   */
  | RequestParseFile
  | ErpRequestParseFile
  | TrdRequestParseFile

  /**
   * queryDb
   */
  | RequestQueryDatabase;

export const errorTypes = [MyProgrammeError, ...errorSelectFiles, ...errorParsingFiles] as const;
export type ErrorType = typeof errorTypes[number];

export const isErrorValidate = (err): boolean => errorValidators.includes(err);
