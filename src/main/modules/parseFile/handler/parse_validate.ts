// 2. parse validate error
import { GenericError } from '../../base/GenericError';
import { IResBase, LogLevel, genResBase } from '../../base/response';

import { IContentWithResult, IContentWithRow } from './parse_base';
import { ErrorValidate } from './validators/error_types';

export type IContentValidateError = IContentWithRow & IContentWithResult;

export interface IResParseValidateError extends IResBase {
  level: LogLevel.warn;
  error: {
    type: ErrorValidate;
    msg: string;
  };
}

export const genResContentValidateError = (
  content: IContentValidateError,
  error: GenericError<ErrorValidate>
): IResParseValidateError => ({
  ...genResBase(),
  ...{
    level: LogLevel.warn,
    content,
    error: {
      type: error.errorType,
      msg: error.message,
    },
  },
});
