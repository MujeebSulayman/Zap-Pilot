import { NextResponse } from 'next/server'
import { simulateGrowth, saveSimulation } from '@/services/simulation.service'
import { getSession } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const user = await getSession()
    
    const { depositAmount, apy, durationMonths } = await req.json()

    if (!depositAmount || !apy || !durationMonths) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const simulation = await simulateGrowth(Number(depositAmount), Number(apy), Number(durationMonths))

    if (user) {
      await saveSimulation(
        user.id,
        Number(depositAmount),
        Number(durationMonths),
        simulation.projectedValue
      )
    }

    return NextResponse.json(simulation)
  } catch (error: any) {
    console.error('Simulate growth error:', error)
    return NextResponse.json({ error: 'Failed to simulate growth' }, { status: 500 })
  }
}
