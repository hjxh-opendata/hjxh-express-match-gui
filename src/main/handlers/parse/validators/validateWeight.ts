import { MyError } from '../../../@types/errors';
import { ErrorValidateInvalid } from '../../../@types/errors/validate';

export const validateWeight = (weightInput: string): number => {
  let weight;
  try {
    weight = parseFloat(weightInput) as number;
  } catch (e) {
    throw new MyError(
      ErrorValidateInvalid,
      `should weight(${weightInput}) is a number`
    );
  }
  if (weight <= 0)
    throw new MyError(ErrorValidateInvalid, `should weight(${weight}) > 0`);
  return weight;
};
