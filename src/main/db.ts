import { PrismaClient } from '@prisma/client';
import { node } from 'webpack';

export const prisma = new PrismaClient();

export enum DbInsertStatus {
  inserted,
  duplicated,
  timeout,
  unknown,
}

export enum DbUpsertStatus {
  updated,
  timeout,
  unknown,
}

export interface IDbResultBase {
  nTotal: number;
  nTimeout: number;
  nUnknown: number;
}

export interface IDbInsertResult extends IDbResultBase {
  nInserted: number;
  nDuplicated: number;
}

export interface IDbUpdateResult extends IDbResultBase {
  nUpdated: number;
  nDropped: number;
}

export const isDbFinished = (result: IDbResultBase): boolean => {
  let sum = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(result)) {
    if (key !== 'nTotal') {
      sum += result[key];
    }
  }
  return sum === result.nTotal;
};
