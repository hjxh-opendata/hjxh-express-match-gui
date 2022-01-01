/**
 * 1. for csv files, gbk or utf-8 are supported, others not
 * 2. for xlsx|xls files, TODO: [+]
 */
import { ErrorValidate } from './handler/parseValidate/error_types';

export const ErrorUnknownEncoding = 'ErrorUnknownEncoding';
export type ErrorUnknownEncoding = typeof ErrorUnknownEncoding;
/**
 * the file may miss some column keys, such as `_快递`
 */
export const ErrorParsingHeaders = 'ErrorParsingHeaders';
export type ErrorParsingHeaders = typeof ErrorParsingHeaders;

/**
 * fired in parse erp without header
 */
export const ErrorMismatchingHeaders = 'ErrorMismatchingHeaders';
export type ErrorMismatchingHeaders = typeof ErrorMismatchingHeaders;

export const ErrorParsingRow = 'ErrorParsingRow';
export type ErrorParsingRow = typeof ErrorParsingRow;

export type ErrorParsing =
  | ErrorUnknownEncoding
  | ErrorParsingHeaders
  | ErrorMismatchingHeaders
  | ErrorValidate
  | ErrorParsingRow;

export type ParsingError = Generator<ErrorParsing>;
