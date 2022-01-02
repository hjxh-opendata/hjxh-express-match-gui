// 4. parse finish
import { IResBase, Level, genResBase } from '../../base/response';

export interface IContentParseFinish {
  msg: string;
  total: number;
}

export interface IResParseFinish extends IResBase {
  level: Level.info;
  content: IContentParseFinish;
}

export const genResParseFinish = (content: IContentParseFinish): IResParseFinish => ({
  ...genResBase(),
  ...{
    level: Level.info,
    content,
  },
});
