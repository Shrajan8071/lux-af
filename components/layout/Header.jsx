'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import ThemeToggle from '@/components/layout/ThemeToggle'

export default function Header({ settings = {} }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const brandName = settings.brand_name || 'MAISON & OBJECT'
  const navSubtitle = settings.nav_subtitle !== undefined && settings.nav_subtitle !== null 
    ? settings.nav_subtitle 
    : 'Editorial Product Discovery'
  const instagramUrl = settings.instagram_url?.trim()
  const instagramHandle = settings.instagram_handle?.trim()
  const email = settings.email?.trim()

  // Auto-close menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header className="border-b border-luxury-border/60 bg-luxury-bg/95 backdrop-blur-sm sticky top-0 z-40 transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* Brand Name / Masthead */}
          <div className="flex-1 min-w-0 pr-3 sm:pr-6">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-block group focus:outline-none focus:ring-1 focus:ring-luxury-accent max-w-full"
            >
              <h1 className="font-editorial-serif text-xl sm:text-2xl md:text-3xl tracking-tight text-luxury-text font-normal group-hover:text-luxury-accent transition-colors truncate">
                {brandName}
              </h1>
              {navSubtitle && (
                <p className="text-[9px] sm:text-[11px] tracking-widest uppercase text-luxury-subtle font-mono mt-0.5 truncate">
                  {navSubtitle}
                </p>
              )}
            </Link>
          </div>

          {/* Desktop Navigation (hidden on mobile, visible on md and up) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs sm:text-sm tracking-wide text-luxury-muted shrink-0">
            <Link
              href="/"
              className={`transition-colors pb-0.5 border-b ${
                pathname === '/'
                  ? 'text-luxury-text border-luxury-text font-medium'
                  : 'border-transparent hover:text-luxury-text hover:border-luxury-text'
              }`}
            >
              Catalogue
            </Link>
            <Link
              href="/blogs"
              className={`transition-colors pb-0.5 border-b ${
                pathname.startsWith('/blogs')
                  ? 'text-luxury-text border-luxury-text font-medium'
                  : 'border-transparent hover:text-luxury-text hover:border-luxury-text'
              }`}
            >
              Journal
            </Link>
            <Link
              href="/about"
              className={`transition-colors pb-0.5 border-b ${
                pathname === '/about'
                  ? 'text-luxury-text border-luxury-text font-medium'
                  : 'border-transparent hover:text-luxury-text hover:border-luxury-text'
              }`}
            >
              About
            </Link>

            {/* Optional Instagram: only if configured */}
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-luxury-text transition-colors pb-0.5 border-b border-transparent hover:border-luxury-text font-mono text-xs"
              >
                {instagramHandle ? `@${instagramHandle.replace(/^@/, '')}` : 'Instagram'}
              </a>
            )}

            {/* Optional Email: only if configured */}
            {email && (
              <a
                href={`mailto:${email}`}
                className="hover:text-luxury-text transition-colors pb-0.5 border-b border-transparent hover:border-luxury-text font-mono text-xs"
              >
                Contact
              </a>
            )}

            {/* Dark/Light Editorial Theme Toggle */}
            <ThemeToggle className="ml-2" />
          </nav>

          {/* Mobile Actions: Theme Toggle + Clean Hamburger Button */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-luxury-border/60 hover:border-luxury-accent bg-luxury-card/50 text-luxury-text focus:outline-none focus:ring-1 focus:ring-luxury-accent transition-colors"
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

      {/* Mobile Drawer / Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-luxury-border/60 bg-luxury-bg/98 backdrop-blur-md px-6 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2 font-mono">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between py-3 px-3.5 text-xs uppercase tracking-widest border-l-2 transition-colors ${
                pathname === '/'
                  ? 'border-luxury-accent text-luxury-text bg-luxury-highlight font-medium'
                  : 'border-transparent text-luxury-muted hover:text-luxury-text hover:bg-luxury-highlight/60'
              }`}
            >
              <span>Catalogue</span>
              <span className="text-[10px] text-luxury-subtle">&rarr;</span>
            </Link>

            <Link
              href="/blogs"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between py-3 px-3.5 text-xs uppercase tracking-widest border-l-2 transition-colors ${
                pathname.startsWith('/blogs')
                  ? 'border-luxury-accent text-luxury-text bg-luxury-highlight font-medium'
                  : 'border-transparent text-luxury-muted hover:text-luxury-text hover:bg-luxury-highlight/60'
              }`}
            >
              <span>The Journal (Blogs)</span>
              <span className="text-[10px] text-luxury-subtle">&rarr;</span>
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between py-3 px-3.5 text-xs uppercase tracking-widest border-l-2 transition-colors ${
                pathname === '/about'
                  ? 'border-luxury-accent text-luxury-text bg-luxury-highlight font-medium'
                  : 'border-transparent text-luxury-muted hover:text-luxury-text hover:bg-luxury-highlight/60'
              }`}
            >
              <span>About the Journal</span>
              <span className="text-[10px] text-luxury-subtle">&rarr;</span>
            </Link>

            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3 px-3.5 text-xs uppercase tracking-widest border-l-2 border-transparent text-luxury-muted hover:text-luxury-text hover:bg-luxury-highlight/60 transition-colors"
              >
                <span>Instagram {instagramHandle ? `(@${instagramHandle.replace(/^@/, '')})` : ''}</span>
                <span className="text-[10px] text-luxury-subtle">&#8599;</span>
              </a>
            )}

            {email && (
              <a
                href={`mailto:${email}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3 px-3.5 text-xs uppercase tracking-widest border-l-2 border-transparent text-luxury-muted hover:text-luxury-text hover:bg-luxury-highlight/60 transition-colors"
              >
                <span>Contact ({email})</span>
                <span className="text-[10px] text-luxury-subtle">&#9993;</span>
              </a>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-luxury-border/40 flex items-center justify-between text-[10px] text-luxury-subtle font-mono uppercase tracking-wider">
            <span>Editorial Navigation</span>
            <span>{brandName}</span>
          </div>
        </div>
      )}
    </header>
  )
}
