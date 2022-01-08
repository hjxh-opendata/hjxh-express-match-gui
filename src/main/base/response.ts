import { Channels, MyErrorType } from '../center';

/**
 * log part
 */
export enum LogLevel {
  debug = 'debug',
  info = 'info',
  warn = 'warn',
  error = 'error',
}

export const getLogLevel2number = (level: LogLevel) => {
  switch (level) {
    case LogLevel.debug:
      return 0;
    case LogLevel.info:
      return 1;
    case LogLevel.warn:
      return 2;
    case LogLevel.error:
      return 3;
    default:
      throw new Error('impossible');
  }
};

/**
 * res part
 */
export interface IResBase {
  error?: {
    type: MyErrorType;
    msg?: string;
  };
  content?: any;
  level: LogLevel;
  sendTime: Date;
}

export const genResBase = (): IResBase => ({
  level: LogLevel.debug,
  sendTime: new Date(),
});

/**
 * event and reply
 */
export interface IpcMainEvent extends Event {
  // eslint-disable-next-line @typescript-eslint/ban-types
  reply: Function;
}

export const reply = (e: IpcMainEvent, channel: Channels, msg: IResBase) => {
  e.reply(channel, msg);
};
