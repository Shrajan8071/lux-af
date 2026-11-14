'use client'

import { useState } from 'react'
import ProductVideoBlock from '@/components/article/ProductVideoBlock'

export default function BlogPreviewModal({ isOpen, onClose, blogData = {} }) {
  const [deviceMode, setDeviceMode] = useState('desktop') // 'desktop' | 'mobile'

  if (!isOpen) return null

  const {
    title = 'Untitled Editorial Dispatch',
    excerpt = '',
    content = '',
    image_path = '',
    video_url = '',
    external_link = '',
    external_link_label = 'Reference Resource'
  } = blogData

  const paragraphs = content ? content.split(/\n\s*\n/).filter(Boolean) : []
  const wordCount = content ? content.trim().split(/\s+/).length : 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))
  const displayDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-luxury-bg border border-luxury-border w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-luxury-border bg-luxury-card">
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent">
              Blog Post Preview
            </span>
            <div className="hidden sm:flex border border-luxury-border">
              <button
                type="button"
                onClick={() => setDeviceMode('desktop')}
                className={`px-3 py-1 text-xs font-mono transition-colors ${
                  deviceMode === 'desktop'
                    ? 'bg-luxury-black text-white dark:bg-luxury-frame dark:border dark:border-luxury-accent/60 dark:text-luxury-text'
                    : 'bg-luxury-card text-luxury-muted hover:text-luxury-text'
                }`}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode('mobile')}
                className={`px-3 py-1 text-xs font-mono transition-colors ${
                  deviceMode === 'mobile'
                    ? 'bg-luxury-black text-white dark:bg-luxury-frame dark:border dark:border-luxury-accent/60 dark:text-luxury-text'
                    : 'bg-luxury-card text-luxury-muted hover:text-luxury-text'
                }`}
              >
                Mobile View
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-luxury-muted hover:text-luxury-text font-mono text-xs px-2.5 py-1 border border-luxury-border hover:border-luxury-accent"
          >
            ✕ Close
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-luxury-bg">
          <div className={`mx-auto transition-all ${deviceMode === 'mobile' ? 'max-w-sm border border-luxury-border p-5 bg-luxury-card shadow-lg' : 'max-w-2xl'}`}>
            
            {/* Meta Header */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-[11px] font-mono text-luxury-accent uppercase tracking-wider">
                <span>Editorial Dispatch</span>
                <span>&middot;</span>
                <span>{displayDate}</span>
                <span>&middot;</span>
                <span>{readingTime} min read</span>
              </div>

              <h1 className="font-editorial-serif text-2xl sm:text-4xl text-luxury-text font-normal leading-tight">
                {title}
              </h1>

              {excerpt && (
                <p className="text-sm sm:text-base text-luxury-muted font-light leading-relaxed italic font-editorial-serif">
                  {excerpt}
                </p>
              )}
            </div>

            {/* Optional Cover Photo */}
            {image_path && (
              <div className="my-8 aspect-[16/9] w-full border border-luxury-border/60 overflow-hidden bg-luxury-frame">
                <img
                  src={image_path}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Body Content */}
            <div className="prose prose-stone dark:prose-invert text-luxury-text text-sm sm:text-base leading-relaxed space-y-5 pt-2">
              {paragraphs.map((p, idx) => (
                <p key={idx} className="font-light">
                  {p}
                </p>
              ))}
            </div>

            {/* Optional Video Embed */}
            {video_url && (
              <div className="mt-10 pt-8 border-t border-luxury-border/40">
                <ProductVideoBlock videoUrl={video_url} />
              </div>
            )}

            {/* Optional Outbound Reference Link */}
            {external_link && (
              <div className="mt-10 p-5 bg-luxury-card border border-luxury-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-mono text-luxury-accent block mb-1">
                    External Resource
                  </span>
                  <p className="text-xs text-luxury-text font-mono truncate max-w-sm">
                    {external_link}
                  </p>
                </div>
                <a
                  href={external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 bg-luxury-black text-white hover:bg-luxury-accent text-xs font-mono uppercase tracking-wider transition-colors shrink-0"
                >
                  <span>{external_link_label || 'Visit Resource'} &rarr;</span>
                </a>
              </div>
            )}

          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3 border-t border-luxury-border bg-luxury-card flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-luxury-black text-white text-xs uppercase tracking-wider font-mono hover:bg-luxury-accent transition-colors shadow-sm"
          >
            Back to Editor
          </button>
        </div>

      </div>
    </div>
  )
}
