'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect } from 'react'

export function Navigation() {
  const pathname = usePathname()
  const { user, setUser, setLoading } = useAuthStore()

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [setUser, setLoading])

  if (pathname === '/') return null

  return (
    <nav className="fixed top-0 inset-x-0 h-16 glass z-50 flex items-center px-6">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#10B981] to-[#34D399] flex items-center justify-center text-white font-black">
            Z
          </div>
          Zap Pilot
        </Link>
        
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link href="/dashboard" className={`text-sm font-medium ${pathname === '/dashboard' ? 'text-[#10B981]' : 'text-slate-600 hover:text-slate-900 transition-colors'}`}>Dashboard</Link>
              <Link href="/vaults" className={`text-sm font-medium ${pathname === '/vaults' ? 'text-[#10B981]' : 'text-slate-600 hover:text-slate-900 transition-colors'}`}>Market</Link>
              <Link href="/portfolio" className={`text-sm font-medium ${pathname === '/portfolio' ? 'text-[#10B981]' : 'text-slate-600 hover:text-slate-900 transition-colors'}`}>Portfolio</Link>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="text-sm font-medium text-slate-800 bg-slate-100 px-3 py-1.5 rounded-full">
                {user.name || user.email.split('@')[0]}
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Sign in</Link>
              <Link href="/auth/signup" className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition-all shadow-md">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
