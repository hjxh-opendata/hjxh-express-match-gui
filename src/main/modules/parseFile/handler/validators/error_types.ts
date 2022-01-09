/**
 * validate
 */
import { MyErrorType } from '../../../../center';

export const ErrorValidateNotNull = 'ErrorValidateNotNull';
export type ErrorValidateNotNull = typeof ErrorValidateNotNull;
export const ErrorValidateDuplicate = 'ErrorValidateDuplicate';
export type ErrorValidateDuplicate = typeof ErrorValidateDuplicate;
export const ErrorValidateInvalid = 'ErrorValidateInvalid';
export type ErrorValidateInvalid = typeof ErrorValidateInvalid;

export const errorValidates = [ErrorValidateInvalid, ErrorValidateDuplicate, ErrorValidateNotNull];
export type ErrorValidate = ErrorValidateInvalid | ErrorValidateDuplicate | ErrorValidateNotNull;

export const isErrorValidate = (err: MyErrorType): boolean => errorValidates.includes(err);
