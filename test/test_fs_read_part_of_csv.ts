/**
 * this file, should be encapsulated(封装) into a promisify function
 *
 * but I didnt intend to do this.
 *
 * I am looking for async/await approach.
 */
import fs from 'fs';
import iconv from 'iconv-lite';

const L = 100;
const buf = Buffer.alloc(L);

const fp = 'samples/out_sm.csv';

fs.open(fp, 'r', (e1, fd) => {
  if (e1) throw new Error('open error');

  fs.read(fd, buf, 0, L, 0, (e2) => {
    if (e2) throw new Error('read error');
    if (buf.toString().includes('编号')) {
      console.log('utf-8');
      return;
    }
    if (
      iconv
        .encode(iconv.decode(buf, 'gbk'), 'utf-8')
        .toString()
        .includes('编号')
    )
      console.log('gbk');
    throw new Error('unknown encoding');
  });
});
