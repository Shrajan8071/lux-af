import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getPublishedBlogs, getSiteSettings } from '@/lib/supabase/data'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function generateMetadata() {
  const settings = await getSiteSettings()
  const brandName = settings.brand_name || 'MAISON & OBJECT'

  return {
    title: `Journal & Editorial Dispatches | ${brandName}`,
    description: 'Long-form essays, hardware reflections, and philosophical field notes on enduring materials and industrial craft.',
    openGraph: {
      title: `Journal & Editorial Dispatches | ${brandName}`,
      description: 'Long-form essays, hardware reflections, and philosophical field notes on enduring materials and industrial craft.',
      type: 'website',
    }
  }
}

export default async function BlogsPage() {
  const [blogs, settings] = await Promise.all([
    getPublishedBlogs(),
    getSiteSettings()
  ])

  return (
    <>
      <Header settings={settings} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1 w-full space-y-12 sm:space-y-16">
        
        {/* Editorial Section Masthead */}
        <section className="max-w-3xl space-y-4 border-b border-luxury-border/60 pb-8 sm:pb-12">
          <div className="flex items-center gap-3">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-mono text-luxury-accent">
              Editorial Dispatches &amp; Essays
            </span>
            <span className="text-luxury-border">&middot;</span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-mono text-luxury-subtle">
              {blogs.length} {blogs.length === 1 ? 'Dispatch' : 'Dispatches'}
            </span>
          </div>

          <h1 className="font-editorial-serif text-3xl sm:text-5xl text-luxury-text font-normal tracking-tight">
            The Journal
          </h1>

          <p className="text-sm sm:text-base text-luxury-muted font-light leading-relaxed max-w-2xl">
            A restrained collection of independent essays, tactile field notes, and architectural studies exploring material honesty, acoustics, and the craft of enduring personal technology.
          </p>
        </section>

        {/* Blogs Feed / Cards */}
        {blogs.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <p className="font-editorial-serif text-2xl text-luxury-text">No dispatches published yet</p>
            <p className="text-xs text-luxury-muted max-w-md mx-auto">
              Our inaugural essays are currently in preparation. Check back soon or browse the product catalogue.
            </p>
            <Link
              href="/"
              className="inline-block mt-4 px-6 py-3 bg-luxury-black text-white hover:bg-luxury-accent text-xs font-mono uppercase tracking-widest transition-colors shadow-sm"
            >
              Browse Catalogue &rarr;
            </Link>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {blogs.map((blog) => {
              const displayDate = new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })

              const wordCount = blog.content ? blog.content.trim().split(/\s+/).length : 0
              const readingTime = Math.max(1, Math.ceil(wordCount / 200))

              return (
                <article
                  key={blog.id || blog.slug}
                  className="group flex flex-col justify-between bg-luxury-card border border-luxury-border/70 hover:border-luxury-accent/60 transition-colors duration-200 overflow-hidden shadow-sm"
                >
                  <Link href={`/blogs/${blog.slug}`} className="block">
                    {/* Optional Image */}
                    {blog.image_path ? (
                      <div className="aspect-[16/10] w-full bg-luxury-frame overflow-hidden border-b border-luxury-border/40">
                        <img
                          src={blog.image_path}
                          alt={blog.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] w-full bg-luxury-frame flex flex-col items-center justify-center p-6 text-center border-b border-luxury-border/40">
                        <span className="font-editorial-serif italic text-lg text-luxury-accent">
                          Editorial Essay
                        </span>
                        <span className="text-[10px] tracking-widest uppercase mt-1 font-mono text-luxury-subtle">
                          Field Observation
                        </span>
                      </div>
                    )}

                    <div className="p-5 sm:p-6 space-y-3">
                      {/* Meta badges */}
                      <div className="flex items-center gap-2 text-[10px] font-mono text-luxury-subtle uppercase tracking-wider">
                        <time dateTime={blog.published_at || blog.created_at}>{displayDate}</time>
                        <span>&middot;</span>
                        <span>{readingTime} min read</span>
                        {blog.video_url && (
                          <>
                            <span>&middot;</span>
                            <span className="text-luxury-accent">▶ Video</span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="font-editorial-serif text-xl sm:text-2xl text-luxury-text font-normal leading-snug group-hover:text-luxury-accent transition-colors line-clamp-2">
                        {blog.title}
                      </h2>

                      {/* Excerpt */}
                      {blog.excerpt && (
                        <p className="text-xs sm:text-sm text-luxury-muted font-light leading-relaxed line-clamp-3">
                          {blog.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>

                  {/* Read Link */}
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2 border-t border-luxury-border/30 flex items-center justify-between text-xs font-mono">
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="text-luxury-text group-hover:text-luxury-accent font-medium inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Read Dispatch</span>
                      <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </Link>

                    {blog.external_link && (
                      <span className="text-[10px] text-luxury-subtle font-mono">
                        ↗ Has Reference
                      </span>
                    )}
                  </div>
                </article>
              )
            })}
          </section>
        )}

      </main>

      <Footer settings={settings} />
    </>
  )
}
