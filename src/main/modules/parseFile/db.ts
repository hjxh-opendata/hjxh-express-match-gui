import db from 'main/db';

import {
  DB_INSERT_DUPLICATED,
  DB_INSERT_SUCCESS,
  DB_TABLE_NOT_EXISTED,
  DB_TIMEOUT,
  DB_UNKNOWN,
  DB_UPDATED,
  DbInsertStatus,
  DbUpdateStatus,
} from '../db/db_status';

import { IErpItem } from './handler/parse_success';

const SQL_CREATE_ERP = `CREATE TABLE IF NOT EXISTS erp (
 id string PRIMARY KEY,
'weight' number,
'area' string,
'date' string,
'cpName', string
)`;

db.exec(SQL_CREATE_ERP);

export async function dbCreateErp(item: IErpItem): Promise<DbInsertStatus> {
  try {
    // todo
    db.prepare();
    console.log({ creatingItem: item });
    return DB_INSERT_SUCCESS;
  } catch (e) {
    console.error(e);
    return DB_UNKNOWN;
  }
}

export async function dbUpsertErp(item: IErpItem): Promise<DbUpdateStatus> {
  try {
    // todo
    console.log({ upsertingItem: item });
    return DB_UPDATED;
  } catch (e) {
    console.error(e);
    return DB_UNKNOWN;
  }
}
