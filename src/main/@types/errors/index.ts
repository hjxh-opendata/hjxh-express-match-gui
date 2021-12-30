import { ErrorParsing } from './parse';
import { ErrorPreParseFile } from './pre_parse';
import { ErrorValidate } from './validate';

export type MyErrorType = ErrorPreParseFile | ErrorParsing | ErrorValidate;

export class MyError extends Error {
  public errorType: MyErrorType;
  public msg: string;

  constructor(errorType: MyErrorType, msg: string) {
    super(msg);
    this.msg = msg;
    this.errorType = errorType;
  }

  public toString() {
    return `[error] type: ${this.errorType}, msg: ${this.msg}`;
  }
}
