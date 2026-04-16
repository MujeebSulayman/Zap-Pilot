import Link from 'next/link'
import { ArrowRight, Wallet, TrendingUp, ShieldCheck } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center w-full px-6 overflow-x-hidden pt-20">
      
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-8 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 text-[#059669] font-medium text-sm font-sans mb-4 border border-[#10B981]/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
          </span>
          Now live for NGN 🇳🇬 deposits!
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Earn Auto-Yield, <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#3B82F6]">
            No Crypto Knowledge Required.
          </span>
        </h1>
        
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Deposit fiat straight from your local bank account (₦) or via direct stablecoin transfer. We allocate it into top-tier yield markets so you earn automatically.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link href="/auth/signup" className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-slate-800 hover:shadow-glow transition-all">
            Start Earning Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/vaults" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            Explore Markets
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto mt-32 grid md:grid-cols-3 gap-8 pb-32">
        <div className="glass p-8 rounded-3xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6">
            <Wallet className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Seamless On-Ramp</h3>
          <p className="text-slate-600 leading-relaxed">
            Skip the confusing exchanges. Send NGN directly from your bank or bridge stablecoins instantly. 
          </p>
        </div>

        <div className="glass p-8 rounded-3xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#10B981] mb-6">
            <TrendingUp className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Automated Growth</h3>
          <p className="text-slate-600 leading-relaxed">
            Your funds are allocated into the safest, high-yielding vaults automatically. Watch your wealth grow in real-time.
          </p>
        </div>

        <div className="glass p-8 rounded-3xl animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 mb-6">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Fully Gasless</h3>
          <p className="text-slate-600 leading-relaxed">
            Forget gas fees and confusing wallet popups. We handle the technical blockchain complexity entirely in the background.
          </p>
        </div>
      </section>

    </div>
  )
}
