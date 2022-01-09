import { COL_FEE, COL_WEIGHT, ErpCols } from './cols';

// omit the `weight` key since the type of all other is string, whereas we wanna it to be a number
// inspired by: https://stackoverflow.com/a/67896916/9422455
type IItem = Omit<Record<ErpCols, string>, COL_WEIGHT>;

export interface IErpItem extends IItem {
  [COL_WEIGHT]: number;
}

export interface ITrdItem extends IErpItem {
  [COL_FEE]: number;
}
