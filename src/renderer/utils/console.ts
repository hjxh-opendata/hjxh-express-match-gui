import { ConsoleItem } from '../@types/console';

import { IResBase, Level } from '../../main/modules/base/response';

export const makeItemFromMain = (msg: IResBase, func?: (any) => string): ConsoleItem => ({
  text: func ? func(msg.content) : (msg.content || '').toString(),
  time: msg.sendTime,
  level: msg.level || Level.debug,
});
export const makeItemFromText = (text: string, level = Level.debug): ConsoleItem => ({
  text,
  time: new Date(),
  level,
});
