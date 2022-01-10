import { IpcMainEvent, genRes, reply } from '../../base/interface/response';

import { dbQueryErp } from './db';
import { IReqQueryDB, RequestQueryDatabase } from './interface';

export async function handleQueryDatabase(e: IpcMainEvent, queryParams: IReqQueryDB) {
  const result = await dbQueryErp(queryParams);
  reply(e, RequestQueryDatabase, genRes({ items: result, length: result.length }));
}
