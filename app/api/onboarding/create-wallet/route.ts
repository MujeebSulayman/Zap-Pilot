import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createWalletForUser } from '@/services/wallet.service'

export async function POST(req: Request) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const wallet = await createWalletForUser(user.id)
    return NextResponse.json({ wallet })
  } catch (error: any) {
    console.error('Wallet creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
