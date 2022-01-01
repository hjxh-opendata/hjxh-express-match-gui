import { IResBase, genResBase } from '../base/response';
import { IErpItem } from '../parseFile/handler/parse_success';

export interface IContentQueryDB {
  items: IErpItem[];
  length: number;
}

export interface IResQueryDB extends IResBase {
  content: IContentQueryDB;
}

export const genResQueryDB = (content: IContentQueryDB): IResQueryDB => ({
  ...genResBase(),
  ...{
    content,
  },
});
