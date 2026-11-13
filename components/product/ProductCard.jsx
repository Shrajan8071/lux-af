'use client'

import Link from 'next/link'
import ContainImage from './ContainImage'
import StarRating from './StarRating'
import { trackEvent } from '@/lib/analytics'

export default function ProductCard({ product, currencySymbol = '₹' }) {
  const { id, article_number, title, price, currency, rating, image_path } = product

  const handleClick = () => {
    trackEvent({
      eventType: 'product_card_click',
      productId: id,
    })
  }

  // Format historical purchase price
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(price)

  const displayCurrency = currencySymbol || (currency === 'INR' ? '₹' : currency)

  return (
    <Link
      href={`/article/${article_number}`}
      onClick={handleClick}
      className="group flex flex-col justify-between text-left bg-luxury-card border border-luxury-border/60 hover:border-luxury-accent/50 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-luxury-accent h-full"
      aria-label={`${title} - ${displayCurrency} ${formattedPrice}`}
    >
      {/* Consistent Image Frame with contain fit */}
      <div className="relative aspect-[4/5] w-full border-b border-luxury-border/40 overflow-hidden bg-luxury-frame shrink-0">
        <ContainImage
          src={image_path}
          alt={title}
          className="transition-transform duration-300 ease-out group-hover:scale-[1.02]"
        />
      </div>

      {/* Uncluttered Product Information */}
      <div className="p-3 sm:p-5 flex flex-col justify-between flex-1 min-h-[100px]">
        {/* Title */}
        <h3 className="font-editorial-serif text-sm sm:text-base md:text-lg font-normal text-luxury-text line-clamp-2 leading-snug group-hover:text-luxury-accent transition-colors">
          {title}
        </h3>

        {/* Historical Price & Rating Container (Responsive: stacks gracefully on mobile) */}
        <div className="mt-3 pt-2.5 sm:pt-3 border-t border-luxury-border/30 flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between">
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-luxury-subtle font-mono whitespace-nowrap">
              Historical Price
            </span>
            <span className="text-xs sm:text-sm font-medium text-luxury-text font-mono mt-0.5 whitespace-nowrap">
              {displayCurrency}&nbsp;{formattedPrice}
            </span>
          </div>

          <div className="sm:self-end pt-0.5">
            <StarRating rating={rating} />
          </div>
        </div>
      </div>
    </Link>
  )
}
