/**
 * database level error
 */
export const errorDbConnection = 'ErrorDbConnection';
export type ErrorDbConnection = typeof errorDbConnection;

/**
 * table level error
 */
export const errorTableNotExisted = 'ErrorTableNotExisted';
export type ErrorTableNotExisted = typeof errorTableNotExisted;

/**
 *  row level error
 */
export const errorDbInsertDuplicated = 'ErrorDbInsertDuplicated';
export type ErrorDbInsertDuplicated = typeof errorDbInsertDuplicated;

export const errorDbUpdateNotExisted = 'errorDbUpdateNotExisted';
export type errorDbUpdateNotExisted = typeof errorDbUpdateNotExisted;

export const errorDbStoringRows = [errorDbInsertDuplicated, errorDbUpdateNotExisted];
export type ErrorDbStoringRows = typeof errorDbStoringRows[number];

export const isDbStoringError = (errType: string): errType is ErrorDbStoringRows =>
  errorDbStoringRows.includes(errType);
