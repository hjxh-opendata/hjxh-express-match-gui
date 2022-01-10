/**
 * db
 */
import { IErpItem } from '../parseFile/interface/item';

export const RequestQueryDatabase = 'RequestQueryDatabase';
export type RequestQueryDatabase = typeof RequestQueryDatabase;

/**
 * @param skip: start
 * @param limit: take
 */
export interface IReqQueryDB {
  skip: number;
  limit: number;
}

export interface IContentQueryDB {
  items: IErpItem[];
  length: number;
}
