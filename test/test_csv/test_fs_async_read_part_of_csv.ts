import fs from 'fs';
import iconv from 'iconv-lite';

const sfp = 'samples/out_sm.csv';
const ENCODING = 'gbk';
const TARGET = '编号';
const N = 100;

const isGBK = (buf: Buffer) =>
  iconv
    .decode(iconv.encode(buf.toString(), ENCODING), 'utf-8')
    .toString()
    .includes(TARGET);

const asyncTestEncoding1 = (fp: string) =>
  new Promise((resolve, reject) => {
    fs.open(fp, 'r', (err, fd) => {
      if (err) return reject(err);
      const buf = Buffer.alloc(N);
      return fs.read(fd, buf, 0, N, 0, (err2) => {
        if (err2) return reject(err2);
        if (buf.toString().includes(TARGET)) return resolve('utf-8');
        return isGBK(buf) ? resolve(ENCODING) : reject(new Error('unknown'));
      });
    });
  });

const asyncTestEncoding2 = async (fp: string) =>
  new Promise((resolve, reject) => {
    let data;
    fs.createReadStream(fp, { end: N })
      .on('data', (e: Buffer) => (data += e))
      .on('end', () => {
        if (data.toString().includes(TARGET)) return resolve('utf-8');
        return isGBK(data) ? resolve(ENCODING) : reject(new Error('unknown'));
      });
  });

(async () => {
  let T1 = 0,
    T2 = 0;
  for (let i = 0; i < 10000; i++) {
    const t1 = new Date().getTime();
    await asyncTestEncoding1(sfp);
    const t2 = new Date().getTime();
    await asyncTestEncoding2(sfp);
    const t3 = new Date().getTime();
    T1 += t2 - t1;
    T2 += t3 - t2;
  }
  console.log({ T1, T2 });
})();
