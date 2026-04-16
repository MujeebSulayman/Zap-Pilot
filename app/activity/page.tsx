'use client'

import { useQuery } from '@tanstack/react-query'
import { Activity, ArrowRightLeft, DollarSign, LogIn, Plus } from 'lucide-react'

export default function ActivityPage() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['activity'],
    queryFn: () => fetch('/api/activity').then(res => res.json())
  })

  const getActionIcon = (action: string) => {
    if (action.includes('LOGIN')) return <LogIn className="w-5 h-5 text-blue-500" />
    if (action.includes('DEPOSIT')) return <DollarSign className="w-5 h-5 text-[#10B981]" />
    if (action.includes('ALLOCATE') || action.includes('WITHDRAW')) return <ArrowRightLeft className="w-5 h-5 text-purple-500" />
    return <Activity className="w-5 h-5 text-slate-500" />
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 pb-20">
      <header className="mb-10 animate-fade-up">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Activity History</h1>
        <p className="text-slate-600">A complete log of your account actions and transactions.</p>
      </header>

      <div className="glass rounded-3xl p-2 animate-fade-up shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading activity...</div>
        ) : activities?.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Activity Yet</h3>
            <p className="text-slate-500 text-sm">Your actions will appear here once you start using the app.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100/60">
            {activities?.map((item: any) => (
              <div key={item.id} className="p-6 flex items-start gap-4 hover:bg-white/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
                <div className="p-3 bg-white border border-slate-100 shadow-sm rounded-2xl shrink-0">
                  {getActionIcon(item.action)}
                </div>
                <div className="flex-1 pt-1">
                  <h4 className="font-bold text-slate-900">{item.action.replace(/_/g, ' ')}</h4>
                  <p className="text-xs text-slate-400 font-medium mb-2">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                  {item.details && (
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 break-all font-mono text-xs">
                      {item.details}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
