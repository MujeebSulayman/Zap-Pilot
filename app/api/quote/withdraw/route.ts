import { NextResponse } from 'next/server'
import { getQuoteForWithdraw } from '@/services/lifi.service'
import { getSession } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { fromChain, toChain, vaultAddress, destinationToken, fromAddress, toAddress, fromAmount } = await req.json()

    if (!vaultAddress || !fromAmount) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const quote = await getQuoteForWithdraw(
      Number(fromChain),
      Number(toChain),
      vaultAddress,
      destinationToken,
      fromAddress,
      toAddress,
      fromAmount
    )

    return NextResponse.json(quote)
  } catch (error: any) {
    console.error('Quote withdraw error:', error)
    return NextResponse.json({ error: 'Failed to fetch withdraw quote' }, { status: 500 })
  }
}
