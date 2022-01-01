import { IpcMainEvent, reply } from '../base/response';

import { RequestQueryDatabase } from './channels';
import { dbQueryErp } from './db';
import { IReqQueryDB } from './request';
import { genResQueryDB } from './response';

export async function handleQueryDatabase(e: IpcMainEvent, queryParams: IReqQueryDB) {
  const result = await dbQueryErp(queryParams);
  reply(e, RequestQueryDatabase, genResQueryDB({ items: result, length: result.length }));
}
