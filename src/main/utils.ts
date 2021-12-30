import { Channels } from './@types/channels';
import { MyErrorType } from './@types/errors';
import { IpcMainEvent, MsgFromMain, MsgLevel } from './@types/event';

export const makeMsgFromMain = (
  error?: MyErrorType,
  content?: any,
  level?: MsgLevel
): MsgFromMain => ({
  error: error || undefined,
  content: content || undefined,
  level: level || MsgLevel.debug,
  sendTime: new Date(),
});

/**
 * universal functions
 */
export const getLocalTime = () => {
  return new Date().toLocaleString();
};

/**
 * ref: [get file name from path](https://stackoverflow.com/a/423385/9422455)
 * @param filePath
 */
export const getFileNameFromPath = (filePath: string): string =>
  filePath.replace(/^.*[\\/]/, '');

export const reply = (e: IpcMainEvent, channel: Channels, msg: MsgFromMain) => {
  e.reply(channel, msg);
};
