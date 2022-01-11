import mock_db from '../../../../test/mock_db';

import { DataMode } from './base';
import { queryDB } from './db';

const testQueryDB = async () => {
  await mock_db();

  const data = await queryDB({
    limit: 2,
    skip: 0,
    mode: process.argv[2] as DataMode,
  });
  console.log(data);
};

testQueryDB();
