import { createConnection } from 'typeorm';

export const createDefaultDatabase = async (fp) =>
  createConnection({
    type: 'sqlite',
    database: fp,
    entities: [],
    logging: true,
    synchronize: true,
  })
    .then((conn) => {
      console.log('database connection established');

      console.log('clear all the database');
      conn.dropDatabase();

      return conn;
    })
    .catch((e) => {
      throw e;
    });

createDefaultDatabase(
  '/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/erb_sqlite/test.sqlite'
);
