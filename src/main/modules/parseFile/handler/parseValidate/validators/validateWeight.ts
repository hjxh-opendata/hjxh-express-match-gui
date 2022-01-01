import { GenericError } from '../../../../base/GenericError';
import { ErrorValidateInvalid } from '../error_types';

export const validateWeight = (weightInput: string): number => {
  let weight;
  try {
    weight = parseFloat(weightInput) as number;
  } catch (e) {
    throw new GenericError(ErrorValidateInvalid, `should weight(${weightInput}) is a number`);
  }
  if (weight <= 0) throw new GenericError(ErrorValidateInvalid, `should weight(${weight}) > 0`);
  return weight;
};
