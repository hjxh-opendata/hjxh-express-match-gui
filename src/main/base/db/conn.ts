import { createConnection } from 'typeorm';

import { dataModels } from '../../modules/parseFile/db';

export const createDefaultDatabase = async (fp) =>
  createConnection({
    type: 'sqlite',
    database: fp,
    entities: dataModels,
    logging: false,
    synchronize: true,
  })
    .then((conn) => conn)
    .catch((e) => {
      throw e;
    });
