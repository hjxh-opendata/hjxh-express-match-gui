import { parse } from 'csv-parse';
import fs from 'fs';
import iconv from 'iconv-lite';

const parser = parse({
  // delimiter: ',',
  // quote: '"',
  // ltrim: true,
  // rtrim: true,
});

parser.on('readable', () => {
  let record;
  while ((record = parser.read()) != null) {
    console.log(record);
  }
});

parser.on('error', (e) => {
  console.error('error!');
  console.error(e.message);
});

parser.on('end', () => {
  console.log('end');
});

fs.createReadStream('./samples/out_utf-8.csv')
  // .replace(/^\ufeff/, '')
  .pipe(iconv.decodeStream('gbk'))
  .pipe(iconv.encodeStream('utf-8'))
  // .pipe(fs.createWriteStream('./samples/out_utf-8.csv'));
  .pipe(parser);
