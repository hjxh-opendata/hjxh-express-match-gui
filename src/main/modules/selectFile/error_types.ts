/**
 * error when select file, in fact, it won't occur yet know
 */
export const ErrorSelectFile = 'ErrorSelectFile';
export type ErrorSelectFile = typeof ErrorSelectFile;
/**
 * when use fs to open a file, error may occur
 */
export const ErrorOpenFile = 'ErrorOpenFile';
export type ErrorOpenFile = typeof ErrorOpenFile;
/**
 * when use fs to read file, error may occur
 */
export const ErrorReadFile = 'ErrorReadFile';
export type ErrorReadFile = typeof ErrorReadFile;

export type ErrorPreParseFile = ErrorSelectFile | ErrorOpenFile | ErrorReadFile;
