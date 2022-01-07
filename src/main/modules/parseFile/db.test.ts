import { DB_INSERT_SUCCESS } from '../db/db_status';

import { dbCreateErp } from './db';
import { IErpItem } from './handler/parse_success';

describe('db insert', function () {
  const tid = 'test' + new Date();
  const item: IErpItem = {
    id: tid,
    weight: 1,
    cpName: '顺丰快递',
    area: '上海',
    date: '2022-01-01',
  };

  it('should ok upon first insert', () => {
    expect(dbCreateErp(item)).toBe(DB_INSERT_SUCCESS);
  });

  it('should error second insert', () => {
    expect(() => dbCreateErp(item)).toBe('ok');
  });
});
