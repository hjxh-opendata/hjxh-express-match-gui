import { ErpPosMap, IErpItem } from '../../../@types/erp_keys';

import { erpKeyMap } from '../../../config/configBusiness';

import { validateArea } from './validateArea';
import { validateCpName } from './validateCpName';
import { validateDate } from './validateDate';
import { validateWeight } from './validateWeight';
import { validateId } from './validate_id';

/**
 * when validate using header, then the keys are to serve as the bridge to database columns
 * @param data
 */
export const validateErpItemWithHeader = (data: {
  [key: string]: string;
}): IErpItem => {
  return {
    _id: validateId(data[erpKeyMap._id]),
    weight: validateWeight(data[erpKeyMap.weight]),
    date: validateDate(data[erpKeyMap.date]),
    area: validateArea(data[erpKeyMap.area]),
    cpName: validateCpName(data[erpKeyMap.cpName]),
  };
};

/**
 * when validate without header, a key map is necessary.
 *
 * besides, there is no difference to validate using header
 * @param data - one row in csv, without header, i.e. a string array
 * @param erpPosMap -
 *
 *    - [key] database key
 *    - [val] index of the key in csv header
 *    - e.g. { _id: 8, area: 5, weight: 7, date: 9, cp_name: 6 }
 */
export const validateErpItemWithoutHeader = (
  data: string[],
  erpPosMap: ErpPosMap
): IErpItem => {
  return {
    _id: validateId(data[erpPosMap._id]),
    weight: validateWeight(data[erpPosMap.weight]),
    date: validateDate(data[erpPosMap.date]),
    area: validateArea(data[erpPosMap.area]),
    cpName: validateCpName(data[erpPosMap.cpName]),
  };
};
