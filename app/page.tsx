'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Wallet, TrendingUp, ShieldCheck } from 'lucide-react'

// Mobile-app like onboarding slides
const ONBOARDING_SLIDES = [
  {
    title: "Seamless On-Ramp",
    description: "Skip the confusing exchanges. Send NGN directly from your bank or bridge stablecoins instantly.",
    icon: <Wallet className="w-16 h-16 text-blue-600" />,
    bg: "bg-blue-100"
  },
  {
    title: "Automated Growth",
    description: "Your funds are allocated into the safest, high-yielding vaults automatically. Watch your wealth grow in real-time.",
    icon: <TrendingUp className="w-16 h-16 text-[#10B981]" />,
    bg: "bg-emerald-100"
  },
  {
    title: "Fully Gasless",
    description: "Forget gas fees and confusing wallet popups. Each user gets a dedicated wallet automatically powered by Blockradar.",
    icon: <ShieldCheck className="w-16 h-16 text-purple-600" />,
    bg: "bg-purple-100"
  }
]

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const handleNext = () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1)
    }
  }

  const slide = ONBOARDING_SLIDES[currentSlide]
  const isLastSlide = currentSlide === ONBOARDING_SLIDES.length - 1

  return (
    <div className="flex-1 flex flex-col justify-between items-center w-full px-6 py-6 overflow-hidden bg-slate-50 min-h-[100dvh]">
      
      {/* Top section: Progress indicator dots */}
      <div className="w-full flex justify-between items-center max-w-sm mx-auto pt-4 relative">
        {!isLastSlide ? (
          <button 
            onClick={() => setCurrentSlide(ONBOARDING_SLIDES.length - 1)}
            className="text-slate-500 font-medium text-sm hover:text-slate-800 transition-colors absolute left-0"
          >
            Skip
          </button>
        ) : null}
        
        <div className="flex gap-2 mx-auto">
          {ONBOARDING_SLIDES.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-6 bg-slate-900' : 'w-2 bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col justify-center items-center max-w-sm mx-auto w-full text-center space-y-8 animate-fade-in transition-all duration-500 mt-4">
        <div key={currentSlide} className="animate-fade-up w-full flex flex-col items-center">
          <div className={`w-40 h-40 rounded-[2.5rem] ${slide.bg} flex items-center justify-center mb-10 shadow-sm border border-white/50`}>
            {slide.icon}
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {slide.title}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            {slide.description}
          </p>
        </div>
      </div>

      {/* Bottom section: Actions */}
      <div className="w-full max-w-sm mx-auto pb-8 pt-4 space-y-4">
        {!isLastSlide ? (
          <button 
            onClick={handleNext}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98]"
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex flex-col gap-3 animate-fade-up">
            <Link 
              href="/auth/signup" 
              className="w-full py-4 bg-[#10B981] text-white rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-[#059669] shadow-sm transition-all active:scale-[0.98]"
            >
              Sign up
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/auth/login" 
              className="w-full py-4 bg-white text-slate-800 border-2 border-slate-200 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>

    </div>
  )
}
