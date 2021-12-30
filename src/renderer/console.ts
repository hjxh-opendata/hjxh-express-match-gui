import { MsgFromMain, MsgLevel } from '../main/@types/event';

import { ConsoleItem } from './@types/console';

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
