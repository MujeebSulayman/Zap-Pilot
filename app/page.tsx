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
  CreditCard,
  Zap,
  CheckCircle2
} from 'lucide-react'
import { useAuthStore, AuthState } from '@/store/useAuthStore'

export default function ProfessionalAuthPage() {
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('login')
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
              {authMode === 'signup' ? 'Institutional access to DeFi.' : 'Sign in to your account'}
            </h2>
            <p className="text-slate-500 font-medium text-base">
              {authMode === 'signup' 
                ? 'Join thousands of capital pilots maximizing their yield.' 
                : 'Welcome back. Manage your liquidity and growth.'}
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
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 pl-12 pr-4 py-3 rounded-xl outline-none transition-all font-semibold text-slate-900 placeholder:text-slate-300 text-sm"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
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
                {authMode === 'login' && <span className="text-[10px] font-bold text-slate-400 hover:text-slate-900 cursor-pointer">Forgot?</span>}
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
              {loading ? 'Processing...' : authMode === 'signup' ? 'Create Pilot Account' : 'Sign In'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col items-center gap-4">
            <button 
              onClick={() => { setAuthMode(authMode === 'signup' ? 'login' : 'signup'); setError('') }}
              className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              {authMode === 'signup' ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
            <p className="text-slate-400 text-[10px] text-center font-medium leading-relaxed max-w-[280px]">
              By continuing you agree to Zap Pilot's <span className="text-slate-900 font-bold hover:underline cursor-pointer">Terms</span> and <span className="text-slate-900 font-bold hover:underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Fintech Showcase (Ghost UI / Value Deck) */}
      <div className="hidden lg:flex lg:w-[55%] bg-slate-50 flex-col relative overflow-hidden">
        
        {/* Ghost UI Mockup */}
        <div className="absolute top-20 left-20 right-[-100px] bottom-[-100px] bg-white rounded-tl-[40px] shadow-2xl border border-slate-200 p-12 animate-fade-up">
           <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-12">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200" />
                    <div className="space-y-2">
                       <div className="w-32 h-3 bg-slate-100 rounded-full" />
                       <div className="w-20 h-2 bg-slate-50 rounded-full" />
                    </div>
                 </div>
                 <div className="flex gap-2">
                   <div className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">Verified</div>
                   <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-12">
                 <div className="p-6 rounded-3xl border border-slate-100 bg-white">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Total Net Growth</p>
                    <p className="text-4xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
                      ₦4.2M <span className="text-xs font-bold text-emerald-500">+12.4%</span>
                    </p>
                 </div>
                 <div className="p-6 rounded-3xl border border-slate-100 bg-white">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Active Protocols</p>
                    <div className="flex -space-x-2">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                           {i}
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Ghost List */}
              <div className="space-y-4 pr-24">
                 {[1,2,3].map(i => (
                   <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 opacity-60">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50" />
                        <div className="w-48 h-2 bg-slate-100 rounded-full" />
                      </div>
                      <div className="w-20 h-2 bg-emerald-100 rounded-full" />
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Floating Value Badges */}
        <div className="absolute bottom-20 left-12 right-12 z-20 pointer-events-none">
           <div className="flex gap-4">
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white shadow-slate-200/50 max-w-[240px] flex-1">
                 <ShieldCheck className="w-6 h-6 text-emerald-600 mb-3" />
                 <h4 className="font-bold text-slate-900 mb-1">Bank-Grade Security</h4>
                 <p className="text-xs text-slate-500 leading-relaxed">Dedicated managed wallets powered by the world's most secure infra.</p>
              </div>
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white shadow-slate-200/50 max-w-[240px] flex-1">
                 <Zap className="w-6 h-6 text-emerald-600 mb-3" />
                 <h4 className="font-bold text-slate-900 mb-1">Instant Settlement</h4>
                 <p className="text-xs text-slate-500 leading-relaxed">Deposit NGN and see your funds auto-converted and allocated in seconds.</p>
              </div>
           </div>

           <div className="mt-8 flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audited by Top Security Firms</span>
              </div>
              <div className="flex gap-6 opacity-30">
                 <div className="w-16 h-4 bg-slate-900 rounded-sm" />
                 <div className="w-20 h-4 bg-slate-900 rounded-sm" />
              </div>
           </div>
        </div>
      </div>

    </div>
  )
}
