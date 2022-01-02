export enum ValidEncoding {
  utf_8 = 'utf_8',
  gbk = 'gbk',
}

export enum ParseKind {
  Success,
  ValidateError,
  ParseError,
  Finish,
}

export enum ErpKeys {
  id = 'id',
  area = 'area',
  weight = 'weight',
  date = 'date',
  cpName = 'cpName',
}

export const erpKeyMap: { [key in ErpKeys]: string } = {
  id: '物流单号',
  area: '收货地区',
  weight: '实际重量',
  date: '发货时间',
  cpName: '物流公司',
};
