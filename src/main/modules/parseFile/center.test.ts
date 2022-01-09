import mock_db from '../../../../test/mock_db';

import { handleParseFileCenter } from './center';

const fp = process.argv[2];
// eslint-disable-next-line promise/catch-or-return
mock_db.then(() => {
  return handleParseFileCenter({ fp, isErp: true });
});
