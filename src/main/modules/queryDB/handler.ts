import { IRes, IpcMainEvent, genRes, reply } from '../../base/interface/response';
import { IErpItem } from '../parseFile/interface/item';

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

export interface IResQueryDB extends IRes<IContentQueryDB> {
  content: IContentQueryDB;
}

export async function handleQueryDatabase(e: IpcMainEvent, queryParams: IReqQueryDB) {
  const result = await dbQueryErp(queryParams);
  reply(e, RequestQueryDatabase, genRes({ items: result, length: result.length }));
}
