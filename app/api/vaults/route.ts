import { NextResponse } from 'next/server'
import { getEarnVaults } from '@/services/lifi.service'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const chainId = searchParams.get('chainId') ? Number(searchParams.get('chainId')) : undefined
    const asset = searchParams.get('asset') || undefined
    const protocol = searchParams.get('protocol') || undefined
    const minTvlUsd = searchParams.get('minTvlUsd') ? Number(searchParams.get('minTvlUsd')) : undefined
    const sortBy = (searchParams.get('sortBy') as 'apy' | 'tvl') || undefined
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined
    const cursor = searchParams.get('cursor') || undefined

    const data = await getEarnVaults({
      chainId,
      asset,
      protocol,
      minTvlUsd,
      sortBy,
      limit,
      cursor
    })
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Vaults fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch vaults' }, { status: 500 })
  }
}
