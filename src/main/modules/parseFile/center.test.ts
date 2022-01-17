import mock_db from '../../../../test/mock_db';

import { handleParseFileCenter } from './center';

const fp = process.argv[2];
// eslint-disable-next-line promise/catch-or-return
mock_db().then(() => {
  let cnt = 0;
  const sTime = new Date().getTime();
  return handleParseFileCenter({
    fp,
    isErp: /erp/i.test(fp),
    onData: () => {
      cnt += 1;
      if (cnt % 1000 === 1) {
        const cTime = new Date().getTime();
        const seconds = (cTime - sTime) / 1000;
        // eslint-disable-next-line no-bitwise
        const dps = (cnt / seconds) >> 0;
        const minutesOfMillionItems = parseFloat((1e6 / dps / 60).toFixed(2));
        console.log({ cnt, seconds, dps, minutesOfMillionItems });
      }
    },
  });
});
