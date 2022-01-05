import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime';

import { prisma } from '../../db';
import {
  DB_INSERT_DUPLICATED,
  DB_INSERT_SUCCESS,
  DB_TABLE_NOT_EXISTED,
  DB_TIMEOUT,
  DB_UNKNOWN,
  DB_UPDATED,
  DbInsertStatus,
  DbUpdateStatus,
} from '../db/db_status';

import { IErpItem } from './handler/parse_success';

export async function dbCreateErp(item: IErpItem): Promise<DbInsertStatus> {
  try {
    await prisma.erp.create({ data: item });
    return DB_INSERT_SUCCESS;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') return DB_INSERT_DUPLICATED;
    if (e instanceof PrismaClientUnknownRequestError && e.message.includes('Timed out')) return DB_TIMEOUT;
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2021') return DB_TABLE_NOT_EXISTED;
    console.error(e);
    return DB_UNKNOWN;
  }
}

export async function dbUpsertErp(item: IErpItem): Promise<DbUpdateStatus> {
  try {
    await prisma.erp.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
    return DB_UPDATED;
  } catch (e) {
    if (e instanceof PrismaClientUnknownRequestError && e.message.includes('Timed out')) return DB_TIMEOUT;
    console.error(e);
    return DB_UNKNOWN;
  }
}
