import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { initiateFiatDeposit } from '@/services/funding.service'

export async function POST(req: Request) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { amount } = await req.json()
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 })
    }

    const deposit = await initiateFiatDeposit(user.id, amount)
    return NextResponse.json({ deposit })
  } catch (error: any) {
    console.error('Fiat deposit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
