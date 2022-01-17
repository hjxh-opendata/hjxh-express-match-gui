import * as csv from '@fast-csv/parse';
import * as fs from 'fs';
import iconv from 'iconv-lite';

import { SizeTransformer } from '../src/main/modules/parseFile/handler/SizeTransformer';

const fp = process.argv[2];
const { size } = fs.statSync(fp);
fs.createReadStream(fp)
  .pipe(new SizeTransformer(size))
  .pipe(iconv.decodeStream('gbk'))
  .pipe(iconv.encodeStream('utf-8'))
  .pipe(csv.parse({ headers: false }))
  .on('data', (data) => {
    console.log({ length: data.length });
  })
  .on('error', (err) => {
    console.error(err);
  })
  .on('end', () => {
    console.log('end');
  });
