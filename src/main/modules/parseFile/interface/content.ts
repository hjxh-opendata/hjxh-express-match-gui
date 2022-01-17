import { GenericError, Status } from '../../../base/interface/errors';
import { ErrorType } from '../../../center';

import { IErpItem, ITrdItem } from './item';
import { IParsingProgress } from './rows';

/**
 * response content
 */
export interface IContentSuccess {
  status: Status.OK;
  progress: IParsingProgress;
  parsedItem: IErpItem | ITrdItem;
}

export const isContentSuccess = (content): content is IContentSuccess =>
  content.status === Status.OK;

export interface IContentEnd {
  status: Status.OVER;
  progress: IParsingProgress;
}

export const isContentEnd = (content): content is IContentEnd => content.status === Status.OVER;

export interface IContentError {
  status: Status;
  error: GenericError<ErrorType>;
}

export const isContentError = (content): content is IContentError =>
  content.status !== Status.OK && content.status !== Status.OVER;
export type IContentParsingFile = IContentSuccess | IContentEnd | IContentError;
