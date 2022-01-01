import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime';

import { DbUpdateStatus, prisma } from '../../db';

import { IErpItem } from './handler/parse_success';

export async function dbCreateErp(item: IErpItem) {
  try {
    await prisma.erp.create({ data: item });
    return DbUpdateStatus.inserted;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') return DbUpdateStatus.duplicated;
    if (e instanceof PrismaClientUnknownRequestError && e.message.includes('Timed out')) return DbUpdateStatus.timeout;
    return DbUpdateStatus.unknown;
  }
}
