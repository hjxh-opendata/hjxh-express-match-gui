import { Progress } from 'progress-stream';

import { IResBase } from '../../base/response';

import { ErpKeys } from './const';

export type Row = Record<string, string>;

export const isRow = (row: Row | string[]): row is Row => {
  return !Array.isArray(row);
};

/**
 * res parse file
 */
export interface IParseContentBase {
  line: number;
  row: Row;
}

export interface IParseContentBase2Progress extends IParseContentBase {
  progress: Progress;
}

// ref: https://stackoverflow.com/a/58812812/9422455
export type ErpPosMap = Record<ErpKeys, number>;
