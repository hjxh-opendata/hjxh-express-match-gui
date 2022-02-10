import { log } from 'console';
import { createConnection } from 'typeorm';

import { ErpModel } from './src/main/base/db/models/erp';

export const createDefaultDatabase = async (fp: string) =>
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
console.log({processArgs: process.argv})
if(process.argv.length < 2) {
  throw new Error("should have at least 2 args")
}
createDefaultDatabase(process.argv[2]);
