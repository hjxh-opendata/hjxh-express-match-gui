import { IResBase, IpcMainEvent, genResBase, reply } from '../../base/response';
import { IErpItem } from '../parseFile/handler/parse_success';

import { RequestQueryDatabase } from './const';
import { dbQueryErp } from './db';

/**
 * @param skip: start
 * @param limit: take
 */
export interface IReqQueryDB {
  skip: number;
  limit: number;
}

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

export async function handleQueryDatabase(e: IpcMainEvent, queryParams: IReqQueryDB) {
  const result = await dbQueryErp(queryParams);
  reply(e, RequestQueryDatabase, genResQueryDB({ items: result, length: result.length }));
}
