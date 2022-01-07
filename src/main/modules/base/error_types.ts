import { ErrorParsingFile, errorParsingFiles } from '../parseFile/error_types';
import { ErrorValidate } from '../parseFile/handler/validators/error_types';
import { ErrorSelectFile, errorSelectFiles } from '../selectFile/error_types';

export const MyProgrammeError = 'MyProgrammeError';
export type MyProgrammeError = typeof MyProgrammeError;

export const myErrorTypes = [MyProgrammeError, ...errorSelectFiles, ...errorParsingFiles] as const;
export type MyErrorType = MyProgrammeError | ErrorSelectFile | ErrorParsingFile | ErrorValidate;
