import Link from 'next/link'
import { getAnalyticsSummary, getAllProductsAdmin, getAllBlogsAdmin } from '@/lib/supabase/data'

export const dynamic = 'force-dynamic'

export default async function AdminOverviewPage({ searchParams }) {
  const range = searchParams?.range || '30d'
  const [analytics, allProducts, allBlogs] = await Promise.all([
    getAnalyticsSummary(range),
    getAllProductsAdmin(),
    getAllBlogsAdmin()
  ])

  const { metrics, funnel, productClicksMap, productViewsMap, blogViewsMap = {} } = analytics

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

  // Map blog views to blogs
  const blogsWithStats = allBlogs.map((b) => ({
    ...b,
    views: blogViewsMap[b.slug] || 0
  }))

  const topReadBlogs = [...blogsWithStats]
    .sort((a, b) => b.views - a.views)

  const queuedBlogsCount = allBlogs.filter((b) => b.status === 'queued').length

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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-white dark:bg-luxury-card border border-luxury-border dark:border-luxury-border/60 p-5">
          <span className="text-[10px] uppercase tracking-wider font-mono text-luxury-subtle block">
            Total Page Views
          </span>
          <p className="font-editorial-serif text-3xl sm:text-4xl text-luxury-text mt-2">
            {metrics.pageViews}
          </p>
          <span className="text-[10px] text-luxury-muted font-mono mt-1 block">
            Catalogue &amp; Journal
          </span>
        </div>

        <div className="bg-white dark:bg-luxury-card border border-luxury-border dark:border-luxury-border/60 p-5">
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

        <div className="bg-white dark:bg-luxury-card border border-luxury-border dark:border-luxury-border/60 p-5">
          <span className="text-[10px] uppercase tracking-wider font-mono text-luxury-subtle block">
            Product Views
          </span>
          <p className="font-editorial-serif text-3xl sm:text-4xl text-luxury-text mt-2">
            {metrics.productViews}
          </p>
          <span className="text-[10px] text-luxury-muted font-mono mt-1 block">
            Deep Spec Reads
          </span>
        </div>

        <div className="bg-white dark:bg-luxury-card border border-luxury-border dark:border-luxury-border/60 p-5 border-l-2 border-l-purple-500">
          <span className="text-[10px] uppercase tracking-wider font-mono text-purple-600 dark:text-purple-400 block font-medium">
            Journal Reads
          </span>
          <p className="font-editorial-serif text-3xl sm:text-4xl text-luxury-text mt-2">
            {metrics.blogViews || 0}
          </p>
          <span className="text-[10px] text-luxury-muted font-mono mt-1 block">
            Editorial Dispatches
          </span>
        </div>

        <div className="bg-white dark:bg-luxury-card border border-luxury-border dark:border-luxury-border/60 p-5">
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

        <div className="col-span-2 md:col-span-1 bg-white dark:bg-luxury-card border border-luxury-border dark:border-luxury-border/60 p-5 border-l-2 border-l-luxury-accent">
          <span className="text-[10px] uppercase tracking-wider font-mono text-luxury-accent block font-medium">
            Affiliate Clicks
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

      {/* Editorial Journal Performance & Readership */}
      <section className="bg-white dark:bg-luxury-card border border-luxury-border dark:border-luxury-border/60 p-6 sm:p-8">
        <div className="border-b border-luxury-border/60 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-luxury-accent block mb-1">
              Editorial Dispatches &amp; Journal
            </span>
            <h2 className="font-editorial-serif text-xl sm:text-2xl text-luxury-text font-normal">
              Journal Readership &amp; Article Traffic
            </h2>
            <p className="text-xs text-luxury-muted mt-1">
              Deep reads and visitor engagement across published essays and automated queue dispatches.
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin/blogs/queue"
              className="px-3.5 py-2 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-xs font-mono uppercase tracking-wider hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
            >
              ✦ Auto Queue ({queuedBlogsCount})
            </Link>
            <Link
              href="/admin/blogs/new"
              className="px-3.5 py-2 bg-luxury-black text-white dark:bg-white dark:text-luxury-black text-xs font-mono uppercase tracking-wider hover:bg-luxury-accent dark:hover:bg-luxury-accent dark:hover:text-white transition-colors"
            >
              + New Post
            </Link>
          </div>
        </div>

        {allBlogs.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <p className="font-editorial-serif text-lg text-luxury-text">No editorial dispatches found</p>
            <p className="text-xs text-luxury-muted font-mono">Create an essay or ingest a spec sheet into the Auto Queue.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-luxury-border/60 text-[10px] uppercase font-mono tracking-wider text-luxury-subtle">
                  <th className="pb-3 font-normal">Article Dispatch</th>
                  <th className="pb-3 font-normal">Status</th>
                  <th className="pb-3 font-normal">Date</th>
                  <th className="pb-3 font-normal text-right">Reads</th>
                  <th className="pb-3 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-border/40 font-mono">
                {topReadBlogs.map((blog) => {
                  return (
                    <tr key={blog.id} className="hover:bg-luxury-frame/40 transition-colors">
                      <td className="py-3.5 pr-4">
                        <Link
                          href={`/admin/blogs/${blog.id}`}
                          className="font-editorial-serif text-sm font-normal text-luxury-text hover:text-luxury-accent line-clamp-1"
                        >
                          {blog.title}
                        </Link>
                        <span className="text-[10px] text-luxury-muted block font-mono">
                          /blogs/{blog.slug}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-sm ${
                          blog.status === 'published'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50'
                            : blog.status === 'queued'
                            ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50'
                        }`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-[11px] text-luxury-muted whitespace-nowrap">
                        {blog.published_at
                          ? new Date(blog.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        }
                      </td>
                      <td className="py-3.5 pr-4 text-right">
                        <span className={`text-sm font-medium ${blog.views > 0 ? 'text-luxury-accent' : 'text-luxury-muted'}`}>
                          {blog.views}
                        </span>
                        <span className="text-[10px] text-luxury-subtle ml-1">views</span>
                      </td>
                      <td className="py-3.5 text-right whitespace-nowrap space-x-2">
                        {blog.status === 'published' && (
                          <Link
                            href={`/blogs/${blog.slug}`}
                            target="_blank"
                            className="text-[11px] text-luxury-muted hover:text-luxury-text underline"
                          >
                            Live ↗
                          </Link>
                        )}
                        <Link
                          href={`/admin/blogs/${blog.id}`}
                          className="text-[11px] text-luxury-accent hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Quick Actions Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-luxury-border/60">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-6 py-3 bg-luxury-black text-white text-xs uppercase tracking-widest font-mono hover:bg-luxury-accent transition-colors"
          >
            + Draft New Editorial Object
          </Link>
          <Link
            href="/admin/blogs/queue"
            className="px-6 py-3 bg-luxury-frame border border-purple-500/40 text-purple-600 dark:text-purple-400 text-xs uppercase tracking-widest font-mono hover:border-purple-500 transition-colors"
          >
            ✦ Auto Queue Drafter
          </Link>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <Link
            href="/admin/blogs"
            className="text-luxury-muted hover:text-luxury-text underline underline-offset-4"
          >
            Manage Journal ({allBlogs.length}) &rarr;
          </Link>
          <Link
            href="/admin/products"
            className="text-luxury-muted hover:text-luxury-text underline underline-offset-4"
          >
            Manage Catalogue ({allProducts.length}) &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
