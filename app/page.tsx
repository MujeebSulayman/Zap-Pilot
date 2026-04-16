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
  Globe,
  Plus,
  ArrowUpRight,
  Layers,
  Database
} from 'lucide-react'
import { useAuthStore, AuthState } from '@/store/useAuthStore'

export default function PremiumB2BAuthPage() {
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
    <div className="lg:h-screen flex flex-col lg:flex-row bg-white lg:overflow-hidden">
      
      {/* 40% LEFT: High-End Minimalist Form */}
      <div className="lg:w-[40%] flex flex-col justify-center items-center p-8 lg:p-20 bg-white border-r border-slate-100 z-20">
        <div className="w-full max-w-[380px]">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-black text-xl">Z</div>
              <span className="text-xl font-black text-black tracking-tighter uppercase italic">Zap Pilot</span>
            </div>
            
            <h1 className="text-4xl font-black text-black mb-3 tracking-tighter leading-none">
              {authMode === 'signup' ? 'Upgrade your capital.' : 'Welcome back.'}
            </h1>
            <p className="text-slate-500 font-medium text-base">
              {authMode === 'signup' 
                ? 'Join high-yield protocols in minutes.' 
                : 'Sign in to manage your yield fleet.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {authMode === 'signup' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Samuel Okafor"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-black focus:ring-0 px-4 py-4 rounded-xl outline-none transition-all font-bold text-black placeholder:text-slate-300 text-sm"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <input 
                type="email" 
                required
                placeholder="sam@yourcompany.io"
                className="w-full bg-slate-50 border border-slate-200 focus:border-black focus:ring-0 px-4 py-4 rounded-xl outline-none transition-all font-bold text-black placeholder:text-slate-300 text-sm"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                <span className="text-[10px] font-black text-slate-400 hover:text-black cursor-pointer uppercase tracking-widest">Forgot?</span>
              </div>
              <input 
                type="password" 
                required
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-200 focus:border-black focus:ring-0 px-4 py-4 rounded-xl outline-none transition-all font-bold text-black placeholder:text-slate-300 text-sm"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black hover:bg-slate-800 text-white font-black py-4.5 rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-3 text-base shadow-2xl shadow-black/10 active:scale-[0.98]"
            >
              {loading ? 'Processing...' : authMode === 'signup' ? 'Create Account' : 'Sign In'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-slate-100">
            <button 
              onClick={() => { setAuthMode(authMode === 'signup' ? 'login' : 'signup'); setError('') }}
              className="text-xs font-black text-slate-400 hover:text-black transition-colors uppercase tracking-[0.2em] w-full text-center"
            >
              {authMode === 'signup' ? 'Return to login' : 'New to Zap? Sign up'}
            </button>
          </div>
        </div>
      </div>

      {/* 60% RIGHT: "The HUD" - Industrial B2B Template */}
      <div className="hidden lg:flex lg:w-[60%] bg-slate-50 p-16 flex-col justify-center relative items-center">
        
        {/* Background Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-200/50 via-transparent to-transparent pointer-events-none" />

        <div className="w-full max-w-[840px] grid grid-cols-12 gap-8 relative z-10">
          
          {/* Main Balance HUD */}
          <div className="col-span-12 bg-white border-[1.5px] border-black p-12 rounded-[48px] shadow-[20px_20px_0px_0px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-start mb-12">
              <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Master Portfolio Balance</p>
                <h2 className="text-7xl font-black text-black tracking-tighter leading-none">
                  ₦24,850,000<span className="text-3xl text-slate-300">.00</span>
                </h2>
              </div>
              <div className="flex gap-4">
                 <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-100">
                    +14.2% Growth
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-12 pt-12 border-t-[1.5px] border-slate-100">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Chains</p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500" />
                   <p className="font-black text-base uppercase">65 Integrated</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audited Protocols</p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-black" />
                   <p className="font-black text-base uppercase">20 Connected</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</p>
                <div className="flex items-center gap-2 text-emerald-600">
                   <Globe className="w-4 h-4 animate-pulse" />
                   <p className="font-black text-base uppercase tracking-tighter">Operational</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stats Row */}
          <div className="col-span-7 bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm flex items-center justify-between group hover:border-black transition-colors">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-900 border border-slate-100">
                  <Database className="w-8 h-8" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Value Locked</p>
                  <p className="text-2xl font-black text-black">₦1.2B <span className="text-xs text-slate-300 font-bold uppercase italic tracking-tighter">Liquid Capital</span></p>
               </div>
            </div>
            <ArrowUpRight className="w-6 h-6 text-slate-300 group-hover:text-black transition-colors" />
          </div>

          <div className="col-span-5 bg-black p-8 rounded-[40px] text-white flex flex-col justify-center">
             <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Security Hub</span>
             </div>
             <p className="text-lg font-black leading-tight italic">Dedicated non-custodial managed nodes.</p>
          </div>

          {/* Bottom Trust Row */}
          <div className="col-span-12 mt-8 flex items-center justify-between px-6 opacity-40">
             <div className="flex items-center gap-8">
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Audited by:</span>
                <div className="h-4 w-20 bg-black rounded-sm" />
                <div className="h-4 w-24 bg-black rounded-sm" />
                <div className="h-4 w-16 bg-black rounded-sm" />
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Mainnet Verified</span>
             </div>
          </div>

        </div>
      </div>

    </div>
  )
}
