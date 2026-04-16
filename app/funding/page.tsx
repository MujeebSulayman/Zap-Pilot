'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2, Navigation, Banknote, ShieldCheck } from 'lucide-react'

export default function FundingPage() {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/funding/fiat/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount) })
      })

      if (!res.ok) throw new Error('Funding failed')
      
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
    } catch (err) {
      console.error(err)
      // Provide user fallback notification in a real app
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-6 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Deposit Successful!</h2>
        <p className="text-slate-600 text-lg mb-8 max-w-md">
          Your ₦{Number(amount).toLocaleString()} has been securely funded and is ready to generate yield.
        </p>
        <div className="text-sm text-slate-400">Redirecting to dashboard...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
      <header className="text-center md:text-left mb-12 animate-fade-up">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Fund your Zap Pilot</h1>
        <p className="text-lg text-slate-600">
          Seamlessly move NGN from your local bank straight into high-yield automated vaults. No crypto-wallets required.
        </p>
      </header>

      <div className="grid md:grid-cols-5 gap-8">
        
        {/* Deposit Form */}
        <div className="md:col-span-3 glass p-8 rounded-3xl animate-fade-up shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Bank Transfer (NGN)</h2>
              <p className="text-sm text-slate-500">Secure direct deposit</p>
            </div>
          </div>

          <form onSubmit={handleDeposit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Amount to Deposit (₦)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">₦</span>
                <input 
                  type="number" 
                  min="1000"
                  required
                  placeholder="0.00"
                  className="w-full pl-12 pr-4 py-4 text-2xl font-black text-slate-900 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-[#10B981]/20 focus:border-[#10B981] outline-none transition-all placeholder:text-slate-300"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Minimum deposit: ₦1,000</p>
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !amount || Number(amount) < 1000}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
            >
              {loading ? 'Processing...' : 'Confirm Deposit'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
             <ShieldCheck className="w-8 h-8 text-[#10B981] mb-6" />
             <h3 className="text-lg font-bold mb-2">Bank-Grade Security</h3>
             <p className="text-slate-400 text-sm leading-relaxed mb-6">
               Through our integrated fiat partners, your funds are securely processed and immediately made available to allocate into global yielding markets.
             </p>
          </div>

          <div className="glass p-6 rounded-3xl flex items-start gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600 mt-1">
               <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Direct Stablecoin?</h4>
              <p className="text-xs text-slate-500">
                You can also deposit USDC or USDT directly if you already hold crypto. Available in account settings soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
