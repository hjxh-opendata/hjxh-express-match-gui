import { IParseData, IParseError } from './erp_parse';
import { MyErrorType } from './errors';

export interface IpcMainEvent extends Event {
  // eslint-disable-next-line @typescript-eslint/ban-types
  reply: Function;
}

export enum MsgLevel {
  debug,
  info,
  warn,
  error,
}

export interface MsgFromMain {
  error?: MyErrorType | string;
  // todo: content type too sophisticated, I need to write sub class or unify them
  content?: IParseError | IParseData | OVER | string | string[];
  level: MsgLevel;
  sendTime: Date;
}

export const OVER = 'OVER';
export type OVER = typeof OVER;
