export const RequestParseFile = 'RequestParseFile';
export type RequestParseFile = typeof RequestParseFile;

export const ErpRequestParseFile = 'ErpRequestReadFile';
export type ErpRequestParseFile = typeof ErpRequestParseFile;

export const TrdRequestParseFile = 'TrdRequestParseFile';
export type TrdRequestParseFile = typeof TrdRequestParseFile;

/**
 * request
 */
export interface IReqParseFile {
  fp: string;
  isErp: boolean;
}
