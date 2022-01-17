import * as csv from '@fast-csv/parse';
import fs from 'fs';
import iconv from 'iconv-lite';
import progressStream from 'progress-stream';

import { ValidEncoding } from '../../src/main/@types/erp_read';
import { MyErrorType } from '../../src/main/@types/errors';

import { checkCsvEncoding } from '../../src/main/handlers/parse/utils';

import ReadWriteStream = NodeJS.ReadWriteStream;

const handleReadFile = async (fp: string) => {
  console.log(`reading file, name: ${fp}`);
  const encoding = await checkCsvEncoding(fp);
  console.log({ encoding });
  if (!(encoding in ValidEncoding))
    return console.log(MyErrorType.ErrorUnknownEncoding);

  let progress;
  const pipeProgressStream = progressStream(
    { length: fs.statSync(fp).size, time: 100 },
    (_) => {
      progress = _;
    }
  );
  let s = fs.createReadStream(fp) as unknown as ReadWriteStream;
  if (encoding === ValidEncoding.gbk)
    s = s.pipe(iconv.decodeStream('gbk')).pipe(iconv.encodeStream('utf-8'));

  /**
   * 需要把`pipeProgressStream`放在`csv`之前
   */
  return s
    .pipe(pipeProgressStream)
    .pipe(csv.parse({ headers: false }))
    .on('data', (item: any) => {
      console.log({ item, progress });
    })
    .on('error', console.error)
    .on('end', () => {
      console.log('finished');
    });
};

handleReadFile(
  '/Users/mark/Documents/mark_projects/皇家小虎/HJXH/hjxh_express_match/erb/samples/erp_sm.csv'
);
