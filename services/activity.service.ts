import prisma from '@/lib/prisma'

export async function logActivity(userId: string, action: string, details?: string) {
  try {
    const log = await prisma.activityLog.create({
      data: {
        userId,
        action,
        details
      }
    })
    return log
  } catch (error) {
    console.error('Error logging activity:', error)
  }
}

export async function getUserActivity(userId: string) {
  return prisma.activityLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50
  })
}
