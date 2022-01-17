import { errorPreParsingRows } from './preParsingRows';
import { errorParsingRows } from './parsingRows';

/**
 * parsing rows end
 */

export const errorParsingFiles = [
  ...errorPreParsingRows,     // 解析行之前的问题
  ...errorParsingRows         // 解析行时的问题
] as const;
export type ErrorParsingFile = typeof errorParsingFiles[number];
