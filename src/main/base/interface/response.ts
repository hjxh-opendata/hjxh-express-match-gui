import { Status } from './errors';
import { LogLevel } from './log';

/**
 * res part
 */
export interface IRes<T> {
  content: T;
  level: LogLevel;
  sendTime: Date;
}

export const genRes = (
  content: any = Status.OVER,
  level: LogLevel = LogLevel.debug
): IRes<any> => ({
  content,
  level,
  sendTime: new Date(),
});

/**
 * event and reply
 */
export interface IpcMainEvent extends Event {
  reply: Function;
}

/**
 * @param {IpcMainEvent} e
 * @param channel: Channels, but can not import in case of `circular dependencies`
 * @param {IRes<any>} res
 */
export const reply = (e: IpcMainEvent, channel, res: IRes<any>) => {
  e.reply(channel, res);
};
