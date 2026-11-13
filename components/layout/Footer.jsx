import Link from 'next/link'

export default function Footer({ settings = {} }) {
  const currentYear = new Date().getFullYear()
  const brandName = settings.brand_name || 'MAISON & OBJECT'
  const tagline = settings.tagline?.trim()
  const affiliateDisclosure = settings.affiliate_disclosure?.trim()
  const instagramUrl = settings.instagram_url?.trim()
  const instagramHandle = settings.instagram_handle?.trim()
  const email = settings.email?.trim()
  const phone = settings.phone?.trim()

  return (
    <footer className="mt-24 border-t border-luxury-border/60 bg-luxury-bg text-luxury-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-luxury-border/40">
          
          {/* Brand & Editorial Intent */}
          <div className="md:col-span-5 space-y-4">
            <h2 className="font-editorial-serif text-xl sm:text-2xl font-normal text-luxury-text">
              {brandName}
            </h2>
            {tagline && (
              <p className="text-xs sm:text-sm text-luxury-muted leading-relaxed max-w-sm">
                {tagline}
              </p>
            )}
          </div>

          {/* Editorial Disclosure */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-luxury-subtle font-mono block">
              Editorial Notice
            </span>
            <p className="text-xs text-luxury-muted leading-relaxed">
              {affiliateDisclosure || 
                'We curate products independently. When you purchase through links on our site, we may earn an affiliate commission.'}
            </p>
          </div>

          {/* Navigation & Configured Contact Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-luxury-subtle font-mono block">
              Navigation &amp; Contact
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-luxury-text transition-colors">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-luxury-text transition-colors">
                  About the Journal
                </Link>
              </li>
              {instagramUrl && (
                <li>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-luxury-text transition-colors"
                  >
                    Instagram {instagramHandle ? `(@${instagramHandle.replace(/^@/, '')})` : ''}
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="hover:text-luxury-text transition-colors">
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li>
                  <span className="text-luxury-muted">{phone}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-luxury-subtle font-mono">
          <p>© {currentYear} {brandName}. All rights reserved.</p>
          <div className="mt-4 sm:mt-0 flex gap-6">
            <Link href="/about" className="hover:text-luxury-text transition-colors">
              Editorial Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
