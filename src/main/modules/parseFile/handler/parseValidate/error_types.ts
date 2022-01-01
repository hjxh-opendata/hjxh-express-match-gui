/**
 * validate
 */

export const ErrorValidateNotNull = 'ErrorValidateNotNull';
export type ErrorValidateNotNull = typeof ErrorValidateNotNull;
export const ErrorValidateDuplicate = 'ErrorValidateDuplicate';
export type ErrorValidateDuplicate = typeof ErrorValidateDuplicate;
export const ErrorValidateInvalid = 'ErrorValidateInvalid';
export type ErrorValidateInvalid = typeof ErrorValidateInvalid;

export type ErrorValidate = ErrorValidateInvalid | ErrorValidateDuplicate | ErrorValidateNotNull;
