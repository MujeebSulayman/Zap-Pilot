import prisma from '@/lib/prisma'

export async function createWalletForUser(userId: string) {
  // Check if wallet already exists
  const existing = await prisma.managedWallet.findUnique({ where: { userId } })
  if (existing) return existing

  let providerWalletId: string;
  let providerAddress: string;

  try {
    const masterWalletId = process.env.BLOCKRADAR_MASTER_WALLET_ID;
    const apiKey = process.env.BLOCKRADAR_API_KEY;
    const baseUrl = process.env.BLOCKRADAR_BASE_URL || 'https://api.blockradar.co/v1';

    if (!masterWalletId || !apiKey) {
      throw new Error("Blockradar configuration is incomplete. Check BLOCKRADAR_MASTER_WALLET_ID and BLOCKRADAR_API_KEY.");
    }

    // Correct Blockradar API call for creating a child address under a master wallet
    const response = await fetch(`${baseUrl}/wallets/${masterWalletId}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({ 
        label: `User_${userId}`,
        metadata: { userId, internalApp: 'ZapPilot' } 
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Blockradar API error: ${response.status} - ${errorText}`);
    }
    
    const json = await response.json();
    // Normalize data structure (Blockradar usually returns data in 'data' object)
    const data = json.data || json;
    
    providerWalletId = data.id;
    providerAddress = data.address;

    if (!providerWalletId || !providerAddress) {
       throw new Error("Invalid response structure from Blockradar API");
    }

  } catch (error) {
    console.error("Failed to provision Blockradar wallet:", error);
    throw new Error("Wallet provisioning failed. Please contact support.");
  }

  const wallet = await prisma.managedWallet.create({
    data: {
      userId,
      address: providerAddress,
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
