import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductGrid from '@/components/product/ProductGrid'
import AdSenseUnit from '@/components/ads/AdSenseUnit'
import PageViewTracker from '@/components/analytics/PageViewTracker'
import { getPublishedProducts, getSiteSettings } from '@/lib/supabase/data'

export const dynamic = 'force-dynamic'

export default async function CataloguePage() {
  const [products, settings] = await Promise.all([
    getPublishedProducts(),
    getSiteSettings()
  ])

  return (
    <>
      <PageViewTracker eventType="page_view" />
      <Header settings={settings} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        {/* Editorial Sub-header / Issue Identifier */}
        <section className="mb-10 sm:mb-14 border-b border-luxury-border/60 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-mono text-luxury-accent block mb-1">
              {settings.home_badge || 'Curated Hardware · Personal Field Notes'}
            </span>
            <h2 className="font-editorial-serif text-2xl sm:text-4xl text-luxury-text font-normal tracking-tight">
              {settings.home_heading || 'The Product Index'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-luxury-muted max-w-md leading-relaxed">
            {settings.home_subheading || 'A restrained catalogue of exceptional personal technology, industrial design, and daily tools evaluated for enduring utility and craftsmanship.'}
          </p>
        </section>

        {/* The Catalogue Grid */}
        <ProductGrid products={products} currencySymbol={settings.currency_symbol} />

        {/* AdSense Unit (Bottom of catalogue only, conditionally rendered) */}
        <AdSenseUnit
          clientId={settings.adsense_client_id}
          slotId={settings.adsense_slot_id}
          enabled={settings.adsense_enabled}
        />
      </main>

      <Footer settings={settings} />
    </>
  )
}
