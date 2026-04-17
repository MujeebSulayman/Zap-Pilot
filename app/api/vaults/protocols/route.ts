import { NextResponse } from 'next/server'
import { getEarnProtocols } from '@/services/lifi.service'

export async function GET() {
  try {
    const data = await getEarnProtocols()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Protocols fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch supported protocols' }, { status: 500 })
  }
}
