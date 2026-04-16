import prisma from '@/lib/prisma'

export async function simulateGrowth(depositAmount: number, apy: number, durationMonths: number) {
  // Simple compound interest calculation: A = P(1 + r/n)^(nt)
  // Assuming APY is compounded annually for simplicity in display
  const durationYears = durationMonths / 12
  const projectedValue = depositAmount * Math.pow(1 + apy, durationYears)
  
  return {
    depositAmount,
    durationMonths,
    apy,
    projectedValue,
    projectedYield: projectedValue - depositAmount
  }
}

export async function saveSimulation(userId: string, depositAmount: number, durationMonths: number, projectedValue: number) {
  return prisma.simulationHistory.create({
    data: {
      userId,
      depositAmount,
      durationMonths,
      projectedValue
    }
  })
}
