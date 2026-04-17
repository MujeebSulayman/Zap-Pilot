'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, TrendingUp, ShieldCheck, Zap, Layers, RefreshCw, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function VaultDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [depositAmount, setDepositAmount] = useState('')
  const [allocating, setAllocating] = useState(false)
  const [simDuration, setSimDuration] = useState(12)
  const [simulatedValue, setSimulatedValue] = useState<number | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)

  const { data: vault, isLoading, error } = useQuery({
    queryKey: ['vault', params.chainId, params.address],
    queryFn: () => fetch(`/api/vaults/${params.chainId}/${params.address}`).then(res => {
      if (!res.ok) throw new Error('Vault not found')
      return res.json()
    })
  })

  const vaultData = vault?.data || vault
  const apy = vaultData?.analytics?.apy?.total || 0
  const tvlRaw = vaultData?.analytics?.tvl?.usd || 0
  const tvl = parseInt(tvlRaw).toLocaleString('en-US', { notation: 'compact' })
  const protocolName = typeof vaultData?.protocol === 'string' ? vaultData.protocol : vaultData?.protocol?.name || 'DeFi'

  const handleSimulate = async () => {
    if (!depositAmount) return
    setIsSimulating(true)
    try {
      const res = await fetch('/api/simulate-growth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          depositAmount: Number(depositAmount),
          apy,
          durationMonths: simDuration
        })
      })
      const data = await res.json()
      setSimulatedValue(data.projectedValue)
    } finally {
      setIsSimulating(false)
    }
  }

  const handleDeposit = async () => {
    setAllocating(true)
    try {
      // Fetching a real quote to validate the setup
      const quoteRes = await fetch('/api/quote/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromChain: 8453, // Base
          toChain: params.chainId,
          fromToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
          vaultAddress: params.address,
          fromAddress: '0x0000000000000000000000000000000000000000', // Placeholder
          toAddress: '0x0000000000000000000000000000000000000000', // Placeholder
          fromAmount: (Number(depositAmount) * 10**6).toString(), 
        })
      })
      
      if (!quoteRes.ok) throw new Error('Failed to fetch executable quote')
      
      // In a production app, we would now pass this quote to the Blockradar managed wallet 
      // service to sign and broadcast the transaction.
      alert('Allocation quote retrieved. In a production environment with a funded wallet, this would now execute gaslessly.')
      router.push('/portfolio')
    } catch (err) {
      alert('Allocation preview failed: ' + (err as Error).message)
    } finally {
      setAllocating(false)
    }
  }


  if (isLoading) return <div className="p-12 text-center text-slate-500">Loading vault...</div>
  if (error || !vault) return <div className="p-12 text-center text-red-500">Vault not found or error loading</div>

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 pb-32">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Market
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Vault Info */}
        <div className="flex-1 space-y-6">
          <div className="glass p-8 rounded-3xl animate-fade-up">
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-white p-3 shadow-md border border-slate-100 flex items-center justify-center">
                {vaultData?.underlyingTokens?.[0]?.logoURI ? (
                  <img src={vaultData.underlyingTokens[0].logoURI} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <Layers className="w-10 h-10 text-slate-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 text-xs font-bold uppercase rounded-md tracking-wider">
                    {protocolName}
                  </span>
                  {!vaultData?.isTransactional && (
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 text-xs font-bold uppercase rounded-md flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> External Only
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-1">{vaultData?.name}</h1>
                <p className="text-slate-500">Chain ID: {vaultData?.chainId}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 border-b border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total APY</p>
                <p className="text-2xl font-black text-[#10B981]">{(apy * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">TVL</p>
                <p className="text-2xl font-black text-slate-900">${tvl}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Asset</p>
                <p className="text-xl font-bold text-slate-900">{vaultData?.underlyingTokens?.[0]?.symbol || 'MIX'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Redeemable</p>
                <p className={`text-xl font-bold ${vaultData?.isRedeemable ? 'text-blue-600' : 'text-slate-500'}`}>
                  {vaultData?.isRedeemable ? 'Yes' : 'No'}
                </p>
              </div>
            </div>

            <div className="pt-8">
              <h3 className="font-bold text-lg text-slate-900 mb-4">About the specific strategy</h3>
              <p className="text-slate-600 leading-relaxed max-w-3xl">
                This vault aggregates yield by automatically moving {vaultData?.underlyingTokens?.[0]?.symbol} across top decentralized protocols on the specified network. APY is historical and compounded via {protocolName}. By depositing, you receive a receipt token that appreciates against the underlying asset.
              </p>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 shadow-sm animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-bold text-xl mb-6">Allocate Capital</h3>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm text-slate-500 mb-2 font-medium">Amount (NGN)</label>
                <input 
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-400"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>

              
              {!vaultData?.isTransactional ? (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl text-sm leading-relaxed">
                  Direct allocation is currently disabled for this vault via Zap Pilot.
                </div>
              ) : (
                <button 
                  onClick={handleDeposit}
                  disabled={allocating || !depositAmount}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {allocating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                  {allocating ? 'Executing gasless...' : 'Allocate Now'}
                </button>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 font-medium text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> Growth Simulator
                </span>
                <select 
                  className="bg-slate-50 border border-slate-200 text-xs rounded px-2 py-1 outline-none text-slate-900 cursor-pointer"
                  value={simDuration}
                  onChange={(e) => setSimDuration(Number(e.target.value))}
                >
                  <option value={1}>1 Month</option>
                  <option value={6}>6 Months</option>
                  <option value={12}>1 Year</option>
                </select>
              </div>

              <button 
                onClick={handleSimulate}
                disabled={!depositAmount || isSimulating}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors"
              >
                Project Return
              </button>

              {simulatedValue !== null && (
                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                  <p className="text-xs text-emerald-600 font-medium mb-1">Estimated Value</p>
                  <p className="text-xl font-bold text-slate-900">
                    ₦{Math.floor(simulatedValue).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>


          <div className="glass p-5 rounded-2xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
             <p className="text-xs text-slate-500 leading-relaxed flex items-start gap-2">
               <ShieldCheck className="w-8 h-8 text-[#10B981] shrink-0" />
               Your allocation is executed seamlessly using LI.FI Composer directly to the vault contract. No knowledge of gas fees or bridging is required.
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}
