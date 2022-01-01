// 4. parse finish
import { IResBase, Level, genResBase } from '../../base/response';

export interface IParseResult {
  nInserted: number;
  nDuplicated: number;
  nTimeOut: number;
  nUnknown: number;
  nFailedValidation: number;
}

export interface IContentParseFinish {
  msg: string;
  result: IParseResult;
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
