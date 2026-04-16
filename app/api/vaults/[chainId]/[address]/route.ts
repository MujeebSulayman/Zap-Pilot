import { NextResponse } from 'next/server'
import { getEarnVaultByAddress } from '@/services/lifi.service'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ chainId: string; address: string }> }
) {
  try {
    const { chainId, address } = await params

    const vault = await getEarnVaultByAddress(Number(chainId), address)
    
    if (!vault) {
      return NextResponse.json({ error: 'Vault not found' }, { status: 404 })
    }

    return NextResponse.json(vault)
  } catch (error: any) {
    console.error('Vault fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch vault details' }, { status: 500 })
  }
}
