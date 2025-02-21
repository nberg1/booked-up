// src/services/prioritizationService.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * getDefaultPriority
 *
 * This function finds the highest current priority value for the given user
 * in their TBR list and returns one more than that value. If the user has
 * no books, it returns 1.
 *
 * @param userId - The ID of the user.
 * @returns A promise that resolves to the default priority number.
 */
export async function getDefaultPriority(userId: number): Promise<number> {
  const maxRecord = await prisma.userBook.findFirst({
    where: { userId },
    orderBy: { priority: 'desc' }
  });
  return maxRecord ? maxRecord.priority + 1 : 1;
}
