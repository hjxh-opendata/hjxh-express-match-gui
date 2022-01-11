import { IpcMainEvent, genRes, reply } from '../../base/interface/response';

import { queryDB } from './db';
import { IReqQueryDB, RequestQueryDatabase } from './interface';

export async function handleQueryDatabase(e: IpcMainEvent, queryParams: IReqQueryDB) {
  const result = await queryDB(queryParams);
  reply(e, RequestQueryDatabase, genRes({ items: result, length: result.length }));
}
