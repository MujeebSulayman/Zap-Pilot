'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Search, Filter, ShieldCheck, TrendingUp, AlertCircle } from 'lucide-react'
import { useState } from 'react'

export default function VaultsMarketplace() {
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['vaults'],
    queryFn: () => fetch('/api/vaults').then(res => {
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    })
  })

  // Safe checks for the data structure coming from LI.FI
  const vaults = data?.vaults || []
  
  const filteredVaults = vaults.filter((vault: any) => 
    vault.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    vault.protocol?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a: any, b: any) => (b.analytics?.apy?.total || 0) - (a.analytics?.apy?.total || 0))

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
      <header className="mb-10 animate-fade-up flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Yield Market</h1>
          <p className="text-slate-600 max-w-2xl">
            Explore carefully curated, auto-compounding vaults. 
            Allocate your NGN directly into these high-performing global markets with zero technical setup.
          </p>
        </div>
        
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search assets or protocols..." 
            className="w-full md:w-80 pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#10B981] outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-6 h-6" />
          Failed to load vaults from the market. Please try again later.
        </div>
      ) : isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 rounded-3xl bg-slate-100 animate-pulse border border-slate-200"></div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVaults.map((vault: any, i: number) => {
            const apy = ((vault.analytics?.apy?.total || 0) * 100).toFixed(2)
            const tvl = parseInt(vault.analytics?.tvl?.usd || 0).toLocaleString('en-US', { notation: 'compact' })
            const assetLogo = vault.underlyingTokens?.[0]?.logoURI
            const isTransactional = vault.isTransactional

            return (
              <div 
                key={`${vault.chainId}-${vault.address}`} 
                className="glass rounded-3xl p-6 hover:shadow-lg transition-all animate-fade-up group relative overflow-hidden"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {!isTransactional && (
                  <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">
                    VIEW ONLY
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center p-2 border border-slate-100 relative shadow-sm">
                      {assetLogo ? (
                        <img src={assetLogo} alt={vault.name} className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-200" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight block max-w-[150px] truncate">{vault.name}</h3>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{vault.protocol}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-500 mb-0.5">Total APY</p>
                    <div className="inline-flex items-center gap-1 font-black text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-lg">
                      <TrendingUp className="w-4 h-4" /> {apy}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-4 border-y border-slate-100/50 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Total Value Locked</p>
                    <p className="font-semibold text-slate-800">${tvl}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 mb-1">Risk Status</p>
                    <div className="flex items-center gap-1 font-semibold text-slate-700 text-sm justify-end">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> Audited
                    </div>
                  </div>
                </div>

                <Link 
                  href={`/vaults/${vault.chainId}/${vault.address}`}
                  className="w-full block text-center py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-md"
                >
                  View Details & Allocate
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
