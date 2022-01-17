export type Row = Record<string, string>;

export interface IParsingProgress {
  /**
   * parse file by size
   */
  parseStartTime: Date;
  parseFinishedTime: Date;
  parseSpentMileSeconds: number;

  sizePct: number;

  /**
   * parse file by rows
   */
  nRowsTotal: number;
  nRowsFailedForValidation: number;
  nRowsFailedForStoringDB: number;
  nRowsSuccess: number;

  rowsPct: number;

  /**
   * db time
   */
  finalFinishedTime: Date;
  finalSpentMileSeconds: number;
}

export class ParsingProgress {
  /**
   * parse file time relative
   * @type {Date}
   * @private
   */
  private parseStartTime: Date;

  private parseFinishedTime: Date;

  private parseSpentMileSeconds: number;

  private sizePct: number;

  private isFileParsingFinished: boolean;

  /**
   * parse file rows relative
   * @type {number}
   * @private
   */
  private nRowsTotal: number;

  private nRowsHandled: number;

  private rowsPct: number;

  /**
   * file rows handled relative
   * @type {number}
   * @private
   */
  private nRowsSuccess: number;

  private nRowsFailedForValidation: number;

  private nRowsFailedForStoringIntoDB: number;

  /**
   * db finished
   */
  private finalFinishedTime: Date;

  private finalSpentMileSeconds: number;

  constructor() {
    this.parseStartTime = new Date();
    this.isFileParsingFinished = false;

    this.nRowsTotal =
      this.nRowsHandled =
      this.nRowsSuccess =
      this.nRowsFailedForStoringIntoDB =
      this.nRowsFailedForValidation =
      this.sizePct =
      this.rowsPct =
        0;
  }

  public updatePreparingRow() {
    this.nRowsTotal += 1;
  }

  private updateRowsHandled() {
    this.nRowsHandled += 1;
    this.rowsPct = (this.nRowsHandled / this.nRowsTotal) * 100;
  }

  public updateRowParsed() {
    this.nRowsSuccess += 1;
    this.updateRowsHandled();
  }

  public updateRowFailedForValidation() {
    this.nRowsFailedForValidation += 1;
    this.updateRowsHandled();
  }

  public updateRowFailedForStoringIntoDB() {
    this.nRowsFailedForStoringIntoDB += 1;
    this.updateRowsHandled();
  }

  public updateFileParsingFinished() {
    this.parseFinishedTime = new Date();
    this.parseSpentMileSeconds = this.parseFinishedTime.getTime() - this.parseStartTime.getTime();
    this.isFileParsingFinished = true;
  }

  public isFinishedStoring(): boolean {
    const b =
      this.isFileParsingFinished &&
      this.nRowsTotal ===
        this.nRowsSuccess + this.nRowsFailedForValidation + this.nRowsFailedForStoringIntoDB;
    if (b) {
      /**
       * update final time
       */
      this.finalFinishedTime = new Date();
      this.finalSpentMileSeconds = this.finalFinishedTime.getTime() - this.parseStartTime.getTime();
      this.isFileParsingFinished = false;
    }
    return b;
  }

  /**
   * @description since the size percent based on file size transferred is possible to exceed 1, so we need do a revision
   * @param {number} sizePct
   */
  public updateSizePct(sizePct: number) {
    this.sizePct = Math.min(sizePct, 1) * 100;
  }

  public export(): IParsingProgress {
    return {
      parseStartTime: this.parseStartTime,
      parseFinishedTime: this.parseFinishedTime,
      parseSpentMileSeconds: this.parseSpentMileSeconds,
      sizePct: this.sizePct,
      nRowsTotal: this.nRowsTotal,
      nRowsSuccess: this.nRowsSuccess,
      nRowsFailedForValidation: this.nRowsFailedForValidation,
      nRowsFailedForStoringDB: this.nRowsFailedForStoringIntoDB,
      rowsPct: this.rowsPct,
      finalFinishedTime: this.finalFinishedTime,
      finalSpentMileSeconds: this.finalSpentMileSeconds,
    };
  }
}
