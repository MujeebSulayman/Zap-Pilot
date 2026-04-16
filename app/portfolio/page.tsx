'use client'

import { useQuery } from '@tanstack/react-query'
import { Wallet, LogOut, ArrowRightCircle } from 'lucide-react'
import Link from 'next/link'

export default function PortfolioPage() {
  // First, fetch the user's wallet address
  const { data: walletData, isLoading: loadingWallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => fetch('/api/wallet').then(res => res.json())
  })
  
  const walletAddress = walletData?.wallet?.address

  // Then fetch their portfolio using the address
  const { data: portfolio, isLoading: loadingPortfolio } = useQuery({
    queryKey: ['portfolio', walletAddress],
    enabled: !!walletAddress,
    queryFn: () => fetch(`/api/portfolio/${walletAddress}`).then(res => res.json())
  })

  // Safe destructuring
  const positions = portfolio?.positions || []
  const totalValue = positions.reduce((acc: number, cur: any) => acc + (parseFloat(cur.valueUsd) || 0), 0)

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 pb-20">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-up">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Portfolio</h1>
          <p className="text-slate-600">Track your yield allocations across all markets.</p>
        </div>
        {walletAddress && (
           <div className="bg-slate-100 text-slate-500 font-mono text-xs px-3 py-2 rounded-lg flex items-center gap-2">
             <Wallet className="w-4 h-4" />
             {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
           </div>
        )}
      </header>

      <div className="grid md:grid-cols-3 gap-8 mb-10">
        <div className="md:col-span-2 bg-gradient-to-tr from-slate-900 to-[#0F172A] p-8 rounded-3xl text-white shadow-xl animate-fade-up">
           <p className="text-slate-400 font-medium mb-2">Total Yield Value</p>
           <h2 className="text-5xl font-bold mb-8">${totalValue.toFixed(2)}</h2>
           
           <div className="flex items-center gap-4">
             <Link href="/vaults" className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-3 rounded-xl font-semibold transition-all">
               Allocate More
             </Link>
           </div>
        </div>
      </div>

      <div className="glass rounded-3xl p-6 shadow-sm animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-xl font-bold text-slate-900 mb-6">Active Allocations</h3>
        
        {loadingWallet || loadingPortfolio ? (
          <div className="py-12 text-center text-slate-500">Scanning blockchain for your positions...</div>
        ) : positions.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Active Positions</h3>
            <p className="text-slate-500 mb-6 text-sm max-w-sm mx-auto">
              You haven't allocated any capital into the yield markets yet. Explore the market to start earning.
            </p>
            <Link href="/vaults" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all">
              Explore Markets <ArrowRightCircle className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {positions.map((pos: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/50 border border-slate-100 rounded-2xl hover:border-[#10B981]/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200 shrink-0">
                    <img src={pos.token?.logoURI || ''} alt="Vault" className="w-8 h-8 rounded-full" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 block max-w-[200px] truncate">{pos.vaultName || pos.token?.symbol || 'Unknown Vault'}</h4>
                    <p className="text-xs text-slate-500 font-medium">{pos.protocol} • Chain: {pos.chainId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">${parseFloat(pos.valueUsd).toFixed(2)}</p>
                  <button className="text-xs font-bold text-red-500 mt-1 hover:underline flex items-center justify-end gap-1 w-full relative group">
                    <span className="hidden group-hover:inline">Withdraw via Composer</span>
                    <LogOut className="w-3 h-3 group-hover:hidden" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
