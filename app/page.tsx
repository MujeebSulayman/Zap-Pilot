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
  Lock
} from 'lucide-react'
import { useAuthStore, AuthState } from '@/store/useAuthStore'

const FEATURES = [
  {
    title: "Instant NGN On-Ramp",
    description: "Simplified liquidity for the Nigerian market. Connect your bank and move NGN directly to yields.",
    icon: <Wallet className="w-5 h-5 text-slate-300" />
  },
  {
    title: "Global Yield Protocols",
    description: "Institutional-grade access to Aave, Morpho, and Euler without the technical overhead.",
    icon: <TrendingUp className="w-5 h-5 text-slate-300" />
  },
  {
    title: "Managed Infrastructure",
    description: "Gasless transactions and dedicated wallets powered by the Blockradar network.",
    icon: <ShieldCheck className="w-5 h-5 text-slate-300" />
  }
]

export default function BalancedProfessionalPage() {
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup')
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950">
      
      {/* LEFT SIDE: Auth Form (50%) */}
      <div className="lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 border-r border-slate-900 bg-slate-950">
        <div className="w-full max-w-[420px]">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-950 font-black text-xl">
                Z
              </div>
              <span className="text-2xl font-black text-white tracking-tight italic uppercase">Zap Pilot</span>
            </div>
            
            <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">
              {authMode === 'signup' ? 'Ready for takeoff.' : 'Welcome back, Pilot.'}
            </h2>
            <p className="text-slate-500 font-medium text-lg">
              {authMode === 'signup' 
                ? 'Join the high-yield revolution in under 2 minutes.' 
                : 'Enter your credentials to manage your capital.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-900 rounded-xl mb-10 border border-slate-800">
            <button 
              onClick={() => { setAuthMode('signup'); setError('') }}
              className={`py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                authMode === 'signup' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              <UserPlus className="w-4 h-4" /> Create Account
            </button>
            <button 
              onClick={() => { setAuthMode('login'); setError('') }}
              className={`py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                authMode === 'login' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              <Unlock className="w-4 h-4" /> Sign In
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/20 mb-8 text-sm font-semibold flex items-center gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
               {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            {authMode === 'signup' && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors border-r border-slate-800 pr-4 my-3">
                  <User className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-500" />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="Full Name"
                  className="w-full bg-slate-900/50 border border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 pl-16 pr-4 py-4 rounded-xl outline-none transition-all font-semibold text-white placeholder:text-slate-600 sm:text-base text-sm"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            )}
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors border-r border-slate-800 pr-4 my-3">
                <Mail className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-500" />
              </div>
              <input 
                type="email" 
                required
                placeholder="Email Address"
                className="w-full bg-slate-900/50 border border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 pl-16 pr-4 py-4 rounded-xl outline-none transition-all font-semibold text-white placeholder:text-slate-600 sm:text-base text-sm"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            
            <div className="relative group pb-2">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors border-r border-slate-800 pr-4 my-3">
                <Lock className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-500" />
              </div>
              <input 
                type="password" 
                required
                placeholder="Password"
                className="w-full bg-slate-900/50 border border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 pl-16 pr-4 py-4 rounded-xl outline-none transition-all font-semibold text-white placeholder:text-slate-600 sm:text-base text-sm"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-xl shadow-emerald-500/10 group active:scale-[0.98]"
            >
              {loading ? 'Authenticating...' : authMode === 'signup' ? 'Create Account' : 'Welcome Abroad'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-10 text-slate-500 text-xs text-center font-medium leading-relaxed">
            Protecting your assets is our top priority. By continuing you agree to the <span className="text-white font-bold hover:underline cursor-pointer">Terms of Service</span>.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Details & Value (50%) */}
      <div className="lg:w-1/2 bg-slate-900/40 flex flex-col justify-center p-8 lg:p-24">
        <div className="max-w-xl mx-auto lg:mx-0">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-widest mb-10 border border-slate-700 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Mainnet Beta V0.4
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-8 tracking-tighter">
            Capital growth, <br />
            <span className="text-emerald-500">fully automated.</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium leading-relaxed mb-16">
            Institutional-grade yield infrastructure for the Nigerian market. Experience high-end tools designed specifically for the modern capital pilot.
          </p>

          <div className="grid gap-14">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="flex gap-8 group">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 shadow-lg transition-all group-hover:border-emerald-500/50 group-hover:translate-y-[-2px]">
                  {feature.icon}
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                    {feature.title}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-emerald-500" />
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-16 border-t border-slate-800 flex flex-wrap gap-12 justify-between">
            <div className="space-y-1">
              <p className="text-3xl font-black text-white italic tracking-tighter uppercase">₦500M+</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Processed</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-black text-white italic tracking-tighter uppercase">0.05s</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Latency</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-black text-white italic tracking-tighter uppercase">24/7</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Uptime</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
