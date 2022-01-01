import { IResParseError } from './handler/parse_error';
import { IResParseFinish } from './handler/parse_finish';
import { IResParseSuccess } from './handler/parse_success';
import { IResParseValidateError } from './handler/parse_validate';

export type IResParseFile = IResParseSuccess | IResParseValidateError | IResParseFinish | IResParseError;
