import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export enum DbUpdateStatus {
  inserted,
  duplicated,
  timeout,
  unknown,
}
