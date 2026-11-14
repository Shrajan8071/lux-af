'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import ThemeToggle from '@/components/layout/ThemeToggle'

export default function AdminNav({ initialBrandName = '' }) {
  const pathname = usePathname()
  const [brandName, setBrandName] = useState(initialBrandName)
  const [supabaseConnected, setSupabaseConnected] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    setSupabaseConnected(!!supabase)

    // Load live brand name
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data?.settings?.brand_name) {
          setBrandName(data.settings.brand_name)
        }
      })
      .catch(() => {})
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    window.location.href = '/admin/login'
  }

  const navLinks = [
    { label: 'Overview', href: '/admin' },
    { label: 'Products', href: '/admin/products' },
    { label: 'Add Product', href: '/admin/products/new' },
    { label: 'Site Settings', href: '/admin/settings' },
  ]

  return (
    <header className="border-b border-luxury-border/60 bg-luxury-bg/95 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Admin Title & Live Site Link */}
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <Link href="/admin" className="flex items-baseline gap-2.5 truncate group">
              <span className="font-editorial-serif text-xl sm:text-2xl font-normal text-luxury-text group-hover:text-luxury-accent transition-colors">
                {brandName || 'Admin Console'}
              </span>
              <span className="text-[10px] tracking-widest uppercase font-mono text-luxury-accent">
                Admin Console
              </span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs text-luxury-muted hover:text-luxury-text font-mono transition-colors"
            >
              <span>View Public Journal</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-4 sm:gap-6 text-xs font-mono tracking-wider">
            {navLinks.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors py-1 border-b ${
                    isActive
                      ? 'text-luxury-text border-luxury-accent font-medium'
                      : 'text-luxury-muted border-transparent hover:text-luxury-text hover:border-luxury-muted'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}

            <ThemeToggle className="ml-1" />

            <button
              onClick={handleSignOut}
              className="text-luxury-muted hover:text-luxury-text transition-colors border border-luxury-border hover:border-luxury-accent bg-luxury-card/50 hover:bg-luxury-card px-3 py-1.5 text-[11px] font-mono"
            >
              Sign Out
            </button>
          </nav>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-luxury-border/60 hover:border-luxury-accent bg-luxury-card/50 text-luxury-text focus:outline-none focus:ring-1 focus:ring-luxury-accent transition-colors"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-luxury-text animate-in fade-in zoom-in-75 duration-150" />
              ) : (
                <Menu className="w-4 h-4 text-luxury-text animate-in fade-in zoom-in-75 duration-150" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-luxury-border/60 bg-luxury-bg px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="flex flex-col space-y-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2.5 text-xs font-mono tracking-wider transition-colors border-l-2 ${
                    isActive
                      ? 'text-luxury-text bg-luxury-highlight border-luxury-accent font-medium'
                      : 'text-luxury-muted border-transparent hover:text-luxury-text hover:bg-luxury-highlight'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="pt-3 border-t border-luxury-border/40 flex flex-col gap-2">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-2 text-xs text-luxury-muted hover:text-luxury-text font-mono"
            >
              View Public Journal &rarr;
            </Link>

            <button
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2.5 text-xs font-mono text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-luxury-highlight"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Supabase Status Banner */}
      {!supabaseConnected && (
        <div className="bg-luxury-highlight border-t border-luxury-border px-4 py-2 text-center text-[11px] text-luxury-muted font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2" />
          Framework Preview Mode. Connect live database anytime via{' '}
          <code className="text-luxury-text bg-luxury-card px-1 py-0.5 rounded border border-luxury-border">SETUP_REQUIREMENTS.txt</code>.
        </div>
      )}
    </header>
  )
}
