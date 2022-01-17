import * as fs from 'fs';
import iconv from 'iconv-lite';

import { GenericError } from '../../../base/interface/errors';
import { isDebugEnabled } from '../../../base/utils';
import { ErrorOpenFile, ErrorReadFile } from '../../selectFile/interface/error_types';
import { COL_ID, erpCols, trdCols } from '../interface/cols';
import { errorInvalidHeader, errorUnknownEncoding } from '../interface/errors/preParsingRows';

enum ValidEncoding {
  utf_8 = 'utf_8',
  gbk = 'gbk',
}

export const SIGNAL_ID = '单号';

const checkChinese = (s: string): boolean => {
  return s.includes(SIGNAL_ID);
  // const CHECK_ENCODING_TARGET_STRING_LIST = [COL_ID, '号'];
  // return CHECK_ENCODING_TARGET_STRING_LIST.some((k) => s.includes(k));
};

/**
 * check whether the first block of string contains all the target columns
 *
 * @param {string} s: the first block of string
 * @param {readonly string[]} targetCols: the targetCols, such as `colsMap[id]`, ...
 * @returns {boolean}
 */
export const checkCols = (s: string, targetCols: readonly string[]): boolean => {
  return targetCols.every((col) => s.includes(col));
};
/**
 *  this method would check encoding, header, and then modify header to english
 * @param {string} fp
 * @param {boolean} isErp
 * @returns {Promise<boolean>} whether to use iconv (is gbk ?)
 */
export const preParsing = (fp: string, isErp: boolean): Promise<boolean> =>
  new Promise((resolve, reject) => {
    // open flag: [File system | Node.js v17.3.0 Documentation](https://nodejs.org/api/fs.html#file-system-flags)
    if (isDebugEnabled()) console.log('opening file: ' + fp);
    fs.open(fp, 'r+', (err, fd) => {
      if (err) return reject(new GenericError(ErrorOpenFile, fp));

      const L = 200;
      const buffer = Buffer.alloc(L);
      if (isDebugEnabled()) console.log('reading buffer: ' + buffer);
      return fs.read(fd, buffer, 0, L, 0, (err2) => {
        if (err2) return reject(new GenericError(ErrorReadFile, fp));

        /**
         * step 1: check encoding
         */
        let s = buffer.toString();
        let encoding;
        if (isDebugEnabled()) console.log('converted string: ' + s);
        if (checkChinese(s)) encoding = ValidEncoding.utf_8;
        else {
          s = iconv.encode(iconv.decode(buffer, ValidEncoding.gbk), ValidEncoding.utf_8).toString();
          if (isDebugEnabled()) console.log('iconv converted string: ' + s);
          if (checkChinese(s)) encoding = ValidEncoding.gbk;
          else return reject(new GenericError(errorUnknownEncoding, s));
        }

        /**
         * step 2: check cols
         */
        s = s.replace(SIGNAL_ID, COL_ID);
        const targetCols = isErp ? erpCols : trdCols;
        if (isDebugEnabled()) console.log('targetCols: ' + targetCols);
        if (!checkCols(s, targetCols))
          // prettier-ignore
          return reject(new GenericError(errorInvalidHeader, `[${errorInvalidHeader}], valid headers: [${targetCols}], your headers: [${s}...]`));

        /**
         * step 3: return the decision of whether to use iconv
         */
        return resolve(encoding === ValidEncoding.gbk);
      });
    });
  });
