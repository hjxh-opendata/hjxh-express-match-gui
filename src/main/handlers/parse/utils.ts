import fs from 'fs';
import iconv from 'iconv-lite';

import { ValidEncoding } from '../../@types/erp_read';
import { MyError } from '../../@types/errors';
import { ErrorUnknownEncoding } from '../../@types/errors/parse';
import { ErrorOpenFile, ErrorReadFile } from '../../@types/errors/pre_parse';

export const checkCsvEncoding = (fp: string): Promise<ValidEncoding> =>
  new Promise((resolve, reject) => {
    // open flag: [File system | Node.js v17.3.0 Documentation](https://nodejs.org/api/fs.html#file-system-flags)
    fs.open(fp, 'r', (err, fd) => {
      if (err) return reject(new MyError(ErrorOpenFile, fp));
      const buffer = Buffer.alloc(100);
      return fs.read(fd, buffer, 0, 100, 0, (err2) => {
        if (err2) return reject(new MyError(ErrorReadFile, fp));
        if (buffer.toString().includes('编号'))
          return resolve(ValidEncoding.utf_8);
        if (
          iconv
            .encode(
              iconv.decode(buffer, ValidEncoding.gbk),
              ValidEncoding.utf_8
            )
            .toString()
            .includes('编号')
        )
          return resolve(ValidEncoding.gbk);
        return reject(new MyError(ErrorUnknownEncoding, fp));
      });
    });
  });
