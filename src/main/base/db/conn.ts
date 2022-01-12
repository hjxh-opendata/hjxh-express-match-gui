import { createConnection } from 'typeorm';

import { mainGetSetting } from '../settings';
import { ENABLE_DB_LOG } from '../settings/boolean_settings';

import { dataModels } from './models';

export const createDefaultDatabase = async (fp) =>
  createConnection({
    type: 'sqlite',
    database: fp,
    entities: dataModels,
    logging: mainGetSetting('boolean', ENABLE_DB_LOG),
    synchronize: true,
  })
    .then((conn) => conn)
    .catch((e) => {
      throw e;
    });
