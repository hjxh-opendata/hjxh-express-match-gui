/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import fs from 'fs';
import iconv from 'iconv-lite';
import path from 'path';
import { URL } from 'url';

import { Errors, ValidEncoding } from '../universal';

export const resolveHtmlPath = (htmlFileName: string) => {
  if (process.env.NODE_ENV !== 'development')
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;

  const port = process.env.PORT || 1212;
  const url = new URL(`http://localhost:${port}`);
  url.pathname = htmlFileName;
  return url.href;
};

export class TestCSVEncodingError extends Error {}

export const testCsvEncoding = (fp: string): Promise<ValidEncoding> =>
  new Promise((resolve, reject) => {
    // open flag: [File system | Node.js v17.3.0 Documentation](https://nodejs.org/api/fs.html#file-system-flags)
    fs.open(fp, 'r', (err, fd) => {
      if (err) return reject(new TestCSVEncodingError(Errors.ErrorOpenFile));
      const buffer = Buffer.alloc(100);
      return fs.read(fd, buffer, 0, 100, 0, (err2) => {
        if (err2) return reject(new TestCSVEncodingError(Errors.ErrorReadFile));
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
        return reject(new TestCSVEncodingError(Errors.ErrorUnknownEncoding));
      });
    });
  });

export const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};
