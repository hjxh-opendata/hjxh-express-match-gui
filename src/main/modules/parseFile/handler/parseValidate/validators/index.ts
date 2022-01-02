import { erpKeyMap } from '../../const';
import { ErpPosMap } from '../../parse_base';
import { IErpItem } from '../../parse_success';

import { validateCpName } from './validateCpName';
import { validateDate } from './validateDate';
import { validateId } from './validateId';
import { validateWeight } from './validateWeight';
import { validateArea } from './validate_area/validateArea';

/**
 * when validate using header, then the keys are to serve as the bridge to database columns
 * @param data
 */
export const validateErpItemWithHeader = (data: { [key: string]: string }): IErpItem => {
  return {
    id: validateId(data[erpKeyMap.id]),
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
export const validateErpItemWithoutHeader = (data: string[], erpPosMap: ErpPosMap): IErpItem => {
  return {
    id: validateId(data[erpPosMap.id]),
    weight: validateWeight(data[erpPosMap.weight]),
    date: validateDate(data[erpPosMap.date]),
    area: validateArea(data[erpPosMap.area]),
    cpName: validateCpName(data[erpPosMap.cpName]),
  };
};
