'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowRight, 
  Wallet, 
  TrendingUp, 
  ShieldCheck, 
  Unlock,
  UserPlus,
  ArrowUpRight
} from 'lucide-react'
import { useAuthStore, AuthState } from '@/store/useAuthStore'

const FEATURES = [
  {
    title: "Instant NGN On-Ramp",
    description: "Simplified liquidity for the Nigerian market. Connect your bank and move NGN directly to yields.",
    icon: <Wallet className="w-5 h-5 text-slate-600" />
  },
  {
    title: "Global Yield Protocols",
    description: "Institutional-grade access to Aave, Morpho, and Euler without the technical overhead.",
    icon: <TrendingUp className="w-5 h-5 text-slate-600" />
  },
  {
    title: "Managed Infrastructure",
    description: "Gasless transactions and dedicated wallets powered by the Blockradar network.",
    icon: <ShieldCheck className="w-5 h-5 text-slate-600" />
  }
]

export default function ProfessionalOnboardingPage() {
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      
      {/* LEFT SIDE: Auth Form (Desktop: 45%, Mobile: Full) */}
      <div className="lg:w-[45%] flex flex-col justify-center items-center p-8 lg:p-24 border-r border-slate-100">
        <div className="w-full max-w-[400px]">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-10">
              <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white font-bold text-lg">
                Z
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Zap Pilot</span>
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
              {authMode === 'signup' ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="text-slate-500 font-medium">
              {authMode === 'signup' 
                ? 'Join 5,000+ pilots building wealth on-chain.' 
                : 'Enter your credentials to access your dashboard.'}
            </p>
          </div>

          <div className="flex border-b border-slate-100 mb-8">
            <button 
              onClick={() => { setAuthMode('signup'); setError('') }}
              className={`pb-4 px-2 text-sm font-bold transition-all relative ${
                authMode === 'signup' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign Up
              {authMode === 'signup' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />}
            </button>
            <button 
              onClick={() => { setAuthMode('login'); setError('') }}
              className={`pb-4 px-6 text-sm font-bold transition-all relative ${
                authMode === 'login' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign In
              {authMode === 'login' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />}
            </button>
          </div>

          {error && (
            <div className="bg-slate-50 text-slate-900 p-4 rounded border border-slate-200 mb-6 text-sm font-medium">
               {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            {authMode === 'signup' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ebube James"
                  className="w-full border border-slate-200 focus:border-slate-900 focus:ring-0 px-4 py-3 rounded outline-none transition-all font-medium text-slate-900 placeholder:text-slate-300"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="ebube@example.com"
                className="w-full border border-slate-200 focus:border-slate-900 focus:ring-0 px-4 py-3 rounded outline-none transition-all font-medium text-slate-900 placeholder:text-slate-300"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2 pb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full border border-slate-200 focus:border-slate-900 focus:ring-0 px-4 py-3 rounded outline-none transition-all font-medium text-slate-900 placeholder:text-slate-300"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : authMode === 'signup' ? 'Get Started' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-8 text-slate-400 text-xs text-center lg:text-left">
            By creating an account you agree to our <span className="text-slate-900 font-bold underline cursor-pointer">Terms</span> and <span className="text-slate-900 font-bold underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Details & Value (Desktop: 55%, Mobile: Hidden/Top) */}
      <div className="lg:w-[55%] bg-slate-50 flex flex-col justify-center p-12 lg:p-24">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-200 text-slate-700 text-xs font-bold mb-8">
            <span className="w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
            V0.4 NOW LIVE
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-8 tracking-tighter">
            Automated capital management for Nigeria.
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed mb-16">
            Skip the complexity of DeFi. Move NGN into yield-bearing assets in seconds. High-end infrastructure designed for the modern pilot.
          </p>

          <div className="grid gap-10">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="flex gap-6 group">
                <div className="w-12 h-12 rounded bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
                  {feature.icon}
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                    {feature.title}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-slate-400" />
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-slate-200 flex flex-wrap gap-12">
            <div>
              <p className="text-2xl font-bold text-slate-900">₦500M+</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Processed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">0.05s</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg. Confirmation</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">24/7</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Uptime</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
