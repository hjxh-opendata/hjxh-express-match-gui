export enum ErpKeys {
  _id = '_id',
  area = 'area',
  weight = 'weight',
  date = 'date',
  cpName = 'cpName',
}

// omit the `weight` key since the type of all other is string, whereas we wanna it to be a number
// inspired by: https://stackoverflow.com/a/67896916/9422455
type ErpItemFields = Omit<Record<ErpKeys, string>, ErpKeys.weight>;

export interface IErpItem extends ErpItemFields {
  weight: number;
}

// ref: https://stackoverflow.com/a/58812812/9422455
export type ErpPosMap = Record<ErpKeys, number>;
