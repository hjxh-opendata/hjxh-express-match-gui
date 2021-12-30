import { ErpKeys } from '../@types/erp_keys';

export const erpKeyMap: { [key in ErpKeys]: string } = {
  _id: '物流单号',
  area: '收货地区',
  weight: '实际重量',
  date: '发货时间',
  cpName: '物流公司',
};

export const MsgWhenParseHeaderError =
  '由于文件格式不规范导致无法解析，请在wps/excel中另存为.csv格式，然后尝试重新上传。\n如果仍无法解决，请反馈！';
