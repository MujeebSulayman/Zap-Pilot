import prisma from '@/lib/prisma'
import crypto from 'crypto'

// In a real app we'd construct the wallet via a provider's API. 
// We are building a mock-safe integration boundary for 'Blockradar'

export async function createWalletForUser(userId: string) {
  // Check if wallet already exists
  const existing = await prisma.managedWallet.findUnique({ where: { userId } })
  if (existing) return existing

  // Simulate remote provider call
  const providerWalletId = `mw_${crypto.randomUUID().replace(/-/g, '')}`
  
  // Real EOA/Smart Account simulated format (0x...)
  const mockAddress = `0x${Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')}`

  const wallet = await prisma.managedWallet.create({
    data: {
      userId,
      address: mockAddress,
      provider: 'Blockradar',
      providerWalletId
    }
  })

  return wallet
}

export async function getWalletForUser(userId: string) {
  return prisma.managedWallet.findUnique({
    where: { userId }
  })
}
