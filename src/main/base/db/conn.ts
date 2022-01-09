import { createConnection } from 'typeorm';

import { ErpModel } from '../../modules/parseFile/db';

export const createDefaultDatabase = async (fp) =>
  createConnection({
    type: 'sqlite',
    database: fp,
    entities: [ErpModel],
    logging: false,
    synchronize: true,
  })
    .then((conn) => conn)
    .catch((e) => {
      throw e;
    });
