import { getConnection } from 'typeorm';

import { ErpModel, TrdModel } from '../parseFile/db';
import { IErpItem } from '../parseFile/interface/item';

import { DataMode } from './base';
import { IReqQueryDB } from './interface';

export async function dbQueryErp(dbQueryErpProps: IReqQueryDB): Promise<IErpItem[]> {
  console.log('query db: ', dbQueryErpProps);
  const { skip, mode, limit } = dbQueryErpProps;
  if (mode === DataMode.onlyErp)
    return getConnection()
      .getRepository(ErpModel)
      .createQueryBuilder('item')
      .skip(skip)
      .limit(limit)
      .getMany();
  if (mode === DataMode.onlyTrd)
    return getConnection()
      .getRepository(TrdModel)
      .createQueryBuilder('item')
      .skip(skip)
      .limit(limit)
      .getMany();

  // TODO:
  throw new Error('not support now');
}
