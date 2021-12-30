/**
 * 1. for csv files, gbk or utf-8 are supported, others not
 * 2. for xlsx|xls files, TODO:
 */
export const ErrorUnknownEncoding = 'ErrorUnknownEncoding';
export type ErrorUnknownEncoding = typeof ErrorUnknownEncoding;
/**
 * the file may miss some column keys, such as `_快递`
 */
export const ErrorParsingHeaders = 'ErrorParsingHeaders';
export type ErrorParsingHeaders = typeof ErrorParsingHeaders;

export const ErrorParsingRow = 'ErrorParsingRow';
export type ErrorParsingRow = typeof ErrorParsingRow;

export type ErrorParsing =
  | ErrorUnknownEncoding
  | ErrorParsingHeaders
  | ErrorParsingRow;
