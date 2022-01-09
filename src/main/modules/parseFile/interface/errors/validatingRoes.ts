/**
 * validate
 */

export const ErrorValidateNotNull = 'ErrorValidateNotNull';
export type ErrorValidateNotNull = typeof ErrorValidateNotNull;

export const ErrorValidateDuplicate = 'ErrorValidateDuplicate';
export type ErrorValidateDuplicate = typeof ErrorValidateDuplicate;

export const ErrorValidateInvalid = 'ErrorValidateInvalid';
export type ErrorValidateInvalid = typeof ErrorValidateInvalid;

export const errorValidators = [
  ErrorValidateInvalid,
  ErrorValidateDuplicate,
  ErrorValidateNotNull,
] as const;
export type ErrorValidators = typeof errorValidators[number];

export const isValidatingError = (err: ErrorValidators): err is ErrorValidators =>
  errorValidators.includes(err);
