'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/useAuthStore'
import Link from 'next/link'
import { Wallet, ArrowRight, ArrowDownToLine, TrendingUp, Activity } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuthStore()

  const { data: funding, isLoading: loadingFunding } = useQuery({
    queryKey: ['fundingHistory'],
    queryFn: () => fetch('/api/funding/history').then(res => res.json())
  })
  
  const { data: vaults, isLoading: loadingVaults } = useQuery({
    queryKey: ['vaults', 'top'],
    queryFn: () => fetch('/api/vaults').then(res => res.json())
  })

  // Calculate simulated fiat balance (sum of completed deposits for MVP)
  const fiatBalance = funding?.fiat?.reduce((acc: number, cur: any) => acc + cur.amount, 0) || 0
  const hasBalance = fiatBalance > 0

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
      <header className="mb-10 animate-fade-up">
        <h1 className="text-3xl font-bold text-slate-900">Welcome, {user?.name || user?.email.split('@')[0]}</h1>
        <p className="text-slate-600">Your automated yield dashboard</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        
        {/* Core Balance Card */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 text-slate-900 shadow-sm relative overflow-hidden animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <p className="text-slate-500 font-medium mb-1">Available NGN Balance</p>
              <h2 className="text-5xl font-black tracking-tight text-slate-900">
                ₦{fiatBalance.toLocaleString()}
              </h2>
            </div>

            <div className="flex items-center gap-4 mt-8">
              <Link href="/funding" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-sm">
                <ArrowDownToLine className="w-4 h-4" /> Deposit NGN
              </Link>
              {hasBalance && (
                <Link href="/vaults" className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-6 py-3 rounded-xl font-semibold transition-all">
                  Allocate to Yield
                </Link>
              )}
            </div>
          </div>
        </div>


        {/* Portfolio Stats Card */}
        <div className="glass rounded-3xl p-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-slate-500 font-medium mb-1">Total Yield Strategy</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">$0.00</h2>
          <Link href="/portfolio" className="text-[#10B981] font-semibold flex items-center gap-1 hover:gap-2 transition-all text-sm">
            View Live Positions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Recommended Vaults */}
        <div className="glass rounded-3xl p-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#10B981]" /> Top Yield Markets
            </h3>
            <Link href="/vaults" className="text-sm font-semibold text-slate-500 hover:text-slate-900">See all</Link>
          </div>
          
          {loadingVaults ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
                  <div className="h-6 w-16 bg-slate-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {vaults?.vaults?.slice(0, 4).map((vault: any) => (
                <div key={vault.address} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <img src={vault.underlyingTokens[0]?.logoURI || 'https://via.placeholder.com/24'} alt="Token" className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="font-semibold text-slate-900">{vault.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{vault.protocol} • {vault.slug?.split('-')[1]}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex px-2 py-1 rounded bg-[#10B981]/10 text-[#059669] font-bold text-sm">
                      {(vault.analytics?.apy?.total * 100).toFixed(2)}% APY
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Snippet */}
        <div className="glass rounded-3xl p-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> Recent Activity
            </h3>
            <Link href="/activity" className="text-sm font-semibold text-slate-500 hover:text-slate-900">History</Link>
          </div>

          {!loadingFunding && funding?.fiat?.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No recent activity found.
              <br />
              Make your first deposit to get started!
            </div>
          ) : (
            <div className="space-y-4">
              {funding?.fiat?.slice(0, 4).map((f: any) => (
                <div key={f.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="font-medium text-slate-900">Deposited NGN</p>
                    <p className="text-xs text-slate-500">{new Date(f.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="font-semibold text-[#10B981]">+₦{f.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
