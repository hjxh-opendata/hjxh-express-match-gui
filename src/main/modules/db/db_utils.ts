import { PrismaClient } from '@prisma/client';
import chProcess from 'child_process';
import fs from 'fs';

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

export const dbPush = (prisma: PrismaClient, dbPushCmd) => {
  /**
   * [You must re-generate the Prisma Client each time you add or rename a data source.]
   * (https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#remarks-1)
   */
  console.log(`database-exec: ${dbPushCmd}`);
  chProcess.exec(dbPushCmd, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return;
    }

    console.error(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout}`);
    if (stdout) {
      console.log('database: try to insert one iterm into `user`');
      // eslint-disable-next-line promise/no-promise-in-callback
      prisma.user
        .create({ data: { id: new Date().getTime(), email: new Date().toString(), name: 'test' } })
        .then(console.log)
        .catch(console.error);
    }
  });
};

/**
 * for local prisma studio use
 * @param schemaPath
 * @param newDBUrl
 */
export const saveNewSchema = (schemaPath, newDBUrl: string) =>
  fs.readFile(schemaPath, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      console.error(err);
      throw new Error(`read schema error`);
    } else {
      const newData = data.replace(/env\("DATABASE_URL"\)/, `"${newDBUrl}"`);
      const newSchemaPath = schemaPath.replace('schema', 'new.schema');
      fs.writeFile(newSchemaPath, newData, { encoding: 'utf-8' }, (err1) => {
        if (err1) {
          console.error(err1);
          console.log('save new schema file failed');
        } else {
          console.log('saved new schema file successfully');
          console.log(`new path: ${newSchemaPath}`);
        }
      });
    }
  });
