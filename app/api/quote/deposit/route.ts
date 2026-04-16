import { NextResponse } from 'next/server'
import { getQuoteForDeposit } from '@/services/lifi.service'
import { getSession } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { fromChain, toChain, fromToken, vaultAddress, fromAddress, toAddress, fromAmount } = await req.json()

    if (!vaultAddress || !fromAmount) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const quote = await getQuoteForDeposit(
      Number(fromChain),
      Number(toChain),
      fromToken,
      vaultAddress,
      fromAddress,
      toAddress,
      fromAmount
    )

    return NextResponse.json(quote)
  } catch (error: any) {
    console.error('Quote deposit error:', error)
    return NextResponse.json({ error: 'Failed to fetch deposit quote' }, { status: 500 })
  }
}
