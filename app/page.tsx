'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowRight, 
  Wallet, 
  TrendingUp, 
  ShieldCheck, 
  Unlock,
  UserPlus,
  ArrowUpRight,
  User,
  Mail,
  Lock,
  Zap
} from 'lucide-react'
import { useAuthStore, AuthState } from '@/store/useAuthStore'

export default function BalancedProfessionalPage() {
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
    <div className="lg:h-screen flex flex-col lg:flex-row bg-slate-950 lg:overflow-hidden">
      
      {/* LEFT SIDE: Auth Form (50%) */}
      <div className="lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 border-r border-slate-900 bg-slate-950 overflow-y-auto">
        <div className="w-full max-w-[420px]">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-950 font-black text-xl">
                Z
              </div>
              <span className="text-2xl font-black text-white tracking-tight italic uppercase">Zap Pilot</span>
            </div>
            
            <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">
              {authMode === 'signup' ? 'Ready for takeoff.' : 'Welcome back, Pilot.'}
            </h2>
            <p className="text-slate-500 font-medium text-base">
              {authMode === 'signup' 
                ? 'Join the high-yield revolution in under 2 minutes.' 
                : 'Enter your credentials to manage your capital.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl mb-8 border border-slate-800">
            <button 
              onClick={() => { setAuthMode('signup'); setError('') }}
              className={`py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                authMode === 'signup' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              <UserPlus className="w-4 h-4" /> Sign Up
            </button>
            <button 
              onClick={() => { setAuthMode('login'); setError('') }}
              className={`py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                authMode === 'login' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              <Unlock className="w-4 h-4" /> Sign In
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-500 p-3 rounded-xl border border-red-500/20 mb-6 text-sm font-semibold flex items-center gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
               {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'signup' && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors border-r border-slate-800 pr-4 my-2.5">
                  <User className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-500" />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="Full Name"
                  className="w-full bg-slate-900/50 border border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 pl-16 pr-4 py-3 rounded-xl outline-none transition-all font-semibold text-white placeholder:text-slate-600 text-sm"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            )}
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors border-r border-slate-800 pr-4 my-2.5">
                <Mail className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-500" />
              </div>
              <input 
                type="email" 
                required
                placeholder="Email Address"
                className="w-full bg-slate-900/50 border border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 pl-16 pr-4 py-3 rounded-xl outline-none transition-all font-semibold text-white placeholder:text-slate-600 text-sm"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            
            <div className="relative group pb-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors border-r border-slate-800 pr-4 my-2.5">
                <Lock className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-500" />
              </div>
              <input 
                type="password" 
                required
                placeholder="Password"
                className="w-full bg-slate-900/50 border border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 pl-16 pr-4 py-3 rounded-xl outline-none transition-all font-semibold text-white placeholder:text-slate-600 text-sm"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base shadow-xl shadow-emerald-500/10 group"
            >
              {loading ? 'Authenticating...' : authMode === 'signup' ? 'Create Account' : 'Welcome Abroad'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-slate-500 text-[11px] text-center font-medium leading-relaxed">
            Protecting your assets is our top priority. By continuing you agree to the <span className="text-white font-bold hover:underline cursor-pointer">Terms of Service</span>.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Details & Value (Hidded on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900/40 flex-col justify-center p-8 lg:p-16 overflow-y-auto">
        <div className="max-w-xl mx-auto lg:mx-0">
      
          
          <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight mb-4 tracking-tighter">
            Capital growth, <br />
            <span className="text-emerald-500">fully automated.</span>
          </h1>
          <p className="text-lg text-slate-400 font-medium leading-relaxed mb-10">
            Institutional-grade yield infrastructure for Nigeria. Experience high-end tools designed specifically for the modern capital pilot.
          </p>

          <div className="space-y-6">
            {/* Live Yield Snapshots */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">USDC Savings</span>
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                 </div>
                 <div className="text-2xl font-black text-white">12.4% <span className="text-xs text-slate-500 font-bold">APY</span></div>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">DAI Yield</span>
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                 </div>
                 <div className="text-2xl font-black text-white">10.1% <span className="text-xs text-slate-500 font-bold">APY</span></div>
              </div>
            </div>

            {/* Workflow Description */}
            <div className="bg-slate-900 border border-slate-700/50 p-6 rounded-3xl">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" /> Instant NGN to Yield Flow
              </h3>
              <div className="flex items-center justify-between relative px-2">
                <div className="flex flex-col items-center gap-2 z-10">
                  <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-bold text-white">NGN</div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Bank</span>
                </div>
                <div className="h-px bg-slate-800 flex-1 mx-2 relative top-[-6px]"></div>
                <div className="flex flex-col items-center gap-2 z-10">
                  <div className="w-10 h-10 rounded-full bg-slate-950 border border-emerald-500/50 flex items-center justify-center text-xs font-bold text-emerald-500">USD</div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Auto-Convert</span>
                </div>
                <div className="h-px bg-slate-800 flex-1 mx-2 relative top-[-6px]"></div>
                <div className="flex flex-col items-center gap-2 z-10">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-emerald-500/20">
                     <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Yielding</span>
                </div>
              </div>
              <p className="mt-6 text-xs text-slate-400 leading-relaxed font-medium">
                Send Naira from any local bank. We bridge to stablecoins instantly and allocate to institutional-grade vaults—all gaslessly.
              </p>
            </div>
          </div>


          <div className="mt-10 pt-8 border-t border-slate-800 flex flex-wrap gap-8 justify-between">
            <div className="space-y-0.5">
              <p className="text-2xl font-black text-white italic tracking-tighter uppercase">20+</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Protocols</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-black text-white italic tracking-tighter uppercase">65+</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Chains</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-black text-white italic tracking-tighter uppercase">100+</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Liquid Assets</p>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}
