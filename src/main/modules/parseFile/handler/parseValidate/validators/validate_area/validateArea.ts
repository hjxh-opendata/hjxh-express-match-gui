import { assert } from '../../../../../../../universal';
import { GenericError } from '../../../../../base/GenericError';
import { ErrorValidate, ErrorValidateInvalid } from '../../error_types';

import { PROVINCE_CHARS, PROVINCE_LIST } from './const';

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
    throw new GenericError<ErrorValidate>(ErrorValidateInvalid, (e as unknown as Error).message);
  }
};
