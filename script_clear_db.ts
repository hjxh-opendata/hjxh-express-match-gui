import { createConnection } from 'typeorm';

import { ErpModel } from './src/main/base/db/models/erp';

export const createDefaultDatabase = async (fp) =>
  createConnection({
    type: 'sqlite',
    database: fp,
    entities: [ErpModel],
    logging: true,
    synchronize: true,
  })
    .then((conn) => {
      console.log(conn.name);
      console.log('database connection established');

      console.log('clear all the database');
      conn.dropDatabase();

      return conn;
    })
    .catch((e) => {
      throw e;
    });

/**
 * pay attention to `quotes` in command line
 */
createDefaultDatabase(process.argv[2]);
