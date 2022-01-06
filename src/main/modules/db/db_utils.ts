import { IDbResultBase } from './db_result';

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
