import { getConnection } from 'typeorm';

import { DB_INSERT_SUCCESS, DB_UNKNOWN, DbInsertStatus } from '../db/db_status';

import { IErpItem } from './handler/parse_success';
import { ErpModel } from './models';

export async function dbCreateErp(item: IErpItem): Promise<DbInsertStatus> {
  try {
    await getConnection().createQueryBuilder().insert().into(ErpModel).values(item).execute();
    return DB_INSERT_SUCCESS;
  } catch (e) {
    console.error(e);
    return DB_UNKNOWN;
  }
}
