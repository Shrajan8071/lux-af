import Link from 'next/link'
import ThemeToggle from '@/components/layout/ThemeToggle'

export default function Header({ settings = {} }) {
  const brandName = settings.brand_name || 'MAISON & OBJECT'
  const navSubtitle = settings.nav_subtitle !== undefined && settings.nav_subtitle !== null 
    ? settings.nav_subtitle 
    : 'Editorial Product Discovery'
  const instagramUrl = settings.instagram_url?.trim()
  const instagramHandle = settings.instagram_handle?.trim()
  const email = settings.email?.trim()

  return (
    <header className="border-b border-luxury-border/60 bg-luxury-bg/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-24 py-3 sm:py-0">
          {/* Brand Name / Masthead */}
          <div className="flex-1 min-w-0 pr-4">
            <Link
              href="/"
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

          {/* Minimal Navigation & Configured Links Only */}
          <nav className="flex items-center gap-4 sm:gap-8 text-xs sm:text-sm tracking-wide text-luxury-muted shrink-0">
            <Link
              href="/"
              className="hover:text-luxury-text transition-colors pb-0.5 border-b border-transparent hover:border-luxury-text"
            >
              Catalogue
            </Link>
            <Link
              href="/about"
              className="hover:text-luxury-text transition-colors pb-0.5 border-b border-transparent hover:border-luxury-text"
            >
              About
            </Link>

            {/* Optional Instagram: only if configured */}
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-block hover:text-luxury-text transition-colors pb-0.5 border-b border-transparent hover:border-luxury-text font-mono text-xs"
              >
                {instagramHandle ? `@${instagramHandle.replace(/^@/, '')}` : 'Instagram'}
              </a>
            )}

            {/* Optional Email: only if configured */}
            {email && (
              <a
                href={`mailto:${email}`}
                className="hidden lg:inline-block hover:text-luxury-text transition-colors pb-0.5 border-b border-transparent hover:border-luxury-text font-mono text-xs"
              >
                Contact
              </a>
            )}

            {/* Dark/Light Editorial Theme Toggle */}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
