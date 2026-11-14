import Link from 'next/link'
import { getAnalyticsSummary, getAllProductsAdmin } from '@/lib/supabase/data'

export const dynamic = 'force-dynamic'

export default async function AdminOverviewPage({ searchParams }) {
  const range = searchParams?.range || '30d'
  const [analytics, allProducts] = await Promise.all([
    getAnalyticsSummary(range),
    getAllProductsAdmin()
  ])

  const { metrics, funnel, productClicksMap, productViewsMap } = analytics

  // Map product views and clicks to actual product titles
  const productsWithStats = allProducts.map((p) => ({
    ...p,
    views: productViewsMap[p.id] || 0,
    clicks: productClicksMap[p.id] || 0,
  }))

  const topViewed = [...productsWithStats]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)

  const topClicked = [...productsWithStats]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)

  return (
    <div className="space-y-10">
      
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-luxury-border/80 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-mono text-luxury-accent block mb-1">
            Performance &amp; Engagement
          </span>
          <h1 className="font-editorial-serif text-3xl sm:text-4xl text-luxury-text font-normal">
            Analytics Overview
          </h1>
          <p className="text-xs text-luxury-muted mt-1">
            On-site visitor activity and outbound affiliate engagement. Not connected to retailer purchase data.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-1 border border-luxury-border bg-white dark:bg-luxury-card p-1">
          {['7d', '30d', 'all'].map((r) => (
            <Link
              key={r}
              href={`/admin?range=${r}`}
              className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-colors ${
                range === r
                  ? 'bg-luxury-black text-white dark:bg-luxury-frame dark:border dark:border-luxury-accent/60 dark:text-luxury-text'
                  : 'text-luxury-muted hover:text-luxury-text hover:bg-[#F6F4F0] dark:hover:bg-luxury-highlight'
              }`}
            >
              {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : 'All Time'}
            </Link>
          ))}
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        <div className="bg-white border border-luxury-border p-5">
          <span className="text-[10px] uppercase tracking-wider font-mono text-luxury-subtle block">
            Total Page Views
          </span>
          <p className="font-editorial-serif text-3xl sm:text-4xl text-luxury-text mt-2">
            {metrics.pageViews}
          </p>
          <span className="text-[10px] text-luxury-muted font-mono mt-1 block">
            Catalogue &amp; Articles
          </span>
        </div>

        <div className="bg-white border border-luxury-border p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-mono text-luxury-subtle block">
              Estimated Visitors
            </span>
          </div>
          <p className="font-editorial-serif text-3xl sm:text-4xl text-luxury-text mt-2">
            {metrics.uniqueVisitorsEstimate}
          </p>
          <span className="text-[10px] text-luxury-accent font-mono mt-1 block">
            *Est. First-Party Sessions
          </span>
        </div>

        <div className="bg-white border border-luxury-border p-5">
          <span className="text-[10px] uppercase tracking-wider font-mono text-luxury-subtle block">
            Product Article Views
          </span>
          <p className="font-editorial-serif text-3xl sm:text-4xl text-luxury-text mt-2">
            {metrics.productViews}
          </p>
          <span className="text-[10px] text-luxury-muted font-mono mt-1 block">
            Deep Reads
          </span>
        </div>

        <div className="bg-white border border-luxury-border p-5">
          <span className="text-[10px] uppercase tracking-wider font-mono text-luxury-subtle block">
            Card Clicks
          </span>
          <p className="font-editorial-serif text-3xl sm:text-4xl text-luxury-text mt-2">
            {metrics.cardClicks}
          </p>
          <span className="text-[10px] text-luxury-muted font-mono mt-1 block">
            From Catalogue
          </span>
        </div>

        <div className="col-span-2 md:col-span-1 bg-white border border-luxury-border p-5 border-l-2 border-l-luxury-accent">
          <span className="text-[10px] uppercase tracking-wider font-mono text-luxury-accent block font-medium">
            Affiliate Outbound Clicks
          </span>
          <p className="font-editorial-serif text-3xl sm:text-4xl text-luxury-text mt-2">
            {metrics.affiliateClicks}
          </p>
          <span className="text-[10px] text-luxury-muted font-mono mt-1 block">
            Retailer Redirects
          </span>
        </div>
      </div>

      {/* On-Site Engagement Funnel */}
      <section className="bg-white border border-luxury-border p-6 sm:p-8">
        <div className="border-b border-luxury-border/60 pb-4 mb-6">
          <span className="text-[10px] uppercase tracking-widest font-mono text-luxury-accent block mb-1">
            Conversion Flow
          </span>
          <h2 className="font-editorial-serif text-xl sm:text-2xl text-luxury-text font-normal">
            On-Site Engagement Funnel
          </h2>
          <p className="text-xs text-luxury-muted mt-1">
            Measures visitor movement from discovery to outbound merchant interest. Not a retailer sales funnel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          
          <div className="p-4 bg-[#FAF9F6] border border-luxury-border/60">
            <span className="text-xs uppercase font-mono tracking-widest text-luxury-subtle">
              Step 1: Catalogue Visit
            </span>
            <p className="font-editorial-serif text-3xl text-luxury-text my-2">
              {funnel.visits}
            </p>
            <span className="text-[11px] text-luxury-muted font-mono">
              100% of session entries
            </span>
          </div>

          <div className="p-4 bg-[#FAF9F6] border border-luxury-border/60 relative">
            <span className="text-xs uppercase font-mono tracking-widest text-luxury-subtle">
              Step 2: Article Read
            </span>
            <p className="font-editorial-serif text-3xl text-luxury-text my-2">
              {funnel.views}
            </p>
            <span className="text-[11px] text-luxury-accent font-mono">
              {funnel.conversionToArticle}% of visits read an article
            </span>
          </div>

          <div className="p-4 bg-[#FAF9F6] border border-luxury-border/60">
            <span className="text-xs uppercase font-mono tracking-widest text-luxury-subtle">
              Step 3: Affiliate Click
            </span>
            <p className="font-editorial-serif text-3xl text-luxury-text my-2">
              {funnel.clicks}
            </p>
            <span className="text-[11px] text-luxury-accent font-mono font-medium">
              {funnel.conversionToAffiliate}% of readers clicked outbound
            </span>
          </div>
        </div>
      </section>

      {/* Top Products Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Most Viewed Products */}
        <section className="bg-white border border-luxury-border p-6">
          <div className="border-b border-luxury-border/60 pb-3 mb-4 flex items-center justify-between">
            <h3 className="font-editorial-serif text-lg text-luxury-text">
              Most Viewed Articles
            </h3>
            <span className="text-[10px] font-mono uppercase text-luxury-subtle">
              Total Reads
            </span>
          </div>

          {topViewed.length === 0 ? (
            <p className="text-xs text-luxury-muted py-6 text-center font-mono">No article views recorded yet.</p>
          ) : (
            <div className="divide-y divide-luxury-border/40">
              {topViewed.map((prod) => (
                <div key={prod.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/products/${prod.id}`}
                      className="text-xs sm:text-sm text-luxury-text hover:text-luxury-accent truncate block font-medium"
                    >
                      {prod.title}
                    </Link>
                    <span className="text-[10px] font-mono text-luxury-subtle">
                      No. {prod.article_number} &middot; {prod.status}
                    </span>
                  </div>
                  <span className="font-mono text-sm font-medium text-luxury-text shrink-0">
                    {prod.views} views
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Most Clicked Products */}
        <section className="bg-white border border-luxury-border p-6">
          <div className="border-b border-luxury-border/60 pb-3 mb-4 flex items-center justify-between">
            <h3 className="font-editorial-serif text-lg text-luxury-text">
              Top Outbound Affiliate Clicks
            </h3>
            <span className="text-[10px] font-mono uppercase text-luxury-subtle">
              Merchant Clicks
            </span>
          </div>

          {topClicked.length === 0 ? (
            <p className="text-xs text-luxury-muted py-6 text-center font-mono">No outbound clicks recorded yet.</p>
          ) : (
            <div className="divide-y divide-luxury-border/40">
              {topClicked.map((prod) => (
                <div key={prod.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/products/${prod.id}`}
                      className="text-xs sm:text-sm text-luxury-text hover:text-luxury-accent truncate block font-medium"
                    >
                      {prod.title}
                    </Link>
                    <span className="text-[10px] font-mono text-luxury-subtle">
                      No. {prod.article_number} &middot; {prod.status}
                    </span>
                  </div>
                  <span className="font-mono text-sm font-medium text-luxury-accent shrink-0">
                    {prod.clicks} clicks
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Quick Actions Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-luxury-border/60">
        <Link
          href="/admin/products/new"
          className="px-6 py-3 bg-luxury-black text-white text-xs uppercase tracking-widest font-mono hover:bg-luxury-accent transition-colors"
        >
          + Draft New Editorial Object
        </Link>
        <Link
          href="/admin/products"
          className="text-xs text-luxury-muted hover:text-luxury-text font-mono underline underline-offset-4"
        >
          Manage All Catalogue Objects ({allProducts.length}) &rarr;
        </Link>
      </div>
    </div>
  )
}
