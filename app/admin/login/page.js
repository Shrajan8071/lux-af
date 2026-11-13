'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isConfigured, setIsConfigured] = useState(true)
  const [checkingExistingSession, setCheckingExistingSession] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) {
      setIsConfigured(false)
      setCheckingExistingSession(false)
    } else {
      supabase.auth.getSession().then(({ data }) => {
        if (data?.session) {
          window.location.href = '/admin'
        } else {
          setCheckingExistingSession(false)
        }
      }).catch(() => {
        setCheckingExistingSession(false)
      })
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    if (!supabase) {
      // Local fallback mode when Supabase is not yet plugged in
      window.location.href = '/admin'
      return
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        setError(authError.message || 'Invalid login credentials. Please check your email and password.')
        setLoading(false)
      } else if (data?.session || data?.user) {
        // Immediate full navigation to admin console
        window.location.href = '/admin'
      } else {
        setError('Authentication completed but no active session was returned.')
        setLoading(false)
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during authentication.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="relative w-full max-w-md bg-luxury-card border border-luxury-border p-8 sm:p-10 shadow-sm overflow-hidden">
        
        {/* Animated Top Progress Bar when Loading */}
        {(loading || checkingExistingSession) && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-luxury-border/40 overflow-hidden">
            <div className="h-full bg-luxury-accent animate-pulse w-full"></div>
          </div>
        )}

        {/* Masthead */}
        <div className="text-center mb-8 border-b border-luxury-border/60 pb-6">
          <span className="text-[10px] uppercase tracking-widest font-mono text-luxury-accent block mb-1">
            Private Access
          </span>
          <h1 className="font-editorial-serif text-2xl sm:text-3xl font-normal text-luxury-text">
            Editorial Admin
          </h1>
          <p className="text-xs text-luxury-muted mt-2">
            Sign in to manage catalogue objects, editorial drafts, and site analytics.
          </p>
        </div>

        {/* Checking existing session banner */}
        {checkingExistingSession && (
          <div className="mb-6 p-4 bg-luxury-highlight border border-luxury-border text-xs text-luxury-muted flex items-center gap-3">
            <svg className="animate-spin h-4 w-4 text-luxury-accent shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Verifying active administrative session...</span>
          </div>
        )}

        {/* Configuration Notice if credentials not yet entered */}
        {!isConfigured && !checkingExistingSession && (
          <div className="mb-6 p-4 bg-[#FBF8F2] dark:bg-luxury-highlight border border-[#E8DEC8] dark:border-luxury-border text-xs text-[#6F6456] dark:text-luxury-muted leading-relaxed">
            <strong className="block text-[#4A4237] dark:text-luxury-text font-medium mb-1 font-mono">
              ● Framework Preview Mode
            </strong>
            Supabase credentials are not yet configured in <code className="bg-white dark:bg-luxury-card px-1 py-0.5 rounded border border-[#E0D5BE] dark:border-luxury-border">.env.local</code>. You can click below to access the full admin dashboard in preview mode.
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-800 dark:text-red-300 leading-relaxed">
            <strong>Authentication Notice:</strong> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-luxury-muted mb-2">
              Admin Email
            </label>
            <input
              type="email"
              required={isConfigured}
              disabled={loading || checkingExistingSession}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@yourdomain.com"
              className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] dark:bg-luxury-highlight text-luxury-text text-sm focus:bg-white dark:focus:bg-luxury-card transition-colors disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-luxury-muted mb-2">
              Password
            </label>
            <input
              type="password"
              required={isConfigured}
              disabled={loading || checkingExistingSession}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] dark:bg-luxury-highlight text-luxury-text text-sm focus:bg-white dark:focus:bg-luxury-card transition-colors disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={loading || checkingExistingSession}
            className="w-full mt-4 py-3.5 bg-luxury-black text-white dark:text-luxury-bg hover:bg-luxury-accent transition-all text-xs uppercase tracking-widest font-mono flex items-center justify-center gap-2.5 disabled:opacity-75 disabled:cursor-wait"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white dark:text-luxury-bg shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Authenticating &amp; Entering Console...</span>
              </>
            ) : checkingExistingSession ? (
              <span>Checking Session...</span>
            ) : isConfigured ? (
              <span>Sign In to Console</span>
            ) : (
              <span>Enter Admin Console (Preview Mode)</span>
            )}
          </button>

          {loading && (
            <p className="text-[11px] text-center font-mono text-luxury-accent animate-pulse mt-2">
              Validating credentials &middot; entering dashboard...
            </p>
          )}
        </form>

        <div className="mt-8 pt-6 border-t border-luxury-border/60 text-center">
          <Link
            href="/"
            className="text-xs text-luxury-muted hover:text-luxury-text font-mono transition-colors"
          >
            &larr; Return to Public Catalogue
          </Link>
        </div>
      </div>
    </div>
  )
}
