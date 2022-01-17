/**
 * erp (base) start
 */
export const COL_ID = 'id';
export type COL_ID = typeof COL_ID;

export const COL_AREA = 'area';
export type COL_AREA = typeof COL_AREA;

export const COL_WEIGHT = 'weight';
export type COL_WEIGHT = typeof COL_WEIGHT;

export const COL_DATE = 'date';
export type COL_DATE = typeof COL_DATE;

export const COL_CP = 'cp';
export type COL_CP = typeof COL_CP;

export const erpCols = [COL_ID, COL_DATE, COL_WEIGHT, COL_AREA, COL_CP] as const;
export type ErpCols = typeof erpCols[number];
/**
 * trd (based on erp) start
 */

export const COL_FEE = 'fee';
export type COL_FEE = typeof COL_FEE;

export const trdCols = [...erpCols, COL_FEE] as const;
export type TrdCols = typeof trdCols[number];
