import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime';

import { DbInsertStatus, DbUpsertStatus, prisma } from '../../db';

import { IErpItem } from './handler/parse_success';

export async function dbCreateErp(item: IErpItem): Promise<DbInsertStatus> {
  try {
    await prisma.erp.create({ data: item });
    return DbInsertStatus.inserted;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') return DbInsertStatus.duplicated;
    if (e instanceof PrismaClientUnknownRequestError && e.message.includes('Timed out')) return DbInsertStatus.timeout;
    return DbInsertStatus.unknown;
  }
}

export async function dbUpsertErp(item: IErpItem): Promise<DbUpsertStatus> {
  try {
    await prisma.erp.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
    return DbUpsertStatus.updated;
  } catch (e) {
    return e instanceof PrismaClientUnknownRequestError && e.message.includes('Timed out')
      ? DbUpsertStatus.timeout
      : DbUpsertStatus.unknown;
  }
}
