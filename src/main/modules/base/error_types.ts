import { ErrorParsing } from '../parseFile/error_types';
import { ErrorValidate } from '../parseFile/handler/parseValidate/error_types';
import { ErrorPreParseFile } from '../selectFile/error_types';

export const MyProgrammeError = 'MyProgrammeError';
export type MyProgrammeError = typeof MyProgrammeError;

export type MyErrorType = MyProgrammeError | ErrorPreParseFile | ErrorParsing | ErrorValidate;
