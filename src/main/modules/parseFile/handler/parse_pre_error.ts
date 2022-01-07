import { GenericError } from '../../base/GenericError';
import { IResBase, LogLevel, genResBase } from '../../base/response';
import { ErrorPreParsingRows } from '../error_types';

export interface IContentPreParseError {
  msg: string;
}

export interface IResPreParseError extends IResBase {
  level: LogLevel.error;
  error: {
    type: ErrorPreParsingRows;
    msg: string;
  };
}

export const genResParsePreParseError = (
  error: GenericError<ErrorPreParsingRows>
): IResPreParseError => ({
  ...genResBase(),
  ...{
    level: LogLevel.error,
    error: {
      type: error.errorType,
      msg: error.message,
    },
  },
});
