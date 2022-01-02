import { ConsoleItem } from '../@types/console';

import { IResBase, LogLevel } from '../../main/modules/base/response';

export const makeItemFromMain = (msg: IResBase, func?: (any) => string): ConsoleItem => ({
  text: func ? func(msg.content) : (msg.content || '').toString(),
  time: msg.sendTime,
  level: msg.level || LogLevel.debug,
});
export const makeItemFromText = (text: string, level = LogLevel.debug): ConsoleItem => ({
  text,
  time: new Date(),
  level,
});
