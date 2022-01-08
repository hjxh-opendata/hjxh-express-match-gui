import { ErrorValidate, errorValidates } from './handler/validators/error_types';

/**
 * channels
 */
export const RequestParseFile = 'RequestReadFile';
export type RequestParseFile = typeof RequestParseFile;

export const ENCODING_FLAG_AS_ID = '单号';

/**
 * erp (base)
 */
export const COL_ID = 'id';
export type COL_ID = typeof COL_ID;

export const COL_AREA = 'area';
export type COL_AREA = typeof COL_AREA;

export const COL_WEIGHT = 'weight';
export type COL_WEIGHT = typeof COL_WEIGHT;

export const COL_DATE = 'date';
export type COL_DATE = typeof COL_DATE;

export const COL_CP_NAME = 'cp';
export type COL_CP_NAME = typeof COL_CP_NAME;

export const erpCols = [COL_ID, COL_DATE, COL_WEIGHT, COL_AREA, COL_CP_NAME] as const;
// ref: - [Typescript derive union type from tuple/array values - Stack Overflow](https://stackoverflow.com/questions/45251664/typescript-derive-union-type-from-tuple-array-values)
export type ErpCols = typeof erpCols[number];

/**
 * trd (based on erp)
 */

export const COL_FEE = 'fee';
export type COL_FEE = typeof COL_FEE;

export const trdCols = [...erpCols, COL_FEE] as const;
export type TrdCols = typeof trdCols[number];

/**
 * errors
 */
export const ErrorUnknownEncoding = 'ErrorUnknownEncoding';
export type ErrorUnknownEncoding = typeof ErrorUnknownEncoding;

// the file may miss some column keys, such as `_快递`
export const ErrorParsingHeader = 'ErrorParsingHeader';
export type ErrorParsingHeader = typeof ErrorParsingHeader;

// fired in parse erp without header
export const ErrorMismatchingHeaders = 'ErrorMismatchingHeaders';
export type ErrorMismatchingHeaders = typeof ErrorMismatchingHeaders;

// pre parse rows
export const errorPreParsingRows = [
  ErrorUnknownEncoding,
  ErrorParsingHeader,
  ErrorMismatchingHeaders,
] as const;
export type ErrorPreParsingRows = typeof errorPreParsingRows[number];

export const ErrorParsingRow = 'ErrorParsingRow';
export type ErrorParsingRow = typeof ErrorParsingRow;

// in parsing rows
export const errorParsingFiles = [
  ...errorPreParsingRows,
  ...errorValidates,
  ErrorParsingRow,
] as const;

export type ErrorParsingFile = ErrorPreParsingRows | ErrorValidate | ErrorParsingRow;
