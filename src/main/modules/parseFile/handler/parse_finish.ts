// 4. parse finish
import { IResBase, LogLevel, genResBase } from '../../../base/response';

import { IContentWithResult } from './parse_base';

export interface IContentParseFinish extends IContentWithResult {
  msg: string;
}

export interface IResParseFinish extends IResBase {
  level: LogLevel.info;
  content: IContentParseFinish;
}

export const genResParseFinish = (content: IContentParseFinish): IResParseFinish => ({
  ...genResBase(),
  ...{
    level: LogLevel.info,
    content,
  },
});
