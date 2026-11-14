'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

export default function AdminSettingsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // Settings state
  const [brandName, setBrandName] = useState('')
  const [navSubtitle, setNavSubtitle] = useState('Editorial Product Discovery')
  const [tagline, setTagline] = useState('')
  const [homeBadge, setHomeBadge] = useState('Curated Hardware · Personal Field Notes')
  const [homeHeading, setHomeHeading] = useState('The Product Index')
  const [homeSubheading, setHomeSubheading] = useState('A restrained catalogue of exceptional personal technology, industrial design, and daily tools evaluated for enduring utility and craftsmanship.')
  const [instagramHandle, setInstagramHandle] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [currencySymbol, setCurrencySymbol] = useState('₹')
  const [aboutText, setAboutText] = useState('')
  const [aboutSubtitle, setAboutSubtitle] = useState('On the curation of objects that endure.')
  const [curatorialPrinciples, setCuratorialPrinciples] = useState([
    { title: 'Material & Build Integrity', description: '' },
    { title: 'Performance Over Hype', description: '' },
    { title: 'Editorial Independence', description: '' }
  ])
  const [affiliateDisclosure, setAffiliateDisclosure] = useState('')
  
  // AdSense configuration
  const [adsenseClientId, setAdsenseClientId] = useState('')
  const [adsenseSlotId, setAdsenseSlotId] = useState('')
  const [adsenseEnabled, setAdsenseEnabled] = useState(false)

  // Check if just saved from refresh query
  useEffect(() => {
    if (searchParams.get('saved') === 'true') {
      setSuccessMsg('Settings saved successfully and live across your website!')
      router.replace('/admin/settings')
    }
  }, [searchParams, router])

  useEffect(() => {
    async function loadSettings() {
      setLoading(true)
      try {
        const res = await fetch('/api/admin/settings')
        if (res.ok) {
          const data = await res.json()
          if (data.settings) {
            const s = data.settings
            setBrandName(s.brand_name || 'Shrajan Gupta')
            setNavSubtitle(s.nav_subtitle !== undefined && s.nav_subtitle !== null ? s.nav_subtitle : 'Editorial Product Discovery')
            setTagline(s.tagline || '')
            setHomeBadge(s.home_badge !== undefined && s.home_badge !== null ? s.home_badge : 'Curated Hardware · Personal Field Notes')
            setHomeHeading(s.home_heading !== undefined && s.home_heading !== null ? s.home_heading : 'The Product Index')
            setHomeSubheading(s.home_subheading !== undefined && s.home_subheading !== null ? s.home_subheading : 'A restrained catalogue of exceptional personal technology, industrial design, and daily tools evaluated for enduring utility and craftsmanship.')
            setInstagramHandle(s.instagram_handle || '')
            setInstagramUrl(s.instagram_url || '')
            setEmail(s.email || '')
            setPhone(s.phone || '')
            setCurrencySymbol(s.currency_symbol || '₹')
            setAboutText(s.about_text || '')
            setAboutSubtitle(s.about_subtitle || 'On the curation of objects that endure.')
            
            let loadedPrinciples = s.curatorial_principles
            if (typeof loadedPrinciples === 'string') {
              try { loadedPrinciples = JSON.parse(loadedPrinciples) } catch { loadedPrinciples = [] }
            }
            if (Array.isArray(loadedPrinciples) && loadedPrinciples.length > 0) {
              setCuratorialPrinciples(loadedPrinciples)
            }
            
            setAffiliateDisclosure(s.affiliate_disclosure || '')
            setAdsenseClientId(s.adsense_client_id || '')
            setAdsenseSlotId(s.adsense_slot_id || '')
            setAdsenseEnabled(!!s.adsense_enabled)
          }
        }
      } catch (e) {
        setError('Error loading settings')
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  // Principle helpers
  const handlePrincipleChange = (index, field, value) => {
    const updated = [...curatorialPrinciples]
    updated[index][field] = value
    setCuratorialPrinciples(updated)
  }

  const handleAddPrinciple = () => {
    setCuratorialPrinciples([
      ...curatorialPrinciples,
      { title: '', description: '' }
    ])
  }

  const handleRemovePrinciple = (index) => {
    if (curatorialPrinciples.length <= 1) {
      alert('You should have at least one curatorial principle.')
      return
    }
    setCuratorialPrinciples(curatorialPrinciples.filter((_, i) => i !== index))
  }

  const handleOpenConfirm = (e) => {
    e.preventDefault()
    setError(null)

    if (!brandName.trim()) {
      setError('Brand name cannot be blank.')
      return
    }

    setShowConfirmModal(true)
  }

  const handleConfirmSave = async () => {
    setSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand_name: brandName.trim(),
          nav_subtitle: navSubtitle.trim(),
          tagline: tagline.trim(),
          home_badge: homeBadge.trim(),
          home_heading: homeHeading.trim(),
          home_subheading: homeSubheading.trim(),
          instagram_handle: instagramHandle.trim(),
          instagram_url: instagramUrl.trim(),
          email: email.trim(),
          phone: phone.trim(),
          currency_symbol: currencySymbol.trim(),
          about_text: aboutText.trim(),
          about_subtitle: aboutSubtitle.trim(),
          curatorial_principles: curatorialPrinciples.filter(p => p.title.trim().length > 0),
          affiliate_disclosure: affiliateDisclosure.trim(),
          adsense_client_id: adsenseClientId.trim(),
          adsense_slot_id: adsenseSlotId.trim(),
          adsense_enabled: adsenseEnabled
        })
      })

      const data = await res.json()
      if (data.success) {
        setShowConfirmModal(false)
        window.location.href = '/admin/settings?saved=true'
      } else {
        setShowConfirmModal(false)
        setError(data.error || 'Failed to save settings')
        setSaving(false)
      }
    } catch {
      setShowConfirmModal(false)
      setError('Network error saving settings. Please try again.')
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="py-20 text-center font-mono text-xs text-luxury-muted">Loading settings...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="border-b border-luxury-border/80 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-mono text-luxury-accent block mb-1">
            Configuration &amp; Brand
          </span>
          <h1 className="font-editorial-serif text-3xl sm:text-4xl text-luxury-text font-normal">
            Site Settings
          </h1>
          <p className="text-xs text-luxury-muted mt-1">
            Control editorial identity, contact links, About narrative, Curatorial Principles, and disclosures.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-luxury-border bg-white text-xs font-mono text-luxury-muted hover:text-luxury-text"
        >
          <span>View Live Site</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-900 dark:text-red-300 font-mono flex items-center justify-between">
          <span>⚠ {error}</span>
          <button onClick={() => setError(null)} className="text-red-700 dark:text-red-400 hover:text-red-900">✕</button>
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 text-xs text-emerald-950 dark:text-emerald-300 font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">✓</span>
            <span>{successMsg}</span>
          </div>
          <Link
            href="/about"
            target="_blank"
            className="underline underline-offset-4 text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 font-medium ml-4"
          >
            Open About Page ↗
          </Link>
        </div>
      )}

      <form onSubmit={handleOpenConfirm} className="space-y-8">
        
        {/* Section 1: Brand Identity */}
        <section className="bg-white border border-luxury-border p-6 sm:p-8 space-y-6">
          <div className="border-b border-luxury-border/60 pb-3">
            <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent">
              1. Brand &amp; Masthead
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                Website Brand Name <span className="text-luxury-accent">*</span>
              </label>
              <input
                type="text"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Editorial Journal or Brand Name"
                className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-base font-editorial-serif focus:bg-white"
              />
              <span className="text-[11px] text-luxury-subtle mt-1 block">
                Displayed in the global header, footer, and browser title.
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                Default Currency Symbol
              </label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                placeholder="₹"
                className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm font-mono focus:bg-white"
              />
              <span className="text-[11px] text-luxury-subtle mt-1 block">
                Standard prefix for catalogue price tags (e.g. ₹ or $ or €).
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
              Navigation Bar Subtitle / Header Descriptor
            </label>
            <input
              type="text"
              value={navSubtitle}
              onChange={(e) => setNavSubtitle(e.target.value)}
              placeholder="Editorial Product Discovery"
              className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm focus:bg-white"
            />
            <span className="text-[11px] text-luxury-subtle mt-1 block">
              Displayed directly below your brand name in the sticky top navigation header bar (default: &quot;Editorial Product Discovery&quot;).
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
              Brand Tagline / Descriptor
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="A curated journal of exceptional personal technology, industrial design, and daily tools."
              className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm focus:bg-white"
            />
            <span className="text-[11px] text-luxury-subtle mt-1 block">
              Displayed in the global footer and search engine meta descriptions.
            </span>
          </div>
        </section>

        {/* Section 2: Homepage Catalogue Header */}
        <section className="bg-white border border-luxury-border p-6 sm:p-8 space-y-6">
          <div className="border-b border-luxury-border/60 pb-3">
            <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent">
              2. Homepage Catalogue Masthead
            </span>
            <span className="text-[11px] text-luxury-subtle font-mono block mt-0.5">
              Customizes the editorial badge, main heading, and narrative intro above the homepage product grid.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                Catalogue Badge / Issue Tag
              </label>
              <input
                type="text"
                value={homeBadge}
                onChange={(e) => setHomeBadge(e.target.value)}
                placeholder="Curated Hardware · Personal Field Notes"
                className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm font-mono uppercase tracking-wider focus:bg-white"
              />
              <span className="text-[11px] text-luxury-subtle mt-1 block">
                Top small uppercase tag (e.g. &quot;Curated Selection · Issue No. 01&quot; or &quot;Curated Hardware · Field Notes&quot;).
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                Catalogue Main Heading
              </label>
              <input
                type="text"
                value={homeHeading}
                onChange={(e) => setHomeHeading(e.target.value)}
                placeholder="The Product Index"
                className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-base font-editorial-serif focus:bg-white"
              />
              <span className="text-[11px] text-luxury-subtle mt-1 block">
                Main editorial title (e.g. &quot;The Product Index&quot; or &quot;The Hardware Index&quot;).
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
              Catalogue Narrative / Intro Sub-copy
            </label>
            <textarea
              rows={3}
              value={homeSubheading}
              onChange={(e) => setHomeSubheading(e.target.value)}
              placeholder="A restrained catalogue of exceptional personal technology, industrial design, and daily tools evaluated for enduring utility and craftsmanship."
              className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm leading-relaxed focus:bg-white"
            />
            <span className="text-[11px] text-luxury-subtle mt-1 block">
              Editorial paragraph displayed on the right side of the homepage header.
            </span>
          </div>
        </section>

        {/* Section 3: Contact & Social */}
        <section className="bg-white border border-luxury-border p-6 sm:p-8 space-y-6">
          <div className="border-b border-luxury-border/60 pb-3">
            <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent">
              3. Contact &amp; Social Links
            </span>
            <span className="text-[11px] text-luxury-subtle font-mono block mt-0.5">
              Only configured fields will render publicly. Empty fields stay hidden.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                Instagram URL (Optional)
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://www.instagram.com/yourhandle"
                className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm font-mono focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                Instagram Handle (Optional)
              </label>
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="yourhandle"
                className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm font-mono focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                Contact Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@yourjournal.com"
                className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm font-mono focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm font-mono focus:bg-white"
              />
            </div>
          </div>
        </section>

        {/* Section 4: About Page Copy & Subtitle */}
        <section className="bg-white border border-luxury-border p-6 sm:p-8 space-y-6">
          <div className="border-b border-luxury-border/60 pb-3">
            <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent">
              4. About Page Narrative &amp; Subtitle
            </span>
          </div>

          {/* Subtitle below About [Name] */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
              About Page Header Subtitle
            </label>
            <input
              type="text"
              value={aboutSubtitle}
              onChange={(e) => setAboutSubtitle(e.target.value)}
              placeholder="On the curation of objects that endure."
              className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm font-mono focus:bg-white"
            />
            <span className="text-[11px] text-luxury-subtle mt-1 block">
              Displayed directly under "About {brandName}" on the <Link href="/about" target="_blank" className="underline text-luxury-text">/about</Link> page.
            </span>
          </div>

          {/* Main About narrative */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
              About Page Main Editorial Body
            </label>
            <textarea
              rows={7}
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm leading-relaxed focus:bg-white"
            />
          </div>
        </section>

        {/* Section 5: Curatorial Principles */}
        <section className="bg-white border border-luxury-border p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-luxury-border/60 pb-3">
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent">
                5. Curatorial Principles (Customizable)
              </span>
              <p className="text-xs text-luxury-muted mt-0.5">
                The core tenets displayed under the "Curatorial Principles" heading on the About page.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddPrinciple}
              className="self-start sm:self-auto px-3 py-1.5 border border-luxury-border bg-[#FAF9F6] hover:bg-white text-xs font-mono text-luxury-text transition-colors"
            >
              + Add Principle
            </button>
          </div>

          <div className="space-y-6">
            {curatorialPrinciples.map((principle, index) => (
              <div key={index} className="p-4 sm:p-5 border border-luxury-border/80 bg-[#FAF9F6] relative space-y-4">
                <div className="flex items-center justify-between border-b border-luxury-border/40 pb-2">
                  <span className="text-[11px] uppercase tracking-wider font-mono text-luxury-accent font-medium">
                    Principle 0{index + 1}
                  </span>
                  {curatorialPrinciples.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePrinciple(index)}
                      className="text-[11px] font-mono text-red-600 hover:text-red-800 underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-luxury-text mb-1">
                    Principle Title
                  </label>
                  <input
                    type="text"
                    required
                    value={principle.title}
                    onChange={(e) => handlePrincipleChange(index, 'title', e.target.value)}
                    placeholder="e.g. Material & Build Integrity"
                    className="w-full px-3 py-2 border border-luxury-border bg-white text-luxury-text text-sm font-medium focus:outline-none focus:ring-1 focus:ring-luxury-accent"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-luxury-text mb-1">
                    Principle Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={principle.description}
                    onChange={(e) => handlePrincipleChange(index, 'description', e.target.value)}
                    placeholder="Explain the testing standard or curatorial standard for this principle..."
                    className="w-full px-3 py-2 border border-luxury-border bg-white text-luxury-text text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-luxury-accent"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Affiliate & Transparency Disclosures */}
        <section className="bg-white border border-luxury-border p-6 sm:p-8 space-y-4">
          <div className="border-b border-luxury-border/60 pb-3">
            <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent">
              6. Affiliate Transparency Disclosure
            </span>
          </div>

          <p className="text-xs text-luxury-muted">
            Displayed on every individual product article and in the global footer.
          </p>

          <textarea
            rows={3}
            value={affiliateDisclosure}
            onChange={(e) => setAffiliateDisclosure(e.target.value)}
            className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm leading-relaxed focus:bg-white"
          />
        </section>

        {/* Section 7: Google AdSense (Optional & Controlled) */}
        <section className="bg-white border border-luxury-border p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-luxury-border/60 pb-3">
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent">
                7. Google AdSense (Optional Monetisation)
              </span>
              <p className="text-xs text-luxury-muted mt-0.5">
                Renders strictly at the bottom of the catalogue page only. Zero ads inside articles. Zero empty boxes if disabled.
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-mono text-xs">
              <input
                type="checkbox"
                checked={adsenseEnabled}
                onChange={(e) => setAdsenseEnabled(e.target.checked)}
                className="w-4 h-4 text-luxury-black border-luxury-border rounded focus:ring-0"
              />
              <span className="text-luxury-text">Enable AdSense</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                AdSense Publisher / Client ID
              </label>
              <input
                type="text"
                value={adsenseClientId}
                onChange={(e) => setAdsenseClientId(e.target.value)}
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm font-mono focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                Ad Unit / Slot ID
              </label>
              <input
                type="text"
                value={adsenseSlotId}
                onChange={(e) => setAdsenseSlotId(e.target.value)}
                placeholder="XXXXXXXXXX"
                className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm font-mono focus:bg-white"
              />
            </div>
          </div>
        </section>

        {/* Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-luxury-border">
          <span className="text-xs font-mono text-luxury-subtle">
            Changes will apply immediately across all pages.
          </span>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-10 py-3.5 bg-luxury-black text-white hover:bg-luxury-accent text-xs uppercase tracking-widest font-mono transition-colors shadow-sm"
          >
            {saving ? 'Saving...' : 'Save Site Settings'}
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-luxury-card border border-luxury-border max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="border-b border-luxury-border/60 pb-3">
              <span className="text-[10px] uppercase tracking-widest font-mono text-luxury-accent block mb-1">
                Confirmation Required
              </span>
              <h3 className="font-editorial-serif text-2xl text-luxury-text font-normal">
                Update Site Settings?
              </h3>
            </div>

            <div className="space-y-3 text-xs text-luxury-muted leading-relaxed">
              <p>
                Are you sure you want to save these changes to your brand settings, About page subtitle, and Curatorial Principles?
              </p>
              <div className="p-3 bg-[#FAF9F6] dark:bg-luxury-highlight border border-luxury-border/60 font-mono text-[11px] space-y-1">
                <div><strong>Brand Name:</strong> {brandName || 'Not set'}</div>
                <div><strong>Nav Descriptor:</strong> {navSubtitle || 'Default'}</div>
                <div><strong>Catalogue Heading:</strong> {homeHeading || 'The Product Index'}</div>
                <div><strong>About Subtitle:</strong> {aboutSubtitle ? aboutSubtitle.slice(0, 35) + '...' : 'Default'}</div>
                <div><strong>Principles:</strong> {curatorialPrinciples.length} items configured</div>
              </div>
              <p className="text-[11px] text-luxury-subtle">
                Once confirmed, your site settings will be saved and the page will refresh with the updated configuration.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-luxury-border/40 font-mono text-xs">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={saving}
                className="px-4 py-2.5 border border-luxury-border text-luxury-muted hover:text-luxury-text hover:bg-luxury-highlight transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                disabled={saving}
                className="px-6 py-2.5 bg-luxury-black text-white hover:bg-luxury-accent uppercase tracking-wider transition-colors shadow-sm"
              >
                {saving ? 'Updating...' : 'Confirm & Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
