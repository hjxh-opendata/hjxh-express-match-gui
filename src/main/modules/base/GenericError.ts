export class GenericError<T> extends Error {
  public errorType: T;

  constructor(errorType: T, msg: string) {
    super(msg);
    this.errorType = errorType;
  }

  public toString() {
    return `[error] type: ${this.errorType}, msg: ${this.message}`;
  }
}
