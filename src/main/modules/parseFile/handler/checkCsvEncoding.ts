import fs from 'fs';
import iconv from 'iconv-lite';

import { GenericError } from '../../base/GenericError';
import { ErrorOpenFile, ErrorReadFile } from '../../selectFile/error_types';
import { COL_ID, erpCols, trdCols } from '../cols';
import { ErrorParsingHeader, ErrorUnknownEncoding } from '../error_types';

enum ValidEncoding {
  utf_8 = 'utf_8',
  gbk = 'gbk',
}

const checkChinese = (s: string): boolean => {
  const CHECK_ENCODING_TARGET_STRING_LIST = [COL_ID, '号'];
  return CHECK_ENCODING_TARGET_STRING_LIST.some((k) => s.includes(k));
};

export const checkCols = (s: string, targetCols: readonly string[]): boolean => {
  return targetCols.every((col) => s.includes(col));
};

/**
 *
 * @param {string} fp
 * @param {boolean} isErp
 * @returns {Promise<boolean>} whether to use iconv (is gbk ?)
 */
export const preParsing = (fp: string, isErp: boolean): Promise<boolean> =>
  new Promise((resolve, reject) => {
    // open flag: [File system | Node.js v17.3.0 Documentation](https://nodejs.org/api/fs.html#file-system-flags)
    fs.open(fp, 'r', (err, fd) => {
      if (err) return reject(new GenericError(ErrorOpenFile, fp));
      const buffer = Buffer.alloc(100);
      return fs.read(fd, buffer, 0, 100, 0, (err2) => {
        if (err2) return reject(new GenericError(ErrorReadFile, fp));

        // check encoding
        let s = buffer.toString();
        let encoding;
        if (checkChinese(s)) encoding = ValidEncoding.utf_8;
        else {
          s = iconv.encode(iconv.decode(buffer, ValidEncoding.gbk), ValidEncoding.utf_8).toString();
          if (checkChinese(s)) encoding = ValidEncoding.gbk;
          else return reject(new GenericError(ErrorUnknownEncoding, s));
        }

        // check cols
        const targetCols = isErp ? erpCols : trdCols;
        if (checkCols(s, targetCols)) resolve(encoding === ValidEncoding.gbk);
        return reject(
          new GenericError(
            ErrorParsingHeader,
            `[${ErrorParsingHeader}], valid headers: [${targetCols}], your headers: [${s}...]`
          )
        );
      });
    });
  });
