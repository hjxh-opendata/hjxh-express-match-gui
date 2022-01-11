import { createConnection } from 'typeorm';

import { dataModels } from './models';

export const createDefaultDatabase = async (fp) =>
  createConnection({
    type: 'sqlite',
    database: fp,
    entities: dataModels,
    logging: process.env.DEBUG_DB === 'true',
    synchronize: true,
  })
    .then((conn) => conn)
    .catch((e) => {
      throw e;
    });
