import { NextResponse } from 'next/server'
import { getUserFundingSummary } from '@/services/funding.service'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const summary = await getUserFundingSummary(user.id)
    return NextResponse.json(summary)
  } catch (error: any) {
    console.error('Funding history fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch funding history' }, { status: 500 })
  }
}
