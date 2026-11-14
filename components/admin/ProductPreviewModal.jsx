'use client'

import { useState } from 'react'
import ContainImage from '@/components/product/ContainImage'
import StarRating from '@/components/product/StarRating'
import MyTakeBlock from '@/components/article/MyTakeBlock'
import ProductVideoBlock from '@/components/article/ProductVideoBlock'
import AffiliateNotice from '@/components/article/AffiliateNotice'

export default function ProductPreviewModal({ isOpen, onClose, productData, currencySymbol = '₹' }) {
  const [activeTab, setActiveTab] = useState('card') // 'card' or 'article'

  if (!isOpen) return null

  const {
    title = 'Untitled Editorial Object',
    description = 'No description provided.',
    price = 0,
    rating = 5,
    my_take = '',
    video_url = '',
    image_path = '',
    affiliate_url = '#',
    article_number = 1009
  } = productData

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(price || 0)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-luxury-bg border border-luxury-border w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-luxury-border bg-luxury-card">
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent">
              Editorial Preview
            </span>
            <div className="flex border border-luxury-border">
              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`px-3 py-1 text-xs font-mono transition-colors ${
                  activeTab === 'card'
                    ? 'bg-luxury-black text-white dark:bg-luxury-frame dark:border dark:border-luxury-accent/60 dark:text-luxury-text'
                    : 'bg-luxury-card text-luxury-muted hover:text-luxury-text'
                }`}
              >
                Catalogue Card
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('article')}
                className={`px-3 py-1 text-xs font-mono transition-colors ${
                  activeTab === 'article'
                    ? 'bg-luxury-black text-white dark:bg-luxury-frame dark:border dark:border-luxury-accent/60 dark:text-luxury-text'
                    : 'bg-luxury-card text-luxury-muted hover:text-luxury-text'
                }`}
              >
                Full Article View
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-luxury-muted hover:text-luxury-text font-mono text-sm px-2 py-1"
          >
            Close ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10">
          {activeTab === 'card' ? (
            <div className="max-w-xs mx-auto">
              <p className="text-xs font-mono text-luxury-subtle uppercase tracking-wider text-center mb-4">
                Previewing Card in Responsive Grid:
              </p>
              <div className="bg-luxury-card border border-luxury-border/80">
                <div className="relative aspect-[4/5] w-full border-b border-luxury-border/40 overflow-hidden bg-[#F6F3EC]">
                  <ContainImage src={image_path} alt={title} />
                </div>
                <div className="p-4 flex flex-col justify-between min-h-[105px]">
                  <h3 className="font-editorial-serif text-base font-normal text-luxury-text line-clamp-2 leading-snug">
                    {title}
                  </h3>
                  <div className="mt-3 pt-3 border-t border-luxury-border/30 flex items-baseline justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-wider text-luxury-subtle font-mono">
                        Historical Price
                      </span>
                      <span className="text-sm font-medium text-luxury-text font-mono mt-0.5">
                        {currencySymbol} {formattedPrice}
                      </span>
                    </div>
                    <StarRating rating={rating} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Top Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pb-8 border-b border-luxury-border/60">
                <div className="aspect-[4/5] w-full border border-luxury-border/60 bg-[#F6F3EC]">
                  <ContainImage src={image_path} alt={title} />
                </div>
                <div className="space-y-4">
                  <div className="text-xs uppercase tracking-widest text-luxury-accent font-mono border-b border-luxury-border/40 pb-2">
                    Article No. {article_number} &middot; Draft Preview
                  </div>
                  <h1 className="font-editorial-serif text-2xl sm:text-3xl font-normal text-luxury-text">
                    {title}
                  </h1>
                  <StarRating rating={rating} size="lg" />
                  <div className="bg-luxury-card p-4 border border-luxury-border/60">
                    <span className="text-[10px] uppercase tracking-widest text-luxury-subtle font-mono block">
                      Historical Reference Price
                    </span>
                    <span className="font-editorial-serif text-2xl text-luxury-text">
                      {currencySymbol} {formattedPrice}
                    </span>
                  </div>
                  <div className="w-full py-3 bg-luxury-black text-white text-center text-xs uppercase tracking-widest font-mono">
                    View at Retailer &rarr;
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-stone text-luxury-text text-base leading-relaxed space-y-4">
                {description.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* My Take */}
              <MyTakeBlock take={my_take} />

              {/* Video Preview */}
              <ProductVideoBlock videoUrl={video_url} />

              {/* Disclosures */}
              <AffiliateNotice />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-luxury-border bg-luxury-card flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-luxury-black text-white text-xs uppercase tracking-wider font-mono hover:bg-luxury-accent transition-colors"
          >
            Back to Editing
          </button>
        </div>
      </div>
    </div>
  )
}
