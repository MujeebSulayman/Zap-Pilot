import { NextResponse } from 'next/server'
import { getEarnVaults } from '@/services/lifi.service'

export async function GET() {
  try {
    const data = await getEarnVaults()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Vaults fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch vaults' }, { status: 500 })
  }
}
