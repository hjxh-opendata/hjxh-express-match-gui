import { GenericError } from '../../../../base/interface/errors';
import { COL_AREA, COL_CP, COL_DATE, COL_FEE, COL_ID, COL_WEIGHT } from '../../interface/cols';
import { ErrorValidators, errorValidators } from '../../interface/errors/validatingRoes';
import { IErpItem, ITrdItem } from '../../interface/item';

import { validateArea } from './validateArea';
import { validateCpName } from './validateCpName';
import { validateDate } from './validateDate';
import { validateId } from './validateId';
import { validatePositive } from './validatePositive';

/**
 * when validate using header, then the keys are to serve as the bridge to database columns
 */
export const validateErpItem = async (item: IErpItem): Promise<void> => {
  try {
    item[COL_ID] = validateId(item[COL_ID]);
    item[COL_WEIGHT] = validatePositive(item[COL_WEIGHT] as unknown as string);
    item[COL_DATE] = validateDate(item[COL_DATE]);
    item[COL_AREA] = validateArea(item[COL_AREA]);
    item[COL_CP] = validateCpName(item[COL_CP]);
  } catch (e) {
    /**
     * a wrapper, for best used by outer function
     */
    throw new GenericError(
      errorValidators,
      `msg: [${(e as GenericError<ErrorValidators>).message}], item: [${JSON.stringify(item)}]`
    );
  }
};

export const validateTrdItem = async (data: ITrdItem): Promise<void> => {
  await validateErpItem(data);
  data[COL_FEE] = validatePositive(data[COL_FEE] as unknown as string);
};
