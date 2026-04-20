'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Search, Filter, ShieldCheck, TrendingUp, AlertCircle } from 'lucide-react'
import { useState } from 'react'

export default function VaultsMarketplace() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedChain, setSelectedChain] = useState<string>('')
  const [selectedProtocol, setSelectedProtocol] = useState<string>('')
  const [sortBy, setSortBy] = useState<'apy' | 'tvl'>('apy')

  const { data, isLoading, error } = useQuery({
    queryKey: ['vaults', selectedChain, selectedProtocol, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (selectedChain) params.append('chainId', selectedChain)
      if (selectedProtocol) params.append('protocol', selectedProtocol)
      if (sortBy) params.append('sortBy', sortBy)
      
      const res = await fetch(`/api/vaults?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    }
  })

  const { data: chainsData } = useQuery({ queryKey: ['chains'], queryFn: () => fetch('/api/vaults/chains').then(res => res.json()) })
  const { data: protocolsData } = useQuery({ queryKey: ['protocols'], queryFn: () => fetch('/api/vaults/protocols').then(res => res.json()) })

  const chains = Array.isArray(chainsData) ? chainsData : (chainsData?.chains || [])
  const protocols = Array.isArray(protocolsData) ? protocolsData : (protocolsData?.protocols || [])

  const vaults = data?.data || (Array.isArray(data) ? data : [])
  
  const filteredVaults = vaults.filter((vault: any) => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    
    const protocolName = typeof vault.protocol === 'string' 
      ? vault.protocol 
      : vault.protocol?.name || ''

    return (
      vault.name?.toLowerCase().includes(search) || 
      protocolName.toLowerCase().includes(search) ||
      vault.underlyingTokens?.[0]?.symbol?.toLowerCase().includes(search)
    )
  })

  if (data) console.log('Current Vaults Data:', data)

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
      <header className="mb-10 animate-fade-up">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Yield Market</h1>
            <p className="text-slate-600 max-w-2xl">
              Explore curated, auto-compounding vaults. 
              Allocate your funds into global markets with zero technical setup.
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
        </div>

        <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Filters:</span>
          </div>
          
          <select 
            value={selectedChain} 
            onChange={(e) => setSelectedChain(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#10B981]"
          >
            <option value="">All Chains</option>
            {chains?.map((c: any) => (
              <option key={c.chainId} value={c.chainId}>{c.name}</option>
            ))}
          </select>

          <select 
            value={selectedProtocol} 
            onChange={(e) => setSelectedProtocol(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#10B981]"
          >
            <option value="">All Protocols</option>
            {protocols?.map((p: any) => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Sort:</span>
            <button 
              onClick={() => setSortBy('apy')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === 'apy' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
              Highest APY
            </button>
            <button 
              onClick={() => setSortBy('tvl')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === 'tvl' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
              Most TVL
            </button>
          </div>
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
            <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse border border-slate-200"></div>
          ))}
        </div>
      ) : filteredVaults.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Vaults Found</h3>
          <p className="text-slate-500">Try adjusting your filters or search term to find more opportunities.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVaults.map((vault: any, i: number) => {
            const apyValue = vault.analytics?.apy?.total || 0
            const apy = apyValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            const tvlb = vault.analytics?.tvl?.usd || 0
            const tvl = parseInt(tvlb).toLocaleString('en-US', { notation: 'compact' })
            const assetLogo = vault.underlyingTokens?.[0]?.logoURI || 
                              `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/${vault.underlyingTokens?.[0]?.address}/logo.png`
            const symbol = vault.underlyingTokens?.[0]?.symbol || '?'
            const isTransactional = vault.isTransactional

            return (
              <div 
                key={`${vault.chainId}-${vault.address}`} 
                className="glass rounded-3xl p-6 hover:shadow-xl transition-all animate-fade-up group relative overflow-hidden flex flex-col border border-slate-200/50 hover:border-[#10B981]/30 hover:translate-y-[-4px]"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {!isTransactional && (
                  <div className="absolute top-0 right-0 bg-slate-100 text-slate-500 text-[9px] font-black px-3 py-1.5 rounded-bl-xl z-20 tracking-tighter border-l border-b border-slate-200 uppercase">
                    Read-Only
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center p-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                        <img 
                          src={assetLogo} 
                          alt={vault.name} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${symbol}&background=f1f5f9&color=64748b&bold=true`
                          }}
                        />
                    </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight block max-w-[150px] truncate">{vault.name}</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{vault.protocol?.name}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex justify-end gap-1 mb-2">
                       <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-tight border border-slate-200">
                        {vault.network || 'EVM'}
                      </span>
                    </div>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">APY</p>
                    <div className="inline-flex items-center gap-1 font-black text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100 shadow-sm transition-transform group-hover:scale-105">
                      <TrendingUp className="w-4 h-4" /> {apy}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 mb-6 bg-slate-50/50 -mx-6 px-6">
                  <div>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">TVL</p>
                    <p className="font-bold text-slate-700">${tvl}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Status</p>
                    <div className="flex items-center gap-1 font-bold text-slate-600 text-[13px] justify-end">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Active
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <Link 
                    href={`/vaults/${vault.chainId}/${vault.address}`}
                    className="w-full block text-center py-3.5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all hover:translate-y-[-2px] shadow-lg shadow-slate-200 active:scale-[0.98]"
                  >
                    Manage Funds
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
