import fs from 'fs';
import iconv from 'iconv-lite';

import { GenericError } from '../../../base/errors';
import { debugEnabled } from '../../../base/utils';
import { ErrorOpenFile, ErrorReadFile } from '../../selectFile/error_types';
import {
  COL_ID,
  ENCODING_FLAG_AS_ID,
  ErrorParsingHeader,
  ErrorUnknownEncoding,
  erpCols,
  trdCols,
} from '../const';

enum ValidEncoding {
  utf_8 = 'utf_8',
  gbk = 'gbk',
}

const checkChinese = (s: string): boolean => {
  return s.includes(ENCODING_FLAG_AS_ID);
  // const CHECK_ENCODING_TARGET_STRING_LIST = [COL_ID, '号'];
  // return CHECK_ENCODING_TARGET_STRING_LIST.some((k) => s.includes(k));
};

export const checkCols = (s: string, targetCols: readonly string[]): boolean => {
  return targetCols.every((col) => s.includes(col === COL_ID ? ENCODING_FLAG_AS_ID : col));
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
    if (debugEnabled()) console.log('opening file: ' + fp);
    fs.open(fp, 'r', (err, fd) => {
      if (err) return reject(new GenericError(ErrorOpenFile, fp));

      const buffer = Buffer.alloc(100);
      if (debugEnabled()) console.log('reading buffer: ' + buffer);
      return fs.read(fd, buffer, 0, 100, 0, (err2) => {
        if (err2) return reject(new GenericError(ErrorReadFile, fp));

        // check encoding
        let s = buffer.toString();
        let encoding;
        if (debugEnabled()) console.log('converted string: ' + s);
        if (checkChinese(s)) encoding = ValidEncoding.utf_8;
        else {
          s = iconv.encode(iconv.decode(buffer, ValidEncoding.gbk), ValidEncoding.utf_8).toString();
          if (debugEnabled()) console.log('iconv converted string: ' + s);
          if (checkChinese(s)) encoding = ValidEncoding.gbk;
          else return reject(new GenericError(ErrorUnknownEncoding, s));
        }

        // check cols
        const targetCols = isErp ? erpCols : trdCols;
        if (debugEnabled()) console.log('targetCols: ' + targetCols);
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
