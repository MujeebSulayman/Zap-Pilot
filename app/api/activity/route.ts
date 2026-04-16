import { NextResponse } from 'next/server'
import { getUserActivity } from '@/services/activity.service'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const activity = await getUserActivity(user.id)
    return NextResponse.json(activity)
  } catch (error: any) {
    console.error('Activity fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 })
  }
}
