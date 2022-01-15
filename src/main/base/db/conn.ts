import { createConnection, getConnection } from 'typeorm';

import { mainGetSetting } from '../settings';
import { ENABLE_DB_LOG } from '../settings/boolean_settings';

import { dataModels } from './models';

export const createDefaultDatabase = async (fp) =>
  createConnection({
    type: 'sqlite',
    database: fp,
    entities: dataModels,
    logging: mainGetSetting('boolean', ENABLE_DB_LOG),
    /**
     * 1.
     * disable the `synchronize`, may help me to insert data easier without the check for FOREIGN KEYS
     * ref: https://stackoverflow.com/a/59673020/9422455
     *
     * 2. however, when the `synchronize` is disabled, the tables won't auto create, and causing later problems of `no such table`
     */
    synchronize: true,
  })
    .then((conn) => conn)
    .catch((e) => {
      throw e;
    });

export const emptyDatabase = async () => {
  dataModels.forEach((model) => {
    getConnection()
      .getRepository(model)
      .clear()
      .then(() => {
        return console.log('cleared table: ' + model.name);
      })
      .catch((e) => {
        console.error(e);
      });
  });
};

export const dropDatabase = async () => {
  await getConnection()
    .dropDatabase()
    .then(() => {
      return console.log('dropped database');
    })
    .catch((e) => {
      console.error(e);
    });
};
