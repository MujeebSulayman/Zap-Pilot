import prisma from '@/lib/prisma'
import { logActivity } from './activity.service'
import crypto from 'crypto'

export async function initiateFiatDeposit(userId: string, amount: number) {
  const reference = `fd_${crypto.randomUUID().replace(/-/g, '')}`
  
  const deposit = await prisma.fiatDeposit.create({
    data: {
      userId,
      amount,
      currency: 'NGN',
      status: 'COMPLETED', // Auto-completing for smooth UX flow
      reference
    }
  })

  // Log activity
  await logActivity(userId, 'DEPOSIT_FIAT', JSON.stringify({ amount, currency: 'NGN', reference }))

  // Update Profile Balance (In a real app, fiat balance might live in a ledger or wallet provider API)
  // For the MVP we will just keep track of historical deposits/purchases. We can simulate user balance via summing completed deposits.

  return deposit
}

export async function depositStablecoin(userId: string, token: string, amount: number, chain: string, txHash: string) {
  const deposit = await prisma.stablecoinDeposit.create({
    data: {
      userId,
      token,
      amount,
      chain,
      status: 'COMPLETED',
      txHash
    }
  })

  await logActivity(userId, 'DEPOSIT_STABLECOIN', JSON.stringify({ token, amount, chain, txHash }))

  return deposit
}

export async function getUserFundingSummary(userId: string) {
  const fiat = await prisma.fiatDeposit.findMany({
    where: { userId, status: 'COMPLETED' }
  })
  const stable = await prisma.stablecoinDeposit.findMany({
    where: { userId, status: 'COMPLETED' }
  })

  return { fiat, stable }
}
