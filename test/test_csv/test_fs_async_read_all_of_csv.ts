import { promises as fs } from 'fs';
import iconv from 'iconv-lite';

const sfp = 'samples/out_sm.csv';

/**
 * this method is ok, except it would read all the file content, since there's not an option in `readFile` for partially read
 * refer: - [Feature request: partial reading option in .readFile / .readFileSync · Issue #6805 · nodejs/node-v0.x-archive](https://github.com/nodejs/node-v0.x-archive/issues/6805)
 * @param fp: file path
 */
const testEncoding = async (fp: string) => {
  const rr = await fs.readFile(fp, { encoding: 'utf-8', flag: 100 });
  console.log(rr);
  const rc = iconv.decode(iconv.encode(rr, 'gbk'), 'utf-8').toString();
  console.log(rc);
};

testEncoding(sfp).catch(console.error);
