/**
 * channels start
 */
export const RequestParseFile = 'RequestReadFile';
export type RequestParseFile = typeof RequestParseFile;

/**
 * request
 */
export interface IReqParseFile {
  fp: string;
  isErp: boolean;
}
