import { GenericError } from './GenericError';
import { Channels } from './channels';
import { MyErrorType } from './error_types';

export enum Level {
  debug,
  info,
  warn,
  error,
}

export interface IResBase {
  error?: {
    type: MyErrorType;
    msg?: string;
  };
  content?: any;
  level: Level;
  sendTime: Date;
}

export const genResBase = (): IResBase => ({
  level: Level.debug,
  sendTime: new Date(),
});

export interface IpcMainEvent extends Event {
  // eslint-disable-next-line @typescript-eslint/ban-types
  reply: Function;
}

export const reply = (e: IpcMainEvent, channel: Channels, msg: IResBase) => {
  e.reply(channel, msg);
};
