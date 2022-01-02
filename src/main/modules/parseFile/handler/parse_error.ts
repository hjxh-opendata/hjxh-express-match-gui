// 3. parse parse error
import { GenericError } from '../../base/GenericError';
import { IResBase, LogLevel, genResBase } from '../../base/response';
import { ErrorParsingRow } from '../error_types';

export interface IContentParseError {
  msg: string;
}

export interface IResParseError extends IResBase {
  level: LogLevel.error;
  error: {
    type: ErrorParsingRow;
    msg: string;
  };
}

export const genResParseParseError = (error: GenericError<ErrorParsingRow>): IResParseError => ({
  ...genResBase(),
  ...{
    level: LogLevel.error,
    error: {
      type: error.errorType,
      msg: error.message,
    },
  },
});
