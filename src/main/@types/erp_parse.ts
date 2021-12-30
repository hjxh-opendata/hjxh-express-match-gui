import { Progress } from 'progress-stream';

import { IErpItem } from './erp_keys';
import { MyErrorType } from './errors';

export interface IParseBase {
  line: number;
  row: string[] | Record<string, any>;
  progress: Progress;
}

export interface IParseError extends IParseBase {
  errorType: MyErrorType;
}

export interface IParseData extends IParseBase {
  data: IErpItem;
}
