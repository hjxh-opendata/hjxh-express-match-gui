import { GenericError } from '../../../base/GenericError';

import { ErrorValidateNotNull } from './error_types';

export const validateId = (_id: string): string => {
  if (!_id) throw new GenericError(ErrorValidateNotNull, `should _id: (${_id}) not null`);
  return String(_id).replace(/[=''""'" ]/g, '');
};
