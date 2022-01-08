import { Column, Entity, getConnection, PrimaryColumn } from 'typeorm';

import { DB_INSERT_SUCCESS, DB_UNKNOWN, DbInsertStatus } from '../db/db_status';

import { IErpItem } from './handler/parse_success';

@Entity()
export class ErpModel {

  @PrimaryColumn()
  id: string;

  @Column()
  date: string;

  @Column()
  area: string;

  @Column({
    type: 'float'
  })
  weight: number;

  @Column()
  cp: string;
}

export class TrdModel extends ErpModel {

  @Column()
  fee: number;
}

export async function dbCreateErp(item: IErpItem): Promise<DbInsertStatus> {
  try {
    await getConnection().createQueryBuilder().insert().into(ErpModel).values(item).execute();
    return DB_INSERT_SUCCESS;
  } catch (e) {
    console.error(e);
    return DB_UNKNOWN;
  }
}
