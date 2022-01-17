import { GenericError } from '../../../../base/interface/errors';
import { ErrorValidateInvalid } from '../../interface/errors/validatingRoes';

export const validatePositive = (numInput: string): number => {
  let numOutput;
  try {
    numOutput = parseFloat(numInput) as number;
  } catch (e) {
    throw new GenericError(ErrorValidateInvalid, `should weight(${numInput}) is a number`);
  }
  if (numOutput <= 0)
    throw new GenericError(ErrorValidateInvalid, `should weight(${numOutput}) > 0`);
  return numOutput;
};
