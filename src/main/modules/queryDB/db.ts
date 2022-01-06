import { IErpItem } from '../parseFile/handler/parse_success';

import { IReqQueryDB } from './request';

export async function dbQueryErp(props: IReqQueryDB): Promise<IErpItem[]> {
  // todo
  console.log(props);
  return [];
}
