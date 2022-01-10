/**
 * db
 */
import { IRes } from '../../base/interface/response';
import { IErpItem } from '../parseFile/interface/item';

import { DataMode } from './base';

export const RequestQueryDatabase = 'RequestQueryDatabase';
export type RequestQueryDatabase = typeof RequestQueryDatabase;

/**
 * @param skip: start
 * @param limit: take
 */
export interface IReqQueryDB {
  mode: DataMode;
  skip: number;
  limit: number;
}

export interface IContentQueryDB {
  items: IErpItem[];
  length: number;
}

export interface IResQueryDB extends IRes<IContentQueryDB> {
  content: IContentQueryDB;
}
