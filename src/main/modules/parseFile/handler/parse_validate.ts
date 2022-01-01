// 2. parse validate error
import { GenericError } from '../../base/GenericError';
import { IResBase, Level, genResBase } from '../../base/response';

import { ErrorValidate } from './parseValidate/error_types';
import { IParseContentBase2Progress } from './parse_base';

export type IContentValidateError = IParseContentBase2Progress;

export interface IResParseValidateError extends IResBase {
  level: Level.warn;
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
    level: Level.warn,
    content,
    error: {
      type: error.errorType,
      msg: error.message,
    },
  },
});
