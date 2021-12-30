import { MyError } from '../../../@types/errors';
import { ErrorValidateNotNull } from '../../../@types/errors/validate';

export const validateId = (_id: string): string | MyError => {
  if (!_id)
    throw new MyError(ErrorValidateNotNull, `should _id: (${_id}) not null`);
  return String(_id).replace(/='"'" /, '');
};
