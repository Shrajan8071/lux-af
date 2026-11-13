import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageViewTracker from '@/components/analytics/PageViewTracker'
import { getSiteSettings } from '@/lib/supabase/data'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const settings = await getSiteSettings()
  const brandName = settings.brand_name || 'MAISON & OBJECT'

  return {
    title: `About the Journal | ${brandName}`,
    description: `Editorial philosophy, object curation principles, and transparency statement for ${brandName}.`,
  }
}

export default async function AboutPage() {
  const settings = await getSiteSettings()
  const brandName = settings.brand_name || 'MAISON & OBJECT'
  const aboutText = settings.about_text || ''
  const aboutSubtitle = settings.about_subtitle || 'On the curation of objects that endure.'
  const affiliateDisclosure = settings.affiliate_disclosure || ''
  
  // Parse dynamic curatorial principles from settings
  let principles = settings.curatorial_principles
  if (typeof principles === 'string') {
    try {
      principles = JSON.parse(principles)
    } catch {
      principles = []
    }
  }
  if (!Array.isArray(principles) || principles.length === 0) {
    principles = [
      {
        title: 'Material Integrity',
        description: 'We prioritize objects constructed from raw, honest materials that age gracefully with daily use.'
      },
      {
        title: 'Restraint Over Trend',
        description: 'We deliberately avoid algorithmic novelty and seasonal trends, focusing on pieces with aesthetic and functional permanence.'
      },
      {
        title: 'Editorial Independence',
        description: 'Products are discovered and documented solely through independent curiosity. We do not accept sponsored reviews or paid product placements.'
      }
    ]
  }

  const paragraphs = aboutText.split('\n\n').filter(p => p.trim().length > 0)

  return (
    <>
      <PageViewTracker eventType="page_view" />
      <Header settings={settings} />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
        {/* Editorial Masthead */}
        <div className="border-b border-luxury-border/60 pb-8 mb-12">
          <span className="text-[11px] uppercase tracking-widest font-mono text-luxury-accent block mb-2">
            Editorial Philosophy
          </span>
          <h1 className="font-editorial-serif text-3xl sm:text-5xl text-luxury-text font-normal tracking-tight">
            About {brandName}
          </h1>
          {aboutSubtitle && (
            <p className="mt-3 text-sm text-luxury-muted font-mono">
              {aboutSubtitle}
            </p>
          )}
        </div>

        {/* Dynamic Editorial Content */}
        <article className="prose prose-stone text-luxury-text leading-relaxed text-base sm:text-lg space-y-6 max-w-2xl">
          {paragraphs.map((p, idx) => (
            <p key={idx} className="text-luxury-text leading-[1.85] font-light">
              {p}
            </p>
          ))}
        </article>

        {/* Curatorial Principles (Dynamic from Settings) */}
        {principles && principles.length > 0 && (
          <section className="mt-16 pt-12 border-t border-luxury-border/60 max-w-2xl">
            <h2 className="font-editorial-serif text-2xl text-luxury-text font-normal mb-6">
              Curatorial Principles
            </h2>
            
            <div className="space-y-6">
              {principles.map((pr, idx) => (
                <div key={idx} className="border-l-2 border-luxury-border pl-4">
                  <h3 className="text-xs uppercase tracking-widest font-mono text-luxury-text font-semibold mb-1">
                    {pr.title}
                  </h3>
                  <p className="text-sm text-luxury-muted leading-relaxed">
                    {pr.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Affiliate Disclosure Statement */}
        <section className="mt-16 pt-10 border-t border-luxury-border/60 max-w-2xl">
          <span className="text-[10px] uppercase tracking-widest font-mono text-luxury-subtle block mb-2">
            Transparency &amp; Affiliate Disclosure
          </span>
          <p className="text-xs text-luxury-muted leading-relaxed">
            {affiliateDisclosure}
          </p>
        </section>
      </main>

      <Footer settings={settings} />
    </>
  )
}
