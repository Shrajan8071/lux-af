'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProductPreviewModal from '@/components/admin/ProductPreviewModal'
import ContainImage from '@/components/product/ContainImage'

export default function EditProductPage({ params }) {
  const { id } = params
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState(null)

  // Editable fields
  const [affiliateUrl, setAffiliateUrl] = useState('')
  const [sourceContent, setSourceContent] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('INR')
  const [rating, setRating] = useState('4.8')
  const [status, setStatus] = useState('draft')
  const [imagePreview, setImagePreview] = useState('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [myTake, setMyTake] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/products/${id}`)
        if (res.ok) {
          const data = await res.json()
          if (data.product) {
            const p = data.product
            setProduct(p)
            setAffiliateUrl(p.affiliate_url || '')
            setSourceContent(p.source_content || '')
            setPrice(String(p.price || ''))
            setCurrency(p.currency || 'INR')
            setRating(String(p.rating || '4.8'))
            setStatus(p.status || 'draft')
            setImagePreview(p.image_path || '')
            setTitle(p.title || '')
            setDescription(p.description || '')
            setMyTake(p.my_take || '')
            setVideoUrl(p.video_url || '')
          }
        } else {
          setError('Product not found')
        }
      } catch (e) {
        setError('Error loading product details')
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [id])

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please upload a valid JPEG, PNG, or WebP image.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.')
      return
    }

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
        setSuccessMsg('Image updated.')
        setTimeout(() => setSuccessMsg(null), 3000)
      } else {
        setError(data.error || 'Failed to upload image')
      }
    } catch {
      setError('Failed to upload image')
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleRegenerateAI = async () => {
    if (!sourceContent.trim()) {
      setError('Pasted source content is required to regenerate draft.')
      return
    }

    const confirmRegen = window.confirm(
      'Regenerating will replace title, description, and My Take with new AI drafts. Proceed?'
    )
    if (!confirmRegen) return

    setIsGeneratingAI(true)
    setError(null)

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
        setSuccessMsg('AI draft regenerated. Please review before saving.')
        setTimeout(() => setSuccessMsg(null), 4000)
      } else {
        setError(data.error || 'Failed to generate AI draft')
      }
    } catch {
      setError('Network error during AI regeneration')
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

  const handleSave = (e) => {
    e?.preventDefault()
    setError(null)
    setSuccessMsg(null)

    if (!affiliateUrl.trim()) {
      setError('Affiliate Purchase URL is required')
      return
    }
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required')
      return
    }
    if (!price || isNaN(parseFloat(price))) {
      setError('Valid price is required')
      return
    }

    // Open confirmation modal
    setShowConfirmModal(true)
  }

  const handleConfirmSave = async () => {
    setSaving(true)
    setError(null)

    const cleanAffiliateUrl = normalizeUrl(affiliateUrl)
    const cleanVideoUrl = videoUrl.trim() ? normalizeUrl(videoUrl) : null

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
          status,
        })
      })

      const data = await res.json()
      if (data.success) {
        setShowConfirmModal(false)
        router.push('/admin/products?saved=updated')
      } else {
        setShowConfirmModal(false)
        setError(data.error || 'Failed to save changes')
        setSaving(false)
      }
    } catch {
      setShowConfirmModal(false)
      setError('Network error saving changes')
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="py-20 text-center font-mono text-xs text-luxury-muted">Loading article details...</div>
  }

  if (!product) {
    return (
      <div className="py-16 text-center">
        <p className="font-editorial-serif text-2xl text-luxury-text mb-2">Object Not Found</p>
        <Link href="/admin/products" className="text-xs font-mono underline text-luxury-muted">
          Return to catalogue archive
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="border-b border-luxury-border/80 pb-6">
        <Link
          href="/admin/products"
          className="text-xs font-mono text-luxury-muted hover:text-luxury-text transition-colors mb-2 inline-block"
        >
          &larr; Back to Catalogue Archive
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-luxury-accent block">
              Article No. {product.article_number} &middot; Stable Identifier
            </span>
            <h1 className="font-editorial-serif text-3xl sm:text-4xl text-luxury-text font-normal">
              Edit Object
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {status === 'published' && (
              <Link
                href={`/article/${product.article_number}`}
                target="_blank"
                className="px-3 py-2 border border-luxury-border text-xs font-mono text-luxury-muted hover:text-luxury-text bg-white"
              >
                View Public Article ↗
              </Link>
            )}
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="px-3 py-2 border border-luxury-border text-xs font-mono text-luxury-text bg-white hover:bg-[#F6F3EC]"
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-900 font-mono">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-mono">
          ✓ {successMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Core Product Information */}
        <section className="bg-white border border-luxury-border p-5 sm:p-8 space-y-6">
          <div className="border-b border-luxury-border/60 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent">
              Core Reference Data
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-luxury-subtle">Status:</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-2 py-1 text-xs font-mono border border-luxury-border bg-[#FAF9F6]"
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Public)</option>
              </select>
            </div>
          </div>

          {/* Affiliate URL */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
              Affiliate Purchase URL
            </label>
            <input
              type="url"
              required
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm font-mono focus:bg-white"
            />
          </div>

          {/* Price & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                Historical Acquisition Price
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
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm font-mono focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                Rating (1-5)
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

          {/* Product Image Replacement */}
          <div className="pt-4 border-t border-luxury-border/40">
            <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
              Single Product Image
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="w-24 h-28 border border-luxury-border bg-[#F6F3EC] overflow-hidden shrink-0">
                <ContainImage src={imagePreview} alt="Image" />
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="w-full text-xs text-luxury-muted file:mr-4 file:py-2.5 file:px-3 file:border file:border-luxury-border file:text-xs file:font-mono file:bg-luxury-black file:text-white hover:file:bg-luxury-accent cursor-pointer"
                />
                <span className="text-[11px] text-luxury-subtle mt-1 block font-mono">
                  Replace image (JPEG, PNG, WebP &middot; max 5MB).
                </span>
                {isUploadingImage && (
                  <span className="text-xs font-mono text-luxury-accent mt-1 block">Uploading...</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Text & AI Re-generation */}
        <section className="bg-white border border-luxury-border p-5 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxury-border/60 pb-3">
            <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent">
              Editorial Copy
            </span>
            <button
              type="button"
              onClick={handleRegenerateAI}
              disabled={isGeneratingAI || !sourceContent.trim()}
              className="text-xs font-mono text-luxury-accent hover:text-luxury-text underline text-left"
            >
              {isGeneratingAI ? 'Regenerating...' : '✦ Regenerate AI Draft from Source'}
            </button>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
              Product Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-base font-editorial-serif focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
              Editorial Description
            </label>
            <textarea
              rows={7}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm leading-relaxed focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-luxury-accent mb-2">
              "My Take" — Owner's Perspective
            </label>
            <textarea
              rows={3}
              value={myTake}
              onChange={(e) => setMyTake(e.target.value)}
              className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm italic font-editorial-serif focus:bg-white"
            />
          </div>

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

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-luxury-subtle mb-2">
              Source Content Reference (Admin only, not displayed publicly)
            </label>
            <textarea
              rows={4}
              value={sourceContent}
              onChange={(e) => setSourceContent(e.target.value)}
              className="w-full px-3 py-2 border border-luxury-border bg-[#FAF9F6] text-luxury-muted text-xs font-mono focus:bg-white"
            />
          </div>
        </section>

        {/* Actions Bar (Responsive full width on mobile) */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-luxury-border">
          <Link
            href="/admin/products"
            className="w-full sm:w-auto py-3 text-center text-xs font-mono text-luxury-muted hover:text-luxury-text"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3 bg-luxury-black text-white hover:bg-luxury-accent text-xs uppercase tracking-widest font-mono transition-colors text-center"
          >
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Preview Modal */}
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
          article_number: product.article_number
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
                Save Product Changes?
              </h3>
            </div>

            <div className="space-y-3 text-xs text-luxury-muted leading-relaxed">
              <p>
                Are you sure you want to save changes to Object No. {product.article_number}?
              </p>
              <div className="p-3 bg-[#FAF9F6] border border-luxury-border/60 font-mono text-[11px] space-y-1.5">
                <div className="truncate"><strong>Title:</strong> {title || 'Untitled'}</div>
                <div><strong>Status:</strong> {status === 'published' ? '● Published (Public)' : '○ Draft (Private)'}</div>
                <div><strong>Price:</strong> {currency} {price}</div>
                <div className="truncate"><strong>Affiliate URL:</strong> {affiliateUrl}</div>
                {videoUrl && <div className="truncate"><strong>Video Review:</strong> {videoUrl}</div>}
              </div>
              <p className="text-[11px] text-luxury-subtle">
                Once confirmed, your changes will be saved to the database and you will be returned to the Products archive page.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-luxury-border/40 font-mono text-xs">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={saving}
                className="px-4 py-2.5 border border-luxury-border text-luxury-muted hover:text-luxury-text"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                disabled={saving}
                className="px-6 py-2.5 bg-luxury-black text-white hover:bg-luxury-accent uppercase tracking-wider transition-colors"
              >
                {saving ? 'Saving...' : 'Confirm & Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
