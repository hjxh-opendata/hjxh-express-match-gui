import { GenericError } from '../../../../base/interface/errors';
import { assert } from '../../../../base/interface/utils';
import { ErrorValidateInvalid, ErrorValidators } from '../../interface/errors/validatingRoes';

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

export const validateArea = (area: string): string => {
  try {
    const N = area.length;
    let temp = '';
    assert(N >= 2, 'area is at least 2 words');
    for (let i = 0; i < N; i += 1) {
      if (PROVINCE_CHARS.includes(area[i])) {
        assert(i + 1 < N, `cannot ensure what province this address belongs to: ${area}`);
        if (PROVINCE_LIST.includes((temp = area[i] + area[i + 1]))) return temp;
        assert(i + 2 < N, `cannot ensure what province this address belongs to: ${area}`);
        if (PROVINCE_LIST.includes((temp = area[i] + area[i + 1] + area[i + 2]))) return temp;
      }
    }
    throw new Error(`cannot ensure what province this address belongs to: ${area}`);
  } catch (e) {
    throw new GenericError<ErrorValidators>(ErrorValidateInvalid, (e as unknown as Error).message);
  }
};
