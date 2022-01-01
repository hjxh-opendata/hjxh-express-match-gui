import { prisma } from '../../db';
import { IErpItem } from '../parseFile/handler/parse_success';

import { IReqQueryDB } from './request';

export async function dbQueryErp(props: IReqQueryDB): Promise<IErpItem[]> {
  const result = await prisma.erp.findMany({
    skip: props.skip,
    take: props.limit,
  });
  console.dir(result);
  return result;
}
