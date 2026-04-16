import prisma from '@/lib/prisma'
import { logActivity } from './activity.service'
import crypto from 'crypto'

export async function initiateFiatDeposit(userId: string, amount: number) {
  // --------------------------------------------------------------------------
  // REAL PAYCREST API INTEGRATION (ON-RAMP)
  // Fetch real payment link or deposit parameters from Paycrest.
  // --------------------------------------------------------------------------
  const apiKey = process.env.PAYCREST_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Paycrest configuration (PAYCREST_API_KEY)");
  }

  let paymentReference: string;
  let paymentStatus: string;

  try {
    const response = await fetch(`https://api.paycrest.io/v1/on-ramp/deposits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        userId,
        amount,
        currency: 'NGN',
        callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/funding/webhook`
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Paycrest API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    paymentReference = data.reference || data.data?.reference || `fd_${crypto.randomUUID().replace(/-/g, '')}`;
    paymentStatus = data.status || data.data?.status || 'PENDING';

  } catch (error) {
    console.error("Failed to initiate Paycrest deposit:", error);
    throw new Error("Could not initiate deposit via Paycrest");
  }

  const deposit = await prisma.fiatDeposit.create({
    data: {
      userId,
      amount,
      currency: 'NGN',
      status: paymentStatus,
      reference: paymentReference
    }
  })

  // Log activity
  await logActivity(userId, 'DEPOSIT_FIAT', JSON.stringify({ amount, currency: 'NGN', reference: paymentReference }))

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
