/**
 * 1. for csv files, gbk or utf-8 are supported, others not
 * 2. for xlsx|xls files, TODO: [+]
 */
import { ErrorValidate, errorValidates } from './handler/validators/error_types';

export const ErrorUnknownEncoding = 'ErrorUnknownEncoding';
export type ErrorUnknownEncoding = typeof ErrorUnknownEncoding;
/**
 * the file may miss some column keys, such as `_快递`
 */
export const ErrorParsingHeader = 'ErrorParsingHeader';
export type ErrorParsingHeader = typeof ErrorParsingHeader;

/**
 * fired in parse erp without header
 */
export const ErrorMismatchingHeaders = 'ErrorMismatchingHeaders';
export type ErrorMismatchingHeaders = typeof ErrorMismatchingHeaders;

/**
 * pre parse rows
 */
export const errorPreParsingRows = [
  ErrorUnknownEncoding,
  ErrorParsingHeader,
  ErrorMismatchingHeaders,
] as const;
export type ErrorPreParsingRows = typeof errorPreParsingRows[number];

/**
 * in parsing rows
 */
export const ErrorParsingRow = 'ErrorParsingRow';
export type ErrorParsingRow = typeof ErrorParsingRow;

export const errorParsingFiles = [
  ...errorPreParsingRows,
  ...errorValidates,
  ErrorParsingRow,
] as const;
export type ErrorParsingFile = ErrorPreParsingRows | ErrorValidate | ErrorParsingRow;

export type ParsingFileError = Generator<ErrorParsingFile>;
