import fs from 'fs';
import iconv from 'iconv-lite';

import { GenericError } from '../../base/GenericError';
import { ErrorOpenFile, ErrorReadFile } from '../../selectFile/error_types';
import { ErrorUnknownEncoding } from '../error_types';

import { ValidEncoding } from './const';

export const checkCsvEncoding = (fp: string): Promise<ValidEncoding> =>
  new Promise((resolve, reject) => {
    // open flag: [File system | Node.js v17.3.0 Documentation](https://nodejs.org/api/fs.html#file-system-flags)
    fs.open(fp, 'r', (err, fd) => {
      if (err) return reject(new GenericError(ErrorOpenFile, fp));
      const buffer = Buffer.alloc(100);
      return fs.read(fd, buffer, 0, 100, 0, (err2) => {
        if (err2) return reject(new GenericError(ErrorReadFile, fp));
        if (buffer.toString().includes('编号')) return resolve(ValidEncoding.utf_8);
        if (iconv.encode(iconv.decode(buffer, ValidEncoding.gbk), ValidEncoding.utf_8).toString().includes('编号'))
          return resolve(ValidEncoding.gbk);
        return reject(new GenericError(ErrorUnknownEncoding, fp));
      });
    });
  });
