/**
 * pre-parsing rows start
 */
export const errorInvalidSuffix = 'ErrorInvalidSuffix';
export type ErrorInvalidSuffix = typeof errorInvalidSuffix;

export const errorUnknownEncoding = 'ErrorUnknownEncoding';
export type ErrorUnknownEncoding = typeof errorUnknownEncoding;

export const errorInvalidHeader = 'ErrorInvalidHeader';
export type ErrorInvalidHeader = typeof errorInvalidHeader;

export const errorModifyingHeader = 'ErrorModifyingHeader';
export type ErrorModifyingHeader = typeof errorModifyingHeader;

export const errorPreParsingRows = [
  errorInvalidSuffix, // 后缀
  errorUnknownEncoding, // 编码
  errorInvalidHeader, // 抬头
  errorModifyingHeader, // 改头
] as const;
export type ErrorPreParsingRows = typeof errorPreParsingRows[number];
