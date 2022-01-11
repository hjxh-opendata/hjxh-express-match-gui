import mock_db from '../../../../test/mock_db';

import { ErpModel } from './models/erp';

mock_db()
  .then(async (conn) => {
    if (!conn) throw new Error('failed to connect');
    const items = await conn.getRepository(ErpModel).createQueryBuilder().getMany();
    console.log('items length: ', items.length);
    return;

    // return items.map(async (item) => {
    //   await conn
    //     .getRepository(ErpModel)
    //     .createQueryBuilder()
    //     .update(ErpModel)
    //     .set(item)
    //     .where('id = :id', { id: item.id })
    //     .execute();
    // });
  })
  .catch((e) => {
    console.error(e);
  });
