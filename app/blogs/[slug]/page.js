import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductVideoBlock from '@/components/article/ProductVideoBlock'
import BlogContentRenderer from '@/components/blog/BlogContentRenderer'
import PageViewTracker from '@/components/analytics/PageViewTracker'
import { getBlogBySlug, getSiteSettings, getPublishedBlogs } from '@/lib/supabase/data'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function generateMetadata({ params }) {
  const { slug } = params
  const [blog, settings] = await Promise.all([
    getBlogBySlug(slug),
    getSiteSettings()
  ])

  if (!blog) {
    return { title: 'Dispatch Not Found' }
  }

  const brandName = settings.brand_name || 'MAISON & OBJECT'

  return {
    title: `${blog.title} | ${brandName}`,
    description: blog.excerpt || blog.content.slice(0, 160),
    openGraph: {
      title: `${blog.title} | ${brandName}`,
      description: blog.excerpt || blog.content.slice(0, 160),
      type: 'article',
      images: blog.image_path ? [{ url: blog.image_path }] : [],
    }
  }
}

export default async function BlogDetailPage({ params }) {
  const { slug } = params
  const [blog, settings, allBlogs] = await Promise.all([
    getBlogBySlug(slug),
    getSiteSettings(),
    getPublishedBlogs()
  ])

  if (!blog) {
    notFound()
  }

  const displayDate = new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  const paragraphs = blog.content ? blog.content.split(/\n\s*\n/).filter(Boolean) : []
  const wordCount = blog.content ? blog.content.trim().split(/\s+/).length : 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))
  const authorName = settings.brand_name || 'Shrajan Gupta'

  // Other dispatches to discover
  const otherDispatches = allBlogs
    .filter(b => (b.slug || b.id) !== (blog.slug || blog.id))
    .slice(0, 2)

  return (
    <>
      <Header settings={settings} />
      <PageViewTracker eventType="page_view" path={`/blogs/${blog.slug}`} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 w-full space-y-10 sm:space-y-12">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs font-mono text-luxury-subtle">
          <Link
            href="/blogs"
            className="hover:text-luxury-text inline-flex items-center gap-1.5 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
            <span>Return to Journal</span>
          </Link>

          <span className="uppercase tracking-widest text-[10px]">
            Editorial Dispatch
          </span>
        </div>

        {/* Masthead Header */}
        <header className="space-y-6 border-b border-luxury-border/60 pb-8 sm:pb-10">
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-luxury-accent uppercase tracking-wider">
            <time dateTime={blog.published_at || blog.created_at}>{displayDate}</time>
            <span>&middot;</span>
            <span>{readingTime} min read</span>
            <span>&middot;</span>
            <span>Documented by {authorName}</span>
          </div>

          <h1 className="font-editorial-serif text-3xl sm:text-5xl md:text-6xl text-luxury-text font-normal leading-[1.15] tracking-tight">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="font-editorial-serif italic text-lg sm:text-2xl text-luxury-muted font-light leading-relaxed max-w-3xl pt-2">
              "{blog.excerpt}"
            </p>
          )}
        </header>

        {/* Optional Cover Photo */}
        {blog.image_path && (
          <div className="my-8 aspect-[16/9] w-full border border-luxury-border/80 overflow-hidden bg-luxury-frame shadow-sm">
            <img
              src={blog.image_path}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Essay Body */}
        <article className="max-w-none text-luxury-text leading-relaxed text-base sm:text-lg font-light pt-4">
          <BlogContentRenderer content={blog.content} />
        </article>

        {/* Optional Video Embed */}
        {blog.video_url && (
          <section className="pt-8 border-t border-luxury-border/60">
            <span className="text-[10px] uppercase tracking-widest font-mono text-luxury-accent block mb-3">
              Field Video &amp; Visual Review
            </span>
            <ProductVideoBlock videoUrl={blog.video_url} />
          </section>
        )}

        {/* Optional Outbound Reference Resource Link */}
        {blog.external_link && (
          <section className="mt-8 p-6 sm:p-8 bg-luxury-card border border-luxury-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-mono text-luxury-accent block">
                External Reference Resource
              </span>
              <h3 className="font-editorial-serif text-lg text-luxury-text font-normal">
                {blog.external_link_label || 'View Reference Documentation'}
              </h3>
              <p className="text-xs text-luxury-muted font-mono truncate max-w-md">
                {blog.external_link}
              </p>
            </div>

            <a
              href={blog.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-luxury-black text-white hover:bg-luxury-accent text-xs font-mono uppercase tracking-widest transition-colors shrink-0 shadow-sm"
            >
              <span>{blog.external_link_label || 'Visit Resource'}</span>
              <span>&rarr;</span>
            </a>
          </section>
        )}

        {/* Author Footnote / Sign-off */}
        <div className="pt-10 border-t border-luxury-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-luxury-muted">
          <div>
            <span className="text-luxury-text font-medium">{authorName}</span> &middot; Independent Research &amp; Field Notes
          </div>
          <Link
            href="/about"
            className="text-luxury-accent hover:text-luxury-text underline underline-offset-4"
          >
            Read Curatorial Principles &rarr;
          </Link>
        </div>

        {/* Further Reading Section */}
        {otherDispatches.length > 0 && (
          <section className="pt-12 border-t border-luxury-border space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent">
                Further Dispatches
              </span>
              <Link href="/blogs" className="text-xs font-mono text-luxury-muted hover:text-luxury-text">
                All Dispatches &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {otherDispatches.map((other) => (
                <Link
                  key={other.slug || other.id}
                  href={`/blogs/${other.slug}`}
                  className="p-5 border border-luxury-border/80 hover:border-luxury-accent bg-luxury-card transition-colors block group"
                >
                  <span className="text-[10px] font-mono text-luxury-subtle uppercase block mb-1">
                    Next Dispatch
                  </span>
                  <h4 className="font-editorial-serif text-lg text-luxury-text group-hover:text-luxury-accent transition-colors">
                    {other.title}
                  </h4>
                  {other.excerpt && (
                    <p className="text-xs text-luxury-muted line-clamp-2 mt-1.5 font-light">
                      {other.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer settings={settings} />
    </>
  )
}
