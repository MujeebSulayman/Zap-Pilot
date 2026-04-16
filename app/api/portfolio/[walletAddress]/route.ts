import { NextResponse } from 'next/server'
import { getEarnPortfolio } from '@/services/lifi.service'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ walletAddress: string }> }
) {
  try {
    const { walletAddress } = await params
    const data = await getEarnPortfolio(walletAddress)

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Portfolio fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
  }
}
