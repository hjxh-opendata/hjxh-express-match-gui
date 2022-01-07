import { IDbInsertResult, IDbUpdateResult } from '../../db/db_result';

export type Row = Record<string, string>;

export const isRow = (row: Row | string[]): row is Row => {
  return !Array.isArray(row);
};

export interface IContentWithRow {
  row?: Row;
}

export interface IParseResult {
  startTime: Date;
  parseEndTime: Date;
  dbEndTime: Date;
  parseMileSeconds: number;
  dbMileSeconds: number;
  nTotalRows: number;
  nSavedRows: number;
  nFailedValidation: number;
  sizePct: number;
  rowsPct: number;
}

export const initParseResult = (): IParseResult => ({
  startTime: new Date(),
  parseEndTime: new Date(),
  dbEndTime: new Date(),
  parseMileSeconds: 0,
  dbMileSeconds: 0,
  nTotalRows: 0,
  nSavedRows: 0,
  nFailedValidation: 0,
  sizePct: 0,
  rowsPct: 0,
});

export interface IContentWithResult {
  result: {
    dbResult: IDbInsertResult | IDbUpdateResult;
    parseResult: IParseResult;
  };
}
