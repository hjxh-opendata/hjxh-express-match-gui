/**
 * validate
 */

export const ErrorValidateNotNull = 'ErrorValidateNotNull';
export type ErrorValidateNotNull = typeof ErrorValidateNotNull;

export const ErrorValidateDuplicate = 'ErrorValidateDuplicate';
export type ErrorValidateDuplicate = typeof ErrorValidateDuplicate;

export const ErrorValidateArea = 'ErrorValidateArea';
export type ErrorValidateArea = typeof ErrorValidateArea;

export const ErrorValidateWeight = 'ErrorValidateWeight';
export type ErrorValidateWeight = typeof ErrorValidateWeight;

export const ErrorValidateDate = 'ErrorValidateDate';
export type ErrorValidateDate = typeof ErrorValidateDate;

export const ErrorValidateFee = 'ErrorValidateFee';
export type ErrorValidateFee = typeof ErrorValidateFee;

export const errorValidators = [
  ErrorValidateWeight,
  ErrorValidateDate,
  ErrorValidateArea,
  ErrorValidateFee,

  ErrorValidateDuplicate,
  ErrorValidateNotNull,
] as const;
export type ErrorValidators = typeof errorValidators[number];

export const isValidatingError = (err: ErrorValidators): err is ErrorValidators =>
  errorValidators.includes(err);
