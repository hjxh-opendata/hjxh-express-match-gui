/**
 * universal data-structure / interface
 */
export const OVER = 'over';

export enum Channels {
  ping = 'ping',
  requestSelectFile = 'requestSelectFile',
  requestReadFile = 'requestReadFile',
}

export enum Errors {
  ErrorOpenFile = 'ErrorOpenFile',
  ErrorReadFile = 'ErrorReadFile',
  ErrorUnknownEncoding = 'ErrorUnknownEncoding',
}

export enum MsgLevel {
  debug,
  info,
  warn,
  error,
}

export interface MsgFromMain {
  error?: Errors | string;
  content?: any;
  level: MsgLevel;
  sendTime: Date;
}

export enum ValidEncoding {
  utf_8 = 'utf_8',
  gbk = 'gbk',
}

/**
 * universal functions
 */

export const getTime = () => {
  return new Date().toLocaleString();
};
