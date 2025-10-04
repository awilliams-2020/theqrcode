/**
 * User helper functions for soft delete functionality
 */

import { prisma } from './prisma'

/**
 * Check if a user is soft-deleted
 */
export async function isUserSoftDeleted(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isDeleted: true }
  })
  
  return user?.isDeleted || false
}

/**
 * Get user with soft delete check
 * Returns null if user is soft-deleted
 */
export async function getUserIfNotDeleted(userId: string) {
  const user = await prisma.user.findUnique({
    where: { 
      id: userId,
      isDeleted: false
    }
  })
  
  return user
}

/**
 * Standard where clause for non-deleted users
 */
export const nonDeletedUserWhere = {
  isDeleted: false
}
