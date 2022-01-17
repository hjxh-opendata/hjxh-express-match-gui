import fs from 'fs';
import iconv from 'iconv-lite';

const fp =
  '/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/erb_sqlite/samples/erp_sm.csv';

/**
 * flags: https://nodejs.org/api/fs.html#:~:text=does%20not%20exist.-,%27r%2B%27,-%3A%20Open%20file%20for
 */
fs.open(fp, 'r+', (err, fd) => {
  if (err) {
    console.error(err);
    return;
  }
  const L = 200;
  const buf = Buffer.alloc(L);
  // ref: https://nodejs.org/api/fs.html#:~:text=subsequent%20read%20operations.-,fs.read(fd%2C%20buffer%2C%20offset%2C%20length%2C%20position%2C%20callback),-%23
  fs.read(fd, buf, 0, L, 0, (err, l, bufRead) => {
    if (err) {
      console.error(err);
      return;
    }
    if (l !== L) {
      console.error('not equal length');
      return;
    }
    console.log({ bufRead });
    const s = iconv.encode(iconv.decode(bufRead, 'gbk'), 'utf-8').toString();
    const s2 = s
      .replace('单号', 'id')
      .replace('重量', 'weight')
      .replace('地区', 'area')
      .replace('日期', 'date')
      .replace('公司', 'cp');
    const bufToWrite = Buffer.alloc(L);
    const bufContent = iconv.encode(s2, 'gbk');
    bufContent.copy(bufToWrite, L - bufContent.length);
    console.log({ s, s2, bufToWrite });

    fs.write(fd, bufToWrite, 0, L, 0, (err, l, bufWrote) => {
      if (err) {
        console.error(err);
        return;
      }
      if (l !== L) {
        console.error('not equal length');
        return;
      }
      console.log({ bufWrote });
    });
  });
});
