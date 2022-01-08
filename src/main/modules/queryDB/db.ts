import { getConnection } from 'typeorm';

import { ErpModel } from '../parseFile/db';
import { IErpItem } from '../parseFile/handler/parse_success';

import { IReqQueryDB } from './handler';

export async function dbQueryErp(dbQueryErpProps: IReqQueryDB): Promise<IErpItem[]> {
  console.log({ dbQueryErpProps });
  return getConnection().getRepository(ErpModel).createQueryBuilder('item').limit(1000).getMany();
}
