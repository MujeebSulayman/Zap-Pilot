'use client'

import { useState } from 'react'
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
  ArrowUpRight
} from 'lucide-react'
import { useAuthStore, AuthState } from '@/store/useAuthStore'

export default function EnhancedFintechAuthPage() {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const router = useRouter()
  const setUser = useAuthStore((state: AuthState) => state.setUser)

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

  return (
    <div className="lg:h-screen flex flex-col lg:flex-row bg-white lg:overflow-hidden">
      
      {/* LEFT SIDE: Auth Form (Focused & Minimal) */}
      <div className="lg:w-[45%] flex flex-col justify-center items-center p-8 lg:p-16 border-r border-slate-100 bg-white z-10">
        <div className="w-full max-w-[400px]">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-10">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-lg">
                Z
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Zap Pilot</span>
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">
              {authMode === 'signup' ? 'Start your growth engine.' : 'Sign in to Zap Pilot'}
            </h2>
            <p className="text-slate-500 font-medium text-base">
              {authMode === 'signup' 
                ? 'The institutional bridge for the modern capital pilot.' 
                : 'Welcome back. Manage your yields and liquidity.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 mb-6 text-sm font-semibold flex items-center gap-3 animate-fade-up">
               <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
               {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors pr-4 my-2.5">
                    <User className="w-4 h-4 text-slate-400 group-focus-within:text-slate-900" />
                  </div>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Samuel Ade"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 pl-12 pr-4 py-3 rounded-xl outline-none transition-all font-semibold text-slate-900 placeholder:text-slate-300 text-sm"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Work Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors pr-4 my-2.5">
                  <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-slate-900" />
                </div>
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 pl-12 pr-4 py-3 rounded-xl outline-none transition-all font-semibold text-slate-900 placeholder:text-slate-300 text-sm"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-1.5 pb-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                {authMode === 'login' && <span className="text-[10px] font-bold text-slate-400 hover:text-slate-900 cursor-pointer">Recover Access</span>}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors pr-4 my-2.5">
                  <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-slate-900" />
                </div>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 pl-12 pr-4 py-3 rounded-xl outline-none transition-all font-semibold text-slate-900 placeholder:text-slate-300 text-sm"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base shadow-sm group active:scale-[0.99]"
            >
              {loading ? 'Securing Access...' : authMode === 'signup' ? 'Create Pilot Account' : 'Sign In Now'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col items-center gap-4">
            <button 
              onClick={() => { setAuthMode(authMode === 'signup' ? 'login' : 'signup'); setError('') }}
              className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              {authMode === 'signup' ? 'Already using Zap Pilot? Sign In' : "New to the platform? Create an account"}
            </button>
            <p className="text-slate-400 text-[10px] text-center font-medium leading-relaxed max-w-[280px]">
              Secured by bank-grade encryption and audited protocols. <span className="text-slate-900 font-bold hover:underline cursor-pointer">Security Policy</span>.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Fintech Showcase (No External Images Needed - Fully Interactive Reveal) */}
      <div className="hidden lg:flex lg:w-[55%] bg-slate-50 flex-col relative overflow-hidden">
        
        {/* Mock App UI - Built with pure CSS for absolute crispness */}
        <div className="absolute top-20 left-20 right-[-200px] bottom-[-200px] bg-white rounded-tl-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-200 p-12 animate-fade-up">
           <div className="max-w-[800px]">
              <div className="flex items-center justify-between mb-16">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 content-center flex items-center justify-center">
                       <Zap className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div className="space-y-1.5">
                       <div className="w-40 h-3.5 bg-slate-900 rounded-full" />
                       <div className="w-24 h-2 bg-slate-200 rounded-full" />
                    </div>
                 </div>
                 <div className="flex gap-3">
                   <div className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3" /> Live Protocol
                   </div>
                   <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-slate-400" />
                   </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-16">
                 <div className="p-8 rounded-[32px] border border-slate-100 bg-white shadow-xl shadow-slate-100/50">
                    <div className="flex items-center justify-between mb-4">
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Growth Forecast</p>
                       <span className="text-emerald-500 font-black text-sm">+14.2%</span>
                    </div>
                    <p className="text-5xl font-black text-slate-900 tracking-tighter mb-1">
                      ₦12.8M
                    </p>
                    <p className="text-xs text-slate-400 font-semibold italic">Net Performance • 30d</p>
                 </div>
                 <div className="p-8 rounded-[32px] border border-slate-100 bg-white shadow-xl shadow-slate-100/50">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Yield Sources</p>
                    <div className="flex items-center gap-4">
                       {[
                         { sym: 'USDC', color: 'bg-blue-500', apy: '12%' },
                         { sym: 'DAI', color: 'bg-orange-400', apy: '10%' },
                         { sym: 'USDT', color: 'bg-emerald-500', apy: '13%' }
                       ].map((token, i) => (
                         <div key={i} className="flex flex-col items-center gap-2">
                            <div className={`w-12 h-12 rounded-full ${token.color} border-4 border-white shadow-md flex items-center justify-center text-[8px] font-black text-white`}>
                              {token.sym}
                            </div>
                            <span className="text-[10px] font-black text-slate-900">{token.apy}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Protocol Transctions List */}
              <div className="space-y-5">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Real-time Settlement Hub</p>
                 {[
                   { label: 'Bank On-ramp Completed', amount: '+₦500,000', color: 'text-emerald-500' },
                   { label: 'USDC Vault Allocation', amount: '-$580.42', color: 'text-slate-900' },
                   { label: 'Yield Compounded', amount: '+$14.20', color: 'text-emerald-500' }
                 ].map((t, i) => (
                   <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/50 border border-slate-50 transition-all hover:bg-slate-50 hover:px-6 group cursor-default">
                      <div className="flex items-center gap-5">
                        <div className="w-11 h-11 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center">
                           <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                        </div>
                        <p className="font-bold text-slate-700">{t.label}</p>
                      </div>
                      <div className={`font-black text-sm tracking-tight ${t.color}`}>{t.amount}</div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Value Prop Floating Layer */}
        <div className="absolute bottom-16 left-12 right-12 z-20 pointer-events-none">
           <div className="flex gap-4">
              <div className="bg-white/95 backdrop-blur-md p-8 rounded-[40px] shadow-2xl border border-white shadow-slate-200/50 max-w-[280px] flex-1">
                 <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                 </div>
                 <h4 className="font-black text-slate-900 text-lg mb-2">Non-Custodial</h4>
                 <p className="text-xs text-slate-500 leading-relaxed font-medium">Your funds never leave the blockchain. Professional wallets with zero counterparty risk.</p>
              </div>
              <div className="bg-white/95 backdrop-blur-md p-8 rounded-[40px] shadow-2xl border border-white shadow-slate-200/50 max-w-[280px] flex-1">
                 <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                    <ArrowUpRight className="w-6 h-6 text-blue-600" />
                 </div>
                 <h4 className="font-black text-slate-900 text-lg mb-2">Automated Payouts</h4>
                 <p className="text-xs text-slate-500 leading-relaxed font-medium">Withdraw to your Nigerian bank 24/7. Instant NGN liquidation at the best market rates.</p>
              </div>
           </div>

           <div className="mt-12 flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border border-white" />)}
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trusted by 2,000+ Pilots</span>
              </div>
              <div className="flex gap-4 opacity-40">
                 <div className="px-3 py-1 bg-slate-900 text-white rounded font-black text-[8px] uppercase tracking-tighter">PCI DSS</div>
                 <div className="px-3 py-1 bg-slate-900 text-white rounded font-black text-[8px] uppercase tracking-tighter">SEC COMPLIANCE</div>
              </div>
           </div>
        </div>
      </div>

    </div>
  )
}
