import { getConnection } from 'typeorm';

import { IErpItem } from '../parseFile/handler/parse_success';
import { ErpModel } from '../parseFile/models';

import { IReqQueryDB } from './request';

export async function dbQueryErp(dbQueryErpProps: IReqQueryDB): Promise<IErpItem[]> {
  console.log({ dbQueryErpProps });
  return getConnection().getRepository(ErpModel).createQueryBuilder('item').limit(1000).getMany();
}
