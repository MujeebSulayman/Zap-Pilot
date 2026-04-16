import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getWalletForUser } from '@/services/wallet.service'

export async function GET() {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const wallet = await getWalletForUser(user.id)
    return NextResponse.json({ wallet })
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
