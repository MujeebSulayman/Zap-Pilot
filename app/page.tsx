'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Globe, 
  ArrowUpRight,
  Database,
  CheckCircle2,
  Lock,
  ArrowUp,
  User,
  Mail,
  Layers
} from 'lucide-react'
import { useAuthStore, AuthState } from '@/store/useAuthStore'

export default function PremiumMasterpiecePage() {
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
    <div className="lg:h-screen flex flex-col lg:flex-row bg-white lg:overflow-hidden relative">
      
      {/* 42% LEFT: The Focused Auth Form */}
      <div className="lg:w-[42%] flex flex-col justify-center items-center p-8 lg:p-16 bg-white border-r border-slate-100 z-30">
        <div className="w-full max-w-[400px]">
          <div className="mb-10">
            <div className="flex items-center gap-2.5 mb-14">
              <div className="w-9 h-9 bg-slate-950 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-slate-200">
                Z
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Zap Pilot</span>
            </div>
            
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter leading-tight">
              {authMode === 'signup' ? 'Institutional growth.' : 'Welcome back, Pilot.'}
            </h1>
            <p className="text-slate-500 font-medium text-base">
              {authMode === 'signup' 
                ? 'Join thousands of capital pilots maximizing yield.' 
                : 'Sign in to manage your decentralized liquidity.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 mb-6 text-sm font-semibold flex items-center gap-3 animate-fade-up">
               <div className="w-2 h-2 rounded-full bg-red-500"></div>
               {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            {authMode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                <div className="relative group">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                   <input 
                    type="text" 
                    required
                    placeholder="Enter name"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 pl-12 pr-4 py-3.5 rounded-2xl outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 text-sm"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 pl-12 pr-4 py-3.5 rounded-2xl outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 text-sm"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                <span className="text-[10px] font-black text-slate-400 hover:text-slate-900 cursor-pointer uppercase tracking-widest">Forgot?</span>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 pl-12 pr-4 py-3.5 rounded-2xl outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 text-sm"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl transition-all disabled:opacity-70 flex items-center justify-center gap-3 text-base shadow-2xl shadow-slate-200 active:scale-[0.98] mt-2"
            >
              {loading ? 'Processing...' : authMode === 'signup' ? 'Create Account' : 'Sign In'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-slate-50">
            <button 
              onClick={() => { setAuthMode(authMode === 'signup' ? 'login' : 'signup'); setError('') }}
              className="text-xs font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.2em] w-full text-center"
            >
              {authMode === 'signup' ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>

      {/* 58% RIGHT: "The Command Hub" - Abstract Professional Template */}
      <div className="hidden lg:flex lg:w-[58%] bg-[#fcfcfc] flex-col relative overflow-hidden h-full">
        
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-full h-full opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #000 1.2px, transparent 0)', backgroundSize: '32px 32px' }} />

        {/* Central Master Card - The "Product" */}
        <div className="m-auto w-full max-w-[640px] relative z-10 px-6">
           <div className="bg-white border border-slate-100 rounded-[48px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] p-12 overflow-hidden relative group">
              
              <div className="flex items-center justify-between mb-16">
                 <div className="space-y-1.5">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Institutional Portfolio</p>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">₦24.8M</h2>
                 </div>
                 <div className="flex gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                       <ArrowUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="px-4 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                       <Zap className="w-3 h-3 text-emerald-400" /> Active 
                    </div>
                 </div>
              </div>

              {/* Minimal Graph Grid */}
              <div className="grid grid-cols-2 gap-8 mb-16">
                 <div className="space-y-4">
                    <div className="flex justify-between items-end h-24 gap-1.5">
                       {[0.4, 0.6, 0.35, 0.8, 0.5, 0.9, 0.75].map((h, i) => (
                         <div key={i} className="flex-1 bg-slate-100 rounded-lg group-hover:bg-emerald-500/10 transition-colors" style={{ height: `${h * 100}%` }} />
                       ))}
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">30-day performance trend</p>
                 </div>
                 <div className="flex flex-col justify-between">
                    <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Max APY</p>
                       <p className="text-xl font-black text-slate-900">14.2% <span className="text-xs text-emerald-500">+1.2%</span></p>
                    </div>
                    <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Liquid Assets</p>
                       <p className="text-xl font-black text-slate-900">100+</p>
                    </div>
                 </div>
              </div>

              {/* Protocol Mini Cards */}
              <div className="flex gap-4">
                 <div className="flex-1 p-5 rounded-[32px] bg-slate-950 text-white space-y-3 shadow-xl">
                    <div className="flex justify-between">
                       <Database className="w-4 h-4 text-emerald-400" />
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Secure</span>
                    </div>
                    <p className="text-sm font-black italic">Managed Infrastructure</p>
                 </div>
                 <div className="flex-1 p-5 rounded-[32px] border border-slate-100 bg-white space-y-3">
                    <div className="flex justify-between">
                       <Layers className="w-4 h-4 text-slate-950" />
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Global</span>
                    </div>
                    <p className="text-sm font-black italic text-slate-900">65+ Integrated Chains</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Bottom Trust Row - Fixed to screen bottom */}
        <div className="absolute bottom-12 left-0 w-full px-20 flex items-center justify-between opacity-50 z-20">
           <div className="flex items-center gap-10">
              <div className="flex gap-6 opacity-30 grayscale">
                 <div className="w-16 h-4 bg-slate-900 rounded-sm" />
                 <div className="w-20 h-4 bg-slate-900 rounded-sm" />
              </div>
           </div>
        </div>


      </div>

    </div>
  )
}
