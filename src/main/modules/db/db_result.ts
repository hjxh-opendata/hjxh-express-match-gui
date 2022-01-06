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

export type IDbResult = IDbUpdateResult & IDbInsertResult;

export const resultTrans: { [key in keyof IDbResult]: string } = {
  nTotal: '总条目',
  nUnknown: '未知问题',
  nTimeout: '数据库插入超时',
  nTableNotExist: '表不存在出错',
  nDuplicated: '插入重复',
  nInserted: '插入成功',
  nUpdated: '更新成功',
  nDropped: '更新失败',
};
