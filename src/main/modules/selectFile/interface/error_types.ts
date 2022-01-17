/**
 * error when select file, in fact, it won't occur yet know
 */
export const ErrorSelectingFile = 'ErrorSelectingFile';
export type ErrorSelectingFile = typeof ErrorSelectingFile;
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

export const errorSelectFiles = [ErrorReadFile, ErrorSelectingFile, ErrorOpenFile] as const;
export type ErrorSelectFile = ErrorSelectingFile | ErrorOpenFile | ErrorReadFile;
