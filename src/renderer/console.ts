import { MsgFromMain, MsgLevel } from '../universal';

export interface ConsoleItem {
  text: string;
  time: Date;
  level: MsgLevel;
}

export const makeItemFromMain = (
  msg: MsgFromMain,
  func?: (any) => string
): ConsoleItem => ({
  text: func ? func(msg.content) : msg.content,
  time: msg.sendTime,
  level: msg.level || MsgLevel.debug,
});

export const makeItemFromText = (
  text: string,
  level = MsgLevel.debug
): ConsoleItem => ({
  text,
  time: new Date(),
  level,
});
