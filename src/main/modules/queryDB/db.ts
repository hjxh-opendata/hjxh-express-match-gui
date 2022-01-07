import db from '../../db';
import { IErpItem } from '../parseFile/handler/parse_success';

import { IReqQueryDB } from './request';

export async function dbQueryErp(props: IReqQueryDB): Promise<IErpItem[]> {
  console.log({ queryErpProps: props });
  const results = db.prepare('SELECT * FROM erp LIMIT 1000').all();
  console.log({ queryErpResultCount: results.length });
  return results;
}
