import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createErp(item) {
  const createResult = await prisma.erp.create(item);
  console.log(createResult);
}
