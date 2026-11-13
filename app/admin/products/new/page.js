'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProductPreviewModal from '@/components/admin/ProductPreviewModal'
import ContainImage from '@/components/product/ContainImage'

export default function NewProductPage() {
  const router = useRouter()

  // Form states
  const [affiliateUrl, setAffiliateUrl] = useState('')
  const [sourceContent, setSourceContent] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('INR')
  const [rating, setRating] = useState('4.8')
  
  // Image upload
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  // AI-generated & editable fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [myTake, setMyTake] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  
  // State indicators
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [aiGeneratedSuccess, setAiGeneratedSuccess] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingStatus, setPendingStatus] = useState('published')
  const [error, setError] = useState(null)
  const [savingStatus, setSavingStatus] = useState(false) // 'draft' | 'published' | false

  // Step 5: Handle Image Selection & Upload
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please upload a valid JPEG, PNG, or WebP image.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.')
      return
    }

    setError(null)
    setImageFile(file)
    setIsUploadingImage(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        setImagePreview(data.imagePath)
      } else {
        setError(data.error || 'Failed to upload image')
      }
    } catch (err) {
      setError('Error uploading image file.')
    } finally {
      setIsUploadingImage(false)
    }
  }

  // Step 6: Trigger Gemini AI Draft Generation
  const handleGenerateAI = async () => {
    if (!sourceContent.trim()) {
      setError('Please paste the source product-page text first.')
      return
    }

    if (title || description || myTake) {
      const confirmOverwrite = window.confirm(
        'Generating a new draft will replace the current title, description, and My Take fields. Proceed?'
      )
      if (!confirmOverwrite) return
    }

    setError(null)
    setIsGeneratingAI(true)

    try {
      const res = await fetch('/api/admin/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceContent,
          rating: parseFloat(rating) || 4.5,
          affiliateUrl
        })
      })

      const data = await res.json()
      if (data.success && data.data) {
        setTitle(data.data.title || '')
        setDescription(data.data.description || '')
        setMyTake(data.data.my_take || '')
        setAiGeneratedSuccess(true)
      } else {
        setError(data.error || 'Failed to generate AI editorial draft.')
      }
    } catch (err) {
      setError('Network error during AI generation.')
    } finally {
      setIsGeneratingAI(false)
    }
  }

  function normalizeUrl(url) {
    if (!url || typeof url !== 'string') return ''
    let trimmed = url.trim()
    if (!trimmed) return ''
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = 'https://' + trimmed
    }
    return trimmed
  }

  // Step 9: Save as Draft or Publish (Opens Confirmation Popup)
  const handleSave = (statusToSet) => {
    setError(null)

    // Validation
    if (!affiliateUrl.trim()) {
      setError('Affiliate Purchase URL is required.')
      return
    }
    if (!title.trim()) {
      setError('Product title is required.')
      return
    }
    if (!description.trim()) {
      setError('Editorial description is required.')
      return
    }
    if (!price || isNaN(parseFloat(price))) {
      setError('A valid historical purchase price is required.')
      return
    }
    if (!imagePreview) {
      setError('Please upload a product image.')
      return
    }

    setPendingStatus(statusToSet)
    setShowConfirmModal(true)
  }

  const handleConfirmSave = async () => {
    setSavingStatus(pendingStatus)
    setError(null)

    const cleanAffiliateUrl = normalizeUrl(affiliateUrl)
    const cleanVideoUrl = videoUrl.trim() ? normalizeUrl(videoUrl) : null

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        currency,
        rating: parseFloat(rating),
        my_take: myTake.trim(),
        affiliate_url: cleanAffiliateUrl,
        image_path: imagePreview,
        source_content: sourceContent.trim(),
        video_url: cleanVideoUrl,
        status: pendingStatus,
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await res.json()
      if (result.success) {
        setShowConfirmModal(false)
        router.push('/admin/products?saved=created')
      } else {
        setShowConfirmModal(false)
        setError(result.error || 'Failed to save product.')
        setSavingStatus(false)
      }
    } catch (err) {
      setShowConfirmModal(false)
      setError('Network error saving product.')
      setSavingStatus(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Page Title & Breadcrumb */}
      <div className="border-b border-luxury-border/80 pb-6">
        <Link
          href="/admin/products"
          className="text-xs font-mono text-luxury-muted hover:text-luxury-text transition-colors mb-2 inline-block"
        >
          &larr; Back to Catalogue Archive
        </Link>
        <span className="text-[10px] uppercase tracking-widest font-mono text-luxury-accent block mt-1">
          Editorial Creation Workflow
        </span>
        <h1 className="font-editorial-serif text-3xl sm:text-4xl text-luxury-text font-normal">
          Draft New Object
        </h1>
        <p className="text-xs text-luxury-muted mt-1">
          Follow the 9-step editorial curation process. Paste source information, generate an honest AI draft, edit, preview, and publish.
        </p>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-900 font-mono flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900 ml-4">✕</button>
        </div>
      )}

      {/* Section 1: Ingestion & Reference Data */}
      <section className="bg-white border border-luxury-border p-5 sm:p-8 space-y-6">
        <div className="border-b border-luxury-border/60 pb-3">
          <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent">
            Step 1 to 4: Source Reference &amp; Metadata
          </span>
        </div>

        {/* 1. Outbound Affiliate URL */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
            1. Affiliate Purchase URL <span className="text-luxury-accent">*</span>
          </label>
          <input
            type="url"
            required
            placeholder="https://retailer.com/product/reference-id?tag=affiliate"
            value={affiliateUrl}
            onChange={(e) => setAffiliateUrl(e.target.value)}
            className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm font-mono focus:bg-white"
          />
          <span className="text-[11px] text-luxury-subtle mt-1 block">
            The outbound destination URL. Visitors will be redirected here when clicking "View at Retailer".
          </span>
        </div>

        {/* 2. Source Content Paste Textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-mono uppercase tracking-wider text-luxury-text">
              2. Pasted Product Page Content <span className="text-luxury-accent">*</span>
            </label>
            <span className="text-[10px] font-mono text-luxury-subtle">
              Copy &amp; paste from retailer/manufacturer
            </span>
          </div>
          <textarea
            rows={6}
            placeholder="Paste raw manufacturer details, materials, dimensions, and specifications here. The Gemini editorial assistant will use this as primary factual reference without scraping."
            value={sourceContent}
            onChange={(e) => setSourceContent(e.target.value)}
            className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-xs leading-relaxed focus:bg-white font-mono"
          />
          <span className="text-[11px] text-luxury-subtle mt-1 block">
            Honesty guarantee: The AI draft will rely solely on what is pasted here and will never fabricate claims.
          </span>
        </div>

        {/* 3 & 4. Price & Rating Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          
          {/* Price */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
              3. Historical Acquisition Price <span className="text-luxury-accent">*</span>
            </label>
            <div className="flex">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-3 py-2.5 border border-r-0 border-luxury-border bg-[#FAF9F6] text-xs font-mono"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
              <input
                type="number"
                step="any"
                required
                placeholder="49500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm font-mono focus:bg-white"
              />
            </div>
            <span className="text-[11px] text-luxury-subtle mt-1 block">
              Observed purchase price at the time of editorial selection.
            </span>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
              4. Editorial Rating (1-5) <span className="text-luxury-accent">*</span>
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm font-mono focus:bg-white"
            >
              <option value="5.0">★ 5.0 — Exceptional</option>
              <option value="4.8">★ 4.8 — Outstanding</option>
              <option value="4.5">★ 4.5 — Highly Recommended</option>
              <option value="4.0">★ 4.0 — Notable Quality</option>
              <option value="3.5">★ 3.5 — Good Utility</option>
              <option value="3.0">★ 3.0 — Satisfactory</option>
            </select>
          </div>
        </div>
      </section>

      {/* Section 2: Step 5 Single Image Upload */}
      <section className="bg-white border border-luxury-border p-5 sm:p-8 space-y-4">
        <div className="border-b border-luxury-border/60 pb-3">
          <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent">
            Step 5: Single Product Photography
          </span>
        </div>

        <p className="text-xs text-luxury-muted">
          Upload exactly one authentic image. The image is preserved in full resolution and presented in clean contain frames without cropping.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          <div className="sm:col-span-8">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="w-full text-xs text-luxury-muted file:mr-4 file:py-2.5 file:px-4 file:border file:border-luxury-border file:text-xs file:font-mono file:bg-luxury-black file:text-white hover:file:bg-luxury-accent cursor-pointer"
            />
            <span className="text-[11px] text-luxury-subtle mt-1 block font-mono">
              Accepted: JPEG, PNG, WebP (Max 5MB).
            </span>
            {isUploadingImage && (
              <span className="text-xs font-mono text-luxury-accent mt-2 block animate-pulse">
                Uploading to storage...
              </span>
            )}
          </div>

          <div className="sm:col-span-4 flex justify-center sm:justify-end">
            <div className="w-28 h-32 border border-luxury-border bg-[#F6F3EC] overflow-hidden flex items-center justify-center">
              {imagePreview ? (
                <ContainImage src={imagePreview} alt="Preview" />
              ) : (
                <span className="text-[10px] uppercase font-mono text-luxury-subtle text-center p-2">
                  No Image Selected
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Step 6 & 7 Gemini AI Content Generation & Review */}
      <section className="bg-white border border-luxury-border p-5 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxury-border/60 pb-3">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent block">
              Step 6 &amp; 7: Gemini AI Draft &amp; Editorial Review
            </span>
          </div>

          <button
            type="button"
            onClick={handleGenerateAI}
            disabled={isGeneratingAI || !sourceContent.trim()}
            className={`w-full sm:w-auto px-4 py-2.5 text-xs uppercase tracking-widest font-mono transition-colors flex items-center justify-center gap-2 ${
              isGeneratingAI || !sourceContent.trim()
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-luxury-accent hover:bg-luxury-accentHover text-white shadow-sm'
            }`}
          >
            <span>{isGeneratingAI ? 'Crafting Draft...' : '✦ Generate AI Draft'}</span>
          </button>
        </div>

        {aiGeneratedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-mono">
            ✓ Editorial draft generated successfully. Please review and refine the fields below.
          </div>
        )}

        {/* 7. Editable Title */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
            Editorial Title <span className="text-luxury-accent">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Minimalist Mechanical Chronometer or Premium Studio Headphones"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-base font-editorial-serif focus:bg-white"
          />
        </div>

        {/* 7. Editable Description */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
            Editorial Description (2-3 Paragraphs) <span className="text-luxury-accent">*</span>
          </label>
          <textarea
            rows={7}
            placeholder="Write or review the objective editorial description focusing on materials, construction, and aesthetic design."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm leading-relaxed focus:bg-white"
          />
        </div>

        {/* 7. Editable "My Take" Section */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-luxury-accent mb-2">
            "My Take" — Owner's Perspective (Editorial Column)
          </label>
          <textarea
            rows={3}
            placeholder="Personal commentary or opinion regarding why this item is worth considering."
            value={myTake}
            onChange={(e) => setMyTake(e.target.value)}
            className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm italic font-editorial-serif focus:bg-white"
          />
          <span className="text-[11px] text-luxury-subtle mt-1 block">
            This will be displayed in the signature editorial block on the article page.
          </span>
        </div>

        {/* 8. Optional Hands-on Video or Reel URL */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
            Review Video or Reel URL (YouTube / Instagram) <span className="text-luxury-subtle font-normal">(Optional)</span>
          </label>
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm font-mono focus:bg-white"
          />
          <span className="text-[11px] text-luxury-subtle mt-1 block">
            Optional link to your YouTube video review, Short, or Instagram Reel. It will be showcased on the product article page.
          </span>
        </div>
      </section>

      {/* Section 4: Step 8 & 9 Preview & Actions (Responsive full-width buttons on mobile) */}
      <section className="bg-white border border-luxury-border p-5 sm:p-8 space-y-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent block mb-1">
            Step 8 &amp; 9: Preview &amp; Publishing
          </span>
          <p className="text-xs text-luxury-muted">
            Inspect live card and article rendering before committing to the archive.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-3 pt-2">
          {/* Step 8: Preview Button */}
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="w-full sm:w-auto px-5 py-3 border border-luxury-border bg-luxury-card hover:bg-[#F6F3EC] text-luxury-text text-xs uppercase tracking-wider font-mono transition-colors text-center"
          >
            Preview Object &rarr;
          </button>

          {/* Step 9: Save as Draft */}
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={savingStatus !== false}
            className="w-full sm:w-auto px-5 py-3 border border-luxury-black text-luxury-black hover:bg-luxury-black hover:text-white text-xs uppercase tracking-widest font-mono transition-colors text-center"
          >
            {savingStatus === 'draft' ? 'Saving...' : 'Save Draft'}
          </button>

          {/* Step 9: Publish Object */}
          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={savingStatus !== false}
            className="w-full sm:w-auto px-6 py-3 bg-luxury-black text-white hover:bg-luxury-accent text-xs uppercase tracking-widest font-mono transition-colors text-center"
          >
            {savingStatus === 'published' ? 'Publishing...' : 'Publish to Journal'}
          </button>
        </div>
      </section>

      {/* Live Preview Modal */}
      <ProductPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        productData={{
          title,
          description,
          price: parseFloat(price) || 0,
          currency,
          rating: parseFloat(rating) || 5,
          my_take: myTake,
          video_url: videoUrl,
          image_path: imagePreview,
          affiliate_url: affiliateUrl,
          article_number: 1009
        }}
        currencySymbol={currency === 'INR' ? '₹' : currency}
      />

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-luxury-border max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="border-b border-luxury-border/60 pb-3">
              <span className="text-[10px] uppercase tracking-widest font-mono text-luxury-accent block mb-1">
                Confirmation Required
              </span>
              <h3 className="font-editorial-serif text-2xl text-luxury-text font-normal">
                {pendingStatus === 'published' ? 'Publish to Public Journal?' : 'Save as Editorial Draft?'}
              </h3>
            </div>

            <div className="space-y-3 text-xs text-luxury-muted leading-relaxed">
              <p>
                Are you sure you want to {pendingStatus === 'published' ? 'publish this object publicly' : 'save this object as a private draft'}?
              </p>
              <div className="p-3 bg-[#FAF9F6] border border-luxury-border/60 font-mono text-[11px] space-y-1.5">
                <div className="truncate"><strong>Title:</strong> {title || 'Untitled'}</div>
                <div><strong>Status:</strong> {pendingStatus === 'published' ? '● Published (Public)' : '○ Draft (Private)'}</div>
                <div><strong>Price:</strong> {currency} {price}</div>
                <div className="truncate"><strong>Affiliate URL:</strong> {affiliateUrl}</div>
                {videoUrl && <div className="truncate"><strong>Video Review:</strong> {videoUrl}</div>}
              </div>
              <p className="text-[11px] text-luxury-subtle">
                Once confirmed, the item will be added to your database and you will be redirected to the Products archive page.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-luxury-border/40 font-mono text-xs">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={savingStatus !== false}
                className="px-4 py-2.5 border border-luxury-border text-luxury-muted hover:text-luxury-text"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                disabled={savingStatus !== false}
                className="px-6 py-2.5 bg-luxury-black text-white hover:bg-luxury-accent uppercase tracking-wider transition-colors"
              >
                {savingStatus !== false ? 'Saving...' : 'Confirm & Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
