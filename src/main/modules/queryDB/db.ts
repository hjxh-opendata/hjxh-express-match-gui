import { getConnection } from 'typeorm';

import { ErpModel } from '../../base/db/models/erp';
import { TrdModel } from '../../base/db/models/trd';
import { IErpItem } from '../parseFile/interface/item';

import { DataMode } from './base';
import { IReqQueryDB } from './interface';

/**
 * 1. map erp into `id`, so `id` would go away
 * `.leftJoinAndSelect('trd.id', 'erp')`
 *
 * 2. map erp into `erp`, so `id` still existed
 * `.leftJoinAndMapOne('trd.erp', ErpModel, 'erp', 'erp.id = trd.id')`
 *
 * @param {number} skip
 * @param {number} limit
 * @param {boolean} isErp
 * @returns {Promise<ErpModel[]>}
 */
export const queryJoinTable = async (skip: number, limit: number, isErp: boolean) => {
  const model = isErp ? ErpModel : TrdModel;
  const primaryTableName = isErp ? 'erp' : 'trd';
  const secondTableName = isErp ? 'trd' : 'erp';
  return (
    await getConnection()
      .manager.createQueryBuilder(model, 'item')
      .innerJoinAndSelect('item.id', 'alias')
      .skip(skip)
      .limit(limit)
      .getMany()
  ).map((item) => {
    const foreign = item.id;
    // @ts-ignore
    const { id } = foreign;
    // @ts-ignore
    delete item.id;
    // @ts-ignore
    delete foreign.id;
    const keys = new Set([...Object.keys(item), ...Object.keys(foreign)]);
    keys.forEach((k) => {
      item[k + '_' + primaryTableName] = item[k];
      item[k + '_' + secondTableName] = foreign[k];
      // @ts-ignore
      delete item[k];
    });
    item.id = id;
    return item;
  });
};

export async function queryDB(dbQueryErpProps: IReqQueryDB): Promise<IErpItem[]> {
  console.log('query db: ', dbQueryErpProps);
  const { skip, mode, limit } = dbQueryErpProps;

  /**
   * only erp
   */
  if (mode === DataMode.onlyErp)
    return getConnection()
      .getRepository(ErpModel)
      .createQueryBuilder('item')
      .skip(skip)
      .limit(limit)
      .getMany();

  /**
   * only trd
   */
  if (mode === DataMode.onlyTrd)
    return getConnection()
      .getRepository(TrdModel)
      .createQueryBuilder('item')
      .skip(skip)
      .limit(limit)
      .getMany();

  /**
   * erp with trd
   */
  if (mode === DataMode.erpWithTrd) return queryJoinTable(skip, limit, true);

  /**
   * trd with erp
   */
  if (mode === DataMode.trdWithErp) return queryJoinTable(skip, limit, false);

  // TODO:
  throw new Error('not support now');
}
