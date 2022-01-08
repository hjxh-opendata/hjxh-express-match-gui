import { MyProgrammeError } from './base/errors';
import { Ping } from './modules/heartBeats/const';
import { RequestParseFile, errorParsingFiles } from './modules/parseFile/const';
import { RequestQueryDatabase } from './modules/queryDB/const';
import { RequestSelectFile } from './modules/selectFile/channels';
import { errorSelectFiles } from './modules/selectFile/error_types';

export type Channels = Ping | RequestSelectFile | RequestParseFile | RequestQueryDatabase;

export const myErrorTypes = [MyProgrammeError, ...errorSelectFiles, ...errorParsingFiles] as const;
export type MyErrorType = typeof myErrorTypes[number];
