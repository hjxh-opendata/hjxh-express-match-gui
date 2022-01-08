import { GenericError } from '../../../../base/errors';

import { ErrorValidateNotNull } from './error_types';

export const validateId = (id: string): string => {
  if (!id) throw new GenericError(ErrorValidateNotNull, `should id: (${id}) not null`);
  return String(id).replace(/[=''""'" ]/g, '');
};
