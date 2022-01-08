import { IErpItem } from '../parse_success';

import { validateArea } from './validateArea';
import { validateCpName } from './validateCpName';
import { validateDate } from './validateDate';
import { validateId } from './validateId';
import { validateWeight } from './validateWeight';

/**
 * when validate using header, then the keys are to serve as the bridge to database columns
 * @param data
 */
export const validateErpItemWithHeader = (data: IErpItem): IErpItem => {
  return {
    id: validateId(data.id),
    weight: validateWeight(data.weight as unknown as string),
    date: validateDate(data.date),
    area: validateArea(data.area),
    cp: validateCpName(data.cp),
  };
};
