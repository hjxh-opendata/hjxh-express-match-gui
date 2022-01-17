import { GenericError } from '../../../../base/interface/errors';
import { ErrorValidateNotNull } from '../../interface/errors/validatingRoes';

export const validateId = (id: string): string => {
  if (!id) throw new GenericError(ErrorValidateNotNull, `should id: (${id}) not null`);
  return String(id).replace(/[='"]/g, '');
};
