/**
 * erp (base)
 */

export const COL_ID = 'id';
export type COL_ID = typeof COL_ID;

export const COL_AREA = 'area';
export type COL_AREA = typeof COL_AREA;

export const COL_WEIGHT = 'weight';
export type COL_WEIGHT = typeof COL_WEIGHT;

export const COL_DATE = 'date';
export type COL_DATE = typeof COL_DATE;

export const COL_CP_NAME = 'cp';
export type COL_CP_NAME = typeof COL_CP_NAME;

export const erpCols = [COL_ID, COL_DATE, COL_WEIGHT, COL_AREA, COL_CP_NAME] as const;
// ref: - [Typescript derive union type from tuple/array values - Stack Overflow](https://stackoverflow.com/questions/45251664/typescript-derive-union-type-from-tuple-array-values)
export type ErpCols = typeof erpCols[number];

/**
 * trd (based on erp)
 */

export const COL_FEE = 'fee';
export type COL_FEE = typeof COL_FEE;

export const trdCols = [...erpCols, COL_FEE] as const;
export type TrdCols = typeof trdCols[number];
