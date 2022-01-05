import { PrismaClient } from '@prisma/client';
import { app } from 'electron';
import path from 'path';
import { dbPush } from './modules/db/db_utils';

const isProd = process.env.NODE_ENV === 'production';
const newDBPath = path.join(app.getPath('userData'), 'express_match.sqlite.db');
const newDBUrl = `file:${newDBPath}?connection_limit=1`;

if (isProd) {
  // @ts-ignore !important, change the default environment variable
  VAR_ENV.DATABASE_URL = newDBUrl;

}

console.log({ rawDBPath: process.env.DATABASE_URL, newDBPath });

export const prisma = new PrismaClient();

dbPush(prisma, 'prisma db push');
