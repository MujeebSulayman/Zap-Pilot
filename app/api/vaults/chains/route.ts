import { NextResponse } from 'next/server'
import { getEarnChains } from '@/services/lifi.service'

export async function GET() {
  try {
    const data = await getEarnChains()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Chains fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch supported chains' }, { status: 500 })
  }
}
