export interface IDbResultBase {
  nTotal: number;
  nTimeout: number;
  nUnknown: number;
  nTableNotExist: number;
}

export interface IDbInsertResult extends IDbResultBase {
  nInserted: number;
  nDuplicated: number;
}

export const initDbInsertResult = (): IDbInsertResult => ({
  nTotal: 0,
  nInserted: 0,
  nDuplicated: 0,
  nTimeout: 0,
  nUnknown: 0,
  nTableNotExist: 0,
});

export interface IDbUpdateResult extends IDbResultBase {
  nUpdated: number;
  nDropped: number;
}

export const initDbUpdateResult = (): IDbUpdateResult => ({
  nTotal: 0,
  nUpdated: 0,
  nDropped: 0,
  nTimeout: 0,
  nUnknown: 0,
  nTableNotExist: 0,
});
