import { db } from '../../db';
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

const stmtInsertErp = db.prepare('INSERT INTO erp (id, weight, area, date, cpName) VALUES (?, ?, ?, ?, ?)');
const item: IErpItem = {
  id: 'test-' + new Date(),
  weight: 1,
  area: '上海',
  date: '2022-01-01',
  cpName: '顺丰快递',
};

export async function dbCreateErp(item: IErpItem): Promise<DbInsertStatus> {
  return new Promise((resolve) => {
    stmtInsertErp.run(item.id, item.weight, item.area, item.date, item.cpName, (e) => {
      console.log({ e });
      if (!e) {
        console.log('insert success');
        resolve(DB_INSERT_SUCCESS);
      } else {
        // TODO: insert error check
        console.error(e);
        resolve(DB_UNKNOWN);
      }
    });
  });
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
