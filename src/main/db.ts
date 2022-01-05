import { PrismaClient } from '@prisma/client';
import { app } from 'electron';
import path from 'path';
import { dbPush, saveNewSchema } from './modules/db/db_utils';

const isProd = process.env.NODE_ENV === 'production';
const newDBPath = path.join(app.getPath('userData'), 'express_match.sqlite.db');
const newDBUrl = `file:${newDBPath}?connection_limit=1`;

let _prismaBinPath = 'prisma';
let argSchema = '';
let schemaPath;

/**
 * 经过大量测， 具体见： [xxx](/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/readme.md)
 * 这里需要用绝对路径拼接靠谱，而且还要相对位置
 */
if (isProd) {
  schemaPath = path.join(__dirname, 'schema.prisma');
  _prismaBinPath = path.join(__dirname, '../../node_modules/.bin/prisma');
  argSchema = `--schema ${schemaPath}`;
  // @ts-ignore !important, change the default environment variable
  VAR_ENV.DATABASE_URL = newDBUrl;

  saveNewSchema(schemaPath, newDBUrl);

} else {
  // 本地就不改地址了，直接存 file:dev.db 也可以；再说了，暂时我也没能力改（下面这句在prod模式下webpack编译无法通过）
  // process.env.DATABASE_URL = newDBUrl;
  schemaPath = path.join(__dirname, '../../prisma/schema.prisma');
}

export const prismaBinPath = _prismaBinPath;
const dbPushCmd = `${_prismaBinPath} db push ${argSchema}`;
console.log({ rawDBPath: process.env.DATABASE_URL, newDBPath, prismaBinPath, dbPushCmd });

export const prisma = new PrismaClient();

dbPush(prisma, dbPushCmd);

