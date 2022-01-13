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
     * disable the `synchronize`, may help me to insert data easier without the check for FOREIGN KEYS
     * ref: https://stackoverflow.com/a/59673020/9422455
     */
    synchronize: false,
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
