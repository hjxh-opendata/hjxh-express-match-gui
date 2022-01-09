import { errorDbStoringRows } from '../../../../base/db/db_error';

import { errorValidators } from './validatingRoes';

/**
 * parsing rows start
 */
export const errorDecodingRow = 'ErrorDecodingRow';
export type ErrorDecodingRow = typeof errorDecodingRow;

export const errorParsingRows = [
  errorDecodingRow, // fast-csv读取错误
  ...errorValidators, // 字段校验错误
  ...errorDbStoringRows, // 数据库存储错误
] as const;
export type ErrorParsingRows = typeof errorParsingRows[number];
