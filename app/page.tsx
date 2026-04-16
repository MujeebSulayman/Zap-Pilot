'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowRight, 
  ShieldCheck, 
  Unlock,
  UserPlus,
  User,
  Mail,
  Lock,
  TrendingUp,
  Zap,
  CheckCircle2,
  ExternalLink,
  ArrowUpRight,
  Globe,
  LockIcon
} from 'lucide-react'
import { useAuthStore, AuthState } from '@/store/useAuthStore'

export default function FinalizedAuthPage() {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const setUser = useAuthStore((state: AuthState) => state.setUser)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auth Form States
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const endpoint = authMode === 'signup' ? '/api/auth/signup' : '/api/auth/login'
    const body = authMode === 'signup' ? { name, email, password } : { email, password }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Authentication failed')
      
      setUser(data.user)
      router.push('/dashboard?onboarded=true')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="lg:h-screen flex flex-col lg:flex-row bg-white lg:overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* LEFT SIDE: Auth Form (Focused & Responsive) */}
      <div className="lg:w-[42%] xl:w-[40%] flex flex-col justify-center items-center p-8 lg:p-12 xl:p-20 border-r border-slate-100 bg-white z-20">
        <div className="w-full max-w-[400px]">
          <div className="mb-10">
            <div className="flex items-center gap-2.5 mb-12">
              <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-slate-200">
                Z
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Zap Pilot</span>
            </div>
            
            <h2 className="text-4xl font-black text-slate-900 mb-2.5 tracking-tighter leading-tight">
              {authMode === 'signup' ? 'Ready for deployment.' : 'Welcome back, Pilot.'}
            </h2>
            <p className="text-slate-500 font-medium text-base leading-relaxed">
              {authMode === 'signup' 
                ? 'Join thousands of institutional-grade liquid capital pilots.' 
                : 'Manage your portfolio and liquidity with precision.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 mb-8 text-sm font-semibold flex items-center gap-3 animate-fade-up">
               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
               {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            {authMode === 'signup' && (
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 opacity-60 uppercase tracking-[0.15em] ml-1">Account Holder</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors pr-4 my-2.5">
                    <User className="w-4 h-4 text-slate-300 group-focus-within:text-slate-900" />
                  </div>
                  <input 
                    type="text" 
                    required
                    placeholder="Full Legal Name"
                    className="w-full bg-slate-50 border border-slate-100 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 pl-12 pr-4 py-3.5 rounded-2xl outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 text-sm"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 opacity-60 uppercase tracking-[0.15em] ml-1">Access Protocol</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors pr-4 my-2.5">
                  <Mail className="w-4 h-4 text-slate-300 group-focus-within:text-slate-900" />
                </div>
                <input 
                  type="email" 
                  required
                  placeholder="pilot@company.io"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 pl-12 pr-4 py-3.5 rounded-2xl outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 text-sm"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2 pb-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-black text-slate-400 opacity-60 uppercase tracking-[0.15em]">Security Key</label>
                {authMode === 'login' && <span className="text-[10px] font-black text-slate-400 hover:text-slate-900 cursor-pointer uppercase tracking-tighter">Reset Protocol</span>}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors pr-4 my-2.5">
                  <Lock className="w-4 h-4 text-slate-300 group-focus-within:text-slate-900" />
                </div>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 pl-12 pr-4 py-3.5 rounded-2xl outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 text-sm"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base shadow-xl shadow-slate-200 group active:scale-[0.98] mt-4"
            >
              {loading ? 'Initializing...' : authMode === 'signup' ? 'Authorize Deployment' : 'Sign In Now'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-50 flex flex-col items-center gap-5">
            <button 
              onClick={() => { setAuthMode(authMode === 'signup' ? 'login' : 'signup'); setError('') }}
              className="text-sm font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-tight"
            >
              {authMode === 'signup' ? 'Existing Pilot? Sign In' : "New to the fleet? Register Now"}
            </button>
            <div className="flex items-center gap-4 opacity-30 grayscale pointer-events-none">
              <div className="w-12 h-4 bg-slate-400 rounded-sm" />
              <div className="w-20 h-4 bg-slate-400 rounded-sm" />
              <div className="w-14 h-4 bg-slate-400 rounded-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Perfected Desktop Showcase */}
      <div className="hidden lg:flex lg:w-[58%] xl:w-[60%] bg-slate-50 flex-col relative overflow-hidden">
        
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-40" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #E2E8F0 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        {/* The Mock Application UI */}
        <div className="absolute top-[12%] left-[10%] right-[-200px] bottom-[-200px] bg-white rounded-tl-[64px] shadow-[0_50px_120px_-20px_rgba(0,0,0,0.12)] border border-slate-100 p-16 animate-fade-up">
           <div className="max-w-[900px]">
              
              {/* Mock Header */}
              <div className="flex items-center justify-between mb-20">
                 <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[22px] bg-emerald-600 shadow-2xl shadow-emerald-600/30 flex items-center justify-center">
                       <Zap className="w-9 h-9 text-white" />
                    </div>
                    <div className="space-y-1.5">
                       <div className="w-56 h-4 bg-slate-900 rounded-full" />
                       <div className="w-32 h-2.5 bg-slate-200 rounded-full" />
                    </div>
                 </div>
                 <div className="flex gap-4">
                   <div className="px-6 py-3 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 flex items-center gap-3">
                      <Globe className="w-4 h-4 text-emerald-400" /> Operational
                   </div>
                 </div>
              </div>

              {/* Data Layer */}
              <div className="grid grid-cols-2 gap-10 mb-20 pr-32">
                 <div className="p-10 rounded-[48px] border border-slate-50 bg-white shadow-2xl shadow-slate-200/40 relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                         <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Net Growth</p>
                         <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-black">+14.2%</span>
                      </div>
                      <p className="text-6xl font-black text-slate-900 tracking-tighter mb-4">
                        ₦24.8M
                      </p>
                      {/* Integrated Yield Curve SVG */}
                      <svg className="w-full h-16 mt-4 opacity-50 stroke-emerald-500 stroke-[3] fill-none" viewBox="0 0 100 20">
                         <path d="M0,20 Q10,18 20,12 T40,10 T60,5 T80,8 T100,0" />
                      </svg>
                    </div>
                 </div>
                 <div className="p-10 rounded-[48px] border border-slate-50 bg-white shadow-2xl shadow-slate-200/40">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Liquidity Nodes</p>
                    <div className="grid grid-cols-3 gap-6">
                       {[
                         { sym: 'USDC', apy: '12.4%', color: 'border-blue-500' },
                         { sym: 'DAI', apy: '11.8%', color: 'border-orange-400' },
                         { sym: 'USDT', apy: '13.1%', color: 'border-emerald-500' }
                       ].map((node, i) => (
                         <div key={i} className="flex flex-col items-center gap-3">
                            <div className={`w-16 h-16 rounded-full border-[3px] ${node.color} bg-white flex items-center justify-center text-[10px] font-black text-slate-900 shadow-md`}>
                              {node.sym}
                            </div>
                            <span className="text-[11px] font-black text-slate-900 tracking-tight">{node.apy}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Transaction Stream */}
              <div className="space-y-6 pr-40">
                 <div className="flex items-center justify-between mb-4">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Settlement Stream</p>
                    <span className="text-[10px] font-bold text-slate-300">Updated 1s ago</span>
                 </div>
                 {[
                   { label: 'Bank Settlement Confirmed', val: '+₦1.2M', time: 'Instant' },
                   { label: 'Aave Protocol Allocation', val: '-$1,240', time: 'Success' },
                   { label: 'Auto-Compounding Event', val: '+$42.50', time: 'Dynamic' }
                 ].map((t, i) => (
                   <div key={i} className="flex items-center justify-between p-6 rounded-[24px] bg-slate-50/40 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:px-8 transition-all duration-300 cursor-default group">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                           <ExternalLink className="w-5 h-5 text-slate-200 group-hover:text-slate-900" />
                        </div>
                        <div className="space-y-0.5">
                           <p className="font-bold text-slate-900">{t.label}</p>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className={`text-lg font-black tracking-tighter ${t.val.includes('+') ? 'text-emerald-600' : 'text-slate-900'}`}>{t.val}</div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Floating Value Badges - Final Polish */}
        <div className="absolute bottom-[8%] left-[8%] right-[8%] z-30 pointer-events-none flex gap-8">
           <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[48px] shadow-2xl border border-white max-w-[320px] flex-1 translate-y-[-20%]">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center mb-8 shadow-lg shadow-slate-900/20">
                 <LockIcon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-black text-slate-900 text-xl mb-3 tracking-tight">Vault-Grade Security</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Dedicated smart-contract-based wallets with institutional-grade multisig capabilities.</p>
           </div>
           
           <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[48px] shadow-2xl border border-white max-w-[320px] flex-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center mb-8 shadow-lg shadow-emerald-600/20">
                 <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-black text-slate-900 text-xl mb-3 tracking-tight">Automated Rebalancing</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Capture the highest available yields across chains with zero manual overhead or gas management.</p>
           </div>

           <div className="flex-1 self-end pb-8">
              <div className="flex items-center gap-4 mb-2">
                 <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                 <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Audited Protocol Fleet</span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 max-w-[200px] leading-relaxed">
                Trusted by 2,000+ Pilots globally. Licensed and monitored by financial regulators.
              </p>
           </div>
        </div>
      </div>

    </div>
  )
}
