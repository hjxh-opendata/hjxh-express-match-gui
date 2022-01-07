import { SqliteError } from 'better-sqlite3';

import db from '../../db';
import {
  DB_INSERT_DUPLICATED,
  DB_INSERT_SUCCESS,
  DB_UNKNOWN,
  DB_UPDATED,
  DbInsertStatus,
  DbUpdateStatus,
} from '../db/db_status';

import { IErpItem } from './handler/parse_success';

const SQL_CREATE_ERP = `CREATE TABLE IF NOT EXISTS erp (
  id      string PRIMARY KEY,
  weight  number,
  area    string,
  date    string,
  cpName  string
)`;

db.exec(SQL_CREATE_ERP);

const stmtInsertErp = db.prepare(
  'INSERT INTO erp (id, weight, area, date, cpName) VALUES (@id, @weight, @area, @date, @cpName)'
);
const item: IErpItem = {
  id: 'test-' + new Date(),
  weight: 1,
  cpName: '顺丰快递',
  area: '上海',
  date: '2022-01-01',
};

export async function dbCreateErp(item: IErpItem): Promise<DbInsertStatus> {
  try {
    stmtInsertErp.run(item);
    console.log('insert success');
    return DB_INSERT_SUCCESS;
  } catch (e) {
    if (e instanceof SqliteError) {
      if (e.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') return DB_INSERT_DUPLICATED;
    }
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

dbCreateErp(item);
dbCreateErp(item);
