import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ContainImage from '@/components/product/ContainImage'
import StarRating from '@/components/product/StarRating'
import MyTakeBlock from '@/components/article/MyTakeBlock'
import ProductVideoBlock from '@/components/article/ProductVideoBlock'
import AffiliateNotice from '@/components/article/AffiliateNotice'
import PageViewTracker from '@/components/analytics/PageViewTracker'
import { getProductByArticleNumber, getSiteSettings } from '@/lib/supabase/data'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const product = await getProductByArticleNumber(params.articleNumber)
  const settings = await getSiteSettings()

  if (!product) {
    return {
      title: 'Object Not Found',
    }
  }

  const brandName = settings.brand_name || 'MAISON & OBJECT'

  return {
    title: `${product.title} (No. ${product.article_number})`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.title} — ${brandName}`,
      description: product.description.slice(0, 160),
      images: [
        {
          url: product.image_path,
          alt: product.title,
        },
      ],
    },
  }
}

export default async function ArticlePage({ params }) {
  const { articleNumber } = params
  const [product, settings] = await Promise.all([
    getProductByArticleNumber(articleNumber),
    getSiteSettings()
  ])

  if (!product) {
    redirect('/')
  }

  const {
    id,
    article_number,
    title,
    description,
    price,
    currency,
    rating,
    my_take,
    image_path,
    video_url,
    published_at,
    created_at
  } = product

  const currencySymbol = settings.currency_symbol || (currency === 'INR' ? '₹' : currency)
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(price)

  const publishDate = new Date(published_at || created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  // Format description paragraphs cleanly
  const paragraphs = description.split('\n\n').filter(p => p.trim().length > 0)

  return (
    <>
      <PageViewTracker eventType="product_view" productId={id} />
      <Header settings={settings} />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        {/* Breadcrumb / Back Link */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-luxury-muted hover:text-luxury-text transition-colors font-mono"
          >
            <span aria-hidden="true">&larr;</span>
            <span>Return to Catalogue</span>
          </Link>
        </nav>

        {/* Top Editorial Section: Desktop side-by-side, Mobile stacked image first */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-start pb-14 border-b border-luxury-border/60">
          
          {/* Product Image Frame (Contain, no cropping) */}
          <div className="md:col-span-6 w-full">
            <div className="relative aspect-square sm:aspect-[4/5] w-full border border-luxury-border/60 bg-luxury-frame">
              <ContainImage
                src={image_path}
                alt={title}
                priority={true}
              />
            </div>
            <p className="mt-2 text-[10px] uppercase tracking-widest text-luxury-subtle font-mono text-center">
              Authentic Product Photography
            </p>
          </div>

          {/* Product Metadata & Acquisition Details */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-6 pt-2">
            <div>
              {/* Article Number & Publication Date */}
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-luxury-accent font-mono border-b border-luxury-border/40 pb-3 mb-4">
                <span>Article No. {article_number}</span>
                <time dateTime={published_at || created_at} className="text-luxury-subtle">
                  {publishDate}
                </time>
              </div>

              {/* Title */}
              <h1 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-luxury-text leading-[1.15] mb-5">
                {title}
              </h1>

              {/* Rating */}
              <div className="mb-6 flex items-center gap-3">
                <StarRating rating={rating} size="lg" />
                <span className="text-xs text-luxury-subtle font-mono">
                  (Editorial Score)
                </span>
              </div>

              {/* Historical Price */}
              <div className="bg-luxury-card p-4 sm:p-5 border border-luxury-border/60 mb-8">
                <span className="text-[10px] uppercase tracking-widest text-luxury-subtle font-mono block">
                  Observed Acquisition Price
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-editorial-serif text-3xl sm:text-4xl text-luxury-text font-normal">
                    {currencySymbol} {formattedPrice}
                  </span>
                  <span className="text-xs text-luxury-muted font-mono">
                    {currency} (Historical Reference)
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-luxury-muted leading-relaxed">
                  Recorded at the time of editorial documentation. Live merchant pricing may vary based on retailer updates or currency rates.
                </p>
              </div>
            </div>

            {/* Outbound Affiliate Purchase Action */}
            <div>
              <a
                href={`/api/out/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center px-8 py-4 bg-luxury-black text-white hover:bg-luxury-accent transition-colors duration-200 text-xs sm:text-sm uppercase tracking-widest font-mono text-center group shadow-sm"
              >
                <span>View at Retailer</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true">&rarr;</span>
              </a>
              <span className="block mt-2 text-[10px] text-luxury-subtle text-center font-mono uppercase tracking-wider">
                External Link &middot; Direct Merchant Redirection
              </span>
            </div>
          </div>
        </section>

        {/* Below Top Section: Editorial Description with comfortable reading width */}
        <section className="pt-12 max-w-3xl">
          <span className="text-[11px] uppercase tracking-widest font-mono text-luxury-accent font-medium block mb-4">
            Editorial Notes &amp; Specifications
          </span>

          <div className="prose prose-stone text-luxury-text leading-relaxed text-base sm:text-lg font-light space-y-6">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="text-luxury-text leading-[1.8]">
                {p}
              </p>
            ))}
          </div>

          {/* Restrained "My Take" Section */}
          <MyTakeBlock take={my_take} />

          {/* Hands-on Video or Reel Section */}
          <ProductVideoBlock videoUrl={video_url} />

          {/* Affiliate & Historical Price Disclosures */}
          <AffiliateNotice customDisclosure={settings.affiliate_disclosure} />
        </section>
      </main>

      <Footer settings={settings} />
    </>
  )
}
