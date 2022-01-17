import * as csv from '@fast-csv/parse';
import * as fs from 'fs';
import iconv from 'iconv-lite';

fs.createReadStream('./samples/erp_sm.csv', { end: 2000 })
  .pipe(iconv.decodeStream('gbk'))
  .pipe(iconv.encodeStream('utf-8'))
  .pipe(csv.parse({ headers: true }))
  .on('error', (error) => console.error(error))
  .on('data', (row) => console.log(row))
  .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`));
