export const PROVINCE_LIST = [
  '湖南',
  '安徽',
  '浙江',
  '广东',
  '湖北',
  '江西',
  '上海',
  '江苏',
  '北京',
  '河北',
  '河南',
  '天津',
  '福建',
  '山东',
  '广西',
  '山西',
  '贵州',
  '四川',
  '重庆',
  '云南',
  '海南',

  '陕西',
  '黑龙江',
  '吉林',
  '辽宁',

  '甘肃',
  '宁夏',
  '内蒙古',

  '青海',
  '新疆',
  '西藏',
];

export const PROVINCE_CHARS = Array.from(new Set(PROVINCE_LIST.join(''))).join('');

// "".join(set("".join(PROVINCE_LIST)))
