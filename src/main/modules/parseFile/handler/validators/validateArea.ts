import { GenericError } from '../../../../base/interface/errors';
import { ErrorValidateArea } from '../../interface/errors/validatingRoes';

export const PROVINCE_LIST = [
  ['湖南'],
  ['安徽'],
  ['浙江'],
  ['广东', '深圳'],
  ['湖北'],
  ['江西'],
  ['上海'],
  ['江苏'],
  ['北京'],
  ['河北'],
  ['河南'],
  ['天津'],
  ['福建'],
  ['山东'],
  ['广西'],
  ['山西'],
  ['贵州'],
  ['四川'],
  ['重庆'],
  ['云南'],
  ['海南'],

  ['陕西'],
  ['黑龙江'],
  ['吉林'],
  ['辽宁'],

  ['甘肃'],
  ['宁夏'],
  ['内蒙古'],

  ['青海'],
  ['新疆'],
  ['西藏'],
];

export const validateArea = (inputArea: string): string => {
  const area = inputArea.trim().slice(0, 5);
  // eslint-disable-next-line no-restricted-syntax
  for (const cities of PROVINCE_LIST) {
    if (cities.some((city) => area.includes(city))) {
      return cities[0];
    }
  }
  throw new GenericError(
    ErrorValidateArea,
    `cannot ensure what province this address belongs to: ${inputArea}`
  );
};
