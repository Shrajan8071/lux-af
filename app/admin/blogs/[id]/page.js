'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BlogPreviewModal from '@/components/admin/BlogPreviewModal'

export default function EditBlogPage({ params }) {
  const router = useRouter()
  const { id } = params

  const [loading, setLoading] = useState(true)
  const [savingStatus, setSavingStatus] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  // Form Fields
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('draft')
  
  // Optional Media & Links
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [externalLink, setExternalLink] = useState('')
  const [externalLinkLabel, setExternalLinkLabel] = useState('Reference Resource')

  // AI & Workflow
  const [isRephrasingAI, setIsRephrasingAI] = useState(false)
  const [aiSuccessMsg, setAiSuccessMsg] = useState(null)
  const [previousDraft, setPreviousDraft] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  useEffect(() => {
    loadBlog()
  }, [id])

  const loadBlog = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/blogs/${id}`)
      const data = await res.json()
      if (data.success && data.blog) {
        const b = data.blog
        setTitle(b.title || '')
        setSlug(b.slug || '')
        setExcerpt(b.excerpt || '')
        setContent(b.content || '')
        setStatus(b.status || 'draft')
        setImagePreview(b.image_path || '')
        setVideoUrl(b.video_url || '')
        setExternalLink(b.external_link || '')
        setExternalLinkLabel(b.external_link_label || 'Reference Resource')
      } else {
        setError(data.error || 'Failed to load blog post')
      }
    } catch (err) {
      setError('Network error loading blog post')
    } finally {
      setLoading(false)
    }
  }

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

  const handleRephraseAI = async () => {
    if (!content.trim()) {
      setError('Content cannot be empty to rephrase.')
      return
    }

    setError(null)
    setIsRephrasingAI(true)
    setAiSuccessMsg(null)

    setPreviousDraft({ title, excerpt, content })

    try {
      const res = await fetch('/api/admin/blogs/rephrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, rawContent: content })
      })

      const data = await res.json()
      if (data.success && data.data) {
        if (data.data.title && !title.trim()) {
          setTitle(data.data.title)
        }
        if (data.data.excerpt) {
          setExcerpt(data.data.excerpt)
        }
        if (data.data.content) {
          setContent(data.data.content)
        }
        setAiSuccessMsg(
          data.simulated
            ? '✦ Content rephrased with editorial structure (Local template). Review and refine.'
            : '✦ Essay professionally polished by Gemini AI. Review and refine below.'
        )
      } else {
        setError(data.error || 'Failed to rephrase content with Gemini AI.')
      }
    } catch (err) {
      setError('Network error during AI rephrasing.')
    } finally {
      setIsRephrasingAI(false)
    }
  }

  const handleRevertDraft = () => {
    if (previousDraft) {
      setTitle(previousDraft.title)
      setExcerpt(previousDraft.excerpt)
      setContent(previousDraft.content)
      setPreviousDraft(null)
      setAiSuccessMsg('Draft reverted to previous version.')
    }
  }

  const handleOpenConfirm = (e) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('A blog post title is required.')
      return
    }

    if (!content.trim()) {
      setError('Blog essay content cannot be empty.')
      return
    }

    setShowConfirmModal(true)
  }

  const handleConfirmSave = async () => {
    setSavingStatus(true)
    setError(null)

    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || null,
        content: content.trim(),
        image_path: imagePreview.trim() || null,
        video_url: videoUrl.trim() || null,
        external_link: externalLink.trim() || null,
        external_link_label: externalLinkLabel.trim() || 'Reference Resource',
        status,
      }

      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await res.json()
      if (result.success) {
        setShowConfirmModal(false)
        router.push('/admin/blogs?saved=updated')
      } else {
        setShowConfirmModal(false)
        setError(result.error || 'Failed to update blog post.')
        setSavingStatus(false)
      }
    } catch (err) {
      setShowConfirmModal(false)
      setError('Network error while updating blog post.')
      setSavingStatus(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-mono text-xs text-luxury-muted">
        Loading editorial dispatch...
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between text-xs font-mono text-luxury-subtle">
          <div className="flex items-center gap-2">
            <Link href="/admin/blogs" className="hover:text-luxury-text transition-colors">
              &larr; Back to Blogs
            </Link>
            <span>/</span>
            <span className="text-luxury-text truncate max-w-xs">{title}</span>
          </div>

          {status === 'published' && (
            <Link
              href={`/blogs/${slug}`}
              target="_blank"
              className="text-luxury-accent hover:text-luxury-text underline font-mono text-xs"
            >
              View Live Post ↗
            </Link>
          )}
        </div>

        {/* Masthead */}
        <div className="border-b border-luxury-border/60 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-luxury-accent block mb-1">
              Editorial Editing Suite
            </span>
            <h1 className="font-editorial-serif text-3xl sm:text-4xl text-luxury-text font-normal">
              Edit Blog Post
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-luxury-subtle">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-1.5 text-xs font-mono border border-luxury-border bg-[#FAF9F6] dark:bg-luxury-highlight text-luxury-text"
            >
              <option value="draft">Draft (Private)</option>
              <option value="published">Published (Public)</option>
            </select>
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-900 dark:text-red-300 font-mono flex items-center justify-between shadow-sm">
            <span>⚠ {error}</span>
            <button onClick={() => setError(null)} className="text-red-700 dark:text-red-400 hover:text-red-900 ml-4 font-mono">✕</button>
          </div>
        )}

        <form onSubmit={handleOpenConfirm} className="space-y-8">
          
          {/* Section 1: Title & Slug */}
          <section className="bg-white dark:bg-luxury-card border border-luxury-border p-5 sm:p-8 space-y-6">
            <div className="border-b border-luxury-border/60 pb-3">
              <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent">
                Core Identity &amp; Route
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                Post Title <span className="text-luxury-accent">*</span>
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text">
                  URL Route / Slug <span className="text-luxury-accent">*</span>
                </label>
                <span className="text-[10px] font-mono text-luxury-subtle">
                  /blogs/{slug}
                </span>
              </div>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-xs font-mono focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                Short Excerpt / Subtitle <span className="text-luxury-subtle font-normal">(Optional)</span>
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-xs leading-relaxed focus:bg-white font-mono"
              />
            </div>
          </section>

          {/* Section 2: Media & Links */}
          <section className="bg-white dark:bg-luxury-card border border-luxury-border p-5 sm:p-8 space-y-6">
            <div className="border-b border-luxury-border/60 pb-3">
              <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent">
                Media &amp; Outbound References
              </span>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text">
                Cover Photo <span className="text-luxury-subtle font-normal">(Optional)</span>
              </label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  disabled={isUploadingImage}
                  className="w-full text-xs text-luxury-muted file:mr-4 file:py-2.5 file:px-4 file:border file:border-luxury-border file:text-xs file:font-mono file:bg-luxury-black file:text-white hover:file:bg-luxury-accent cursor-pointer"
                />
                {isUploadingImage && (
                  <span className="text-xs font-mono text-luxury-accent animate-pulse shrink-0">
                    Uploading image...
                  </span>
                )}
              </div>

              <div className="pt-2">
                <span className="text-[11px] font-mono text-luxury-subtle block mb-1">
                  Or direct image URL:
                </span>
                <input
                  type="url"
                  value={imagePreview}
                  onChange={(e) => setImagePreview(e.target.value)}
                  className="w-full px-3 py-2 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-xs font-mono focus:bg-white"
                />
              </div>

              {imagePreview && (
                <div className="mt-3 aspect-[16/9] max-w-sm border border-luxury-border bg-luxury-frame overflow-hidden relative">
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('')
                      setImageFile(null)
                    }}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white text-[10px] px-2 py-1 font-mono"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                Video Review / Commentary URL <span className="text-luxury-subtle font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm font-mono focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                  External Reference Link <span className="text-luxury-subtle font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm font-mono focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                  Link Button Label
                </label>
                <input
                  type="text"
                  value={externalLinkLabel}
                  onChange={(e) => setExternalLinkLabel(e.target.value)}
                  className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm focus:bg-white font-mono"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Content & Gemini AI */}
          <section className="bg-white dark:bg-luxury-card border border-luxury-border p-5 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxury-border/60 pb-3">
              <div>
                <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent block">
                  Essay Content &amp; AI Polishing
                </span>
              </div>

              <div className="flex items-center gap-2">
                {previousDraft && (
                  <button
                    type="button"
                    onClick={handleRevertDraft}
                    className="px-3 py-2 border border-luxury-border hover:border-luxury-accent bg-luxury-card text-luxury-text text-xs font-mono"
                    title="Undo AI Rephrase"
                  >
                    ↺ Revert
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleRephraseAI}
                  disabled={isRephrasingAI || !content.trim()}
                  className={`px-4 py-2 text-xs uppercase tracking-widest font-mono transition-colors flex items-center justify-center gap-2 ${
                    isRephrasingAI || !content.trim()
                      ? 'bg-gray-200 dark:bg-luxury-frame text-gray-500 dark:text-luxury-subtle cursor-not-allowed'
                      : 'bg-luxury-accent hover:bg-luxury-accentHover text-luxury-bg dark:text-[#0F0E0D] font-medium shadow-sm'
                  }`}
                >
                  {isRephrasingAI ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Polishing Essay...</span>
                    </>
                  ) : (
                    <span>✦ Polish with Gemini AI</span>
                  )}
                </button>
              </div>
            </div>

            {aiSuccessMsg && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 font-mono flex items-center justify-between">
                <span>{aiSuccessMsg}</span>
                <button type="button" onClick={() => setAiSuccessMsg(null)} className="ml-3 font-mono">✕</button>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                Essay Body Content <span className="text-luxury-accent">*</span>
              </label>
              <textarea
                rows={14}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm leading-relaxed focus:bg-white font-mono"
              />
            </div>
          </section>

          {/* Section 4: Action Footer */}
          <section className="bg-white dark:bg-luxury-card border border-luxury-border p-5 sm:p-8 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-900 dark:text-red-300 font-mono flex items-center justify-between">
                <span>⚠ {error}</span>
                <button type="button" onClick={() => setError(null)} className="text-red-700 dark:text-red-400 hover:text-red-900 ml-3">✕</button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="w-full sm:w-auto px-5 py-3 border border-luxury-border bg-luxury-card hover:bg-luxury-highlight text-luxury-text text-xs uppercase tracking-wider font-mono transition-colors text-center"
              >
                Preview Post &rarr;
              </button>

              <button
                type="submit"
                disabled={savingStatus !== false}
                className="w-full sm:w-auto px-8 py-3 bg-luxury-black text-white hover:bg-luxury-accent text-xs uppercase tracking-widest font-mono transition-colors text-center shadow-sm"
              >
                {savingStatus ? 'Saving...' : 'Save Blog Changes'}
              </button>
            </div>
          </section>

        </form>

      {/* Live Preview Modal */}
      <BlogPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        blogData={{
          title,
          excerpt,
          content,
          image_path: imagePreview,
          video_url: videoUrl,
          external_link: externalLink,
          external_link_label: externalLinkLabel
        }}
      />

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-luxury-card border border-luxury-border max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="border-b border-luxury-border/60 pb-3">
              <span className="text-[10px] uppercase tracking-widest font-mono text-luxury-accent block mb-1">
                Confirmation Required
              </span>
              <h3 className="font-editorial-serif text-2xl text-luxury-text font-normal">
                Save Blog Changes?
              </h3>
            </div>

            <div className="space-y-3 text-xs text-luxury-muted leading-relaxed">
              <p>
                Are you sure you want to update <strong className="text-luxury-text">"{title}"</strong>?
              </p>
              <div className="p-3 bg-[#FAF9F6] dark:bg-luxury-highlight border border-luxury-border/60 font-mono text-[11px] space-y-1.5">
                <div className="truncate"><strong>Title:</strong> {title}</div>
                <div><strong>Route:</strong> /blogs/{slug}</div>
                <div><strong>Status:</strong> {status === 'published' ? '● Published (Public)' : '○ Draft (Private)'}</div>
              </div>
              <p className="text-[11px] text-luxury-subtle">
                Once confirmed, your changes will be updated live across the journal.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-luxury-border/40 font-mono text-xs">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={savingStatus !== false}
                className="px-4 py-2.5 border border-luxury-border text-luxury-muted hover:text-luxury-text hover:bg-luxury-highlight transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                disabled={savingStatus !== false}
                className="px-6 py-2.5 bg-luxury-black text-white hover:bg-luxury-accent uppercase tracking-wider transition-colors shadow-sm"
              >
                {savingStatus ? 'Updating...' : 'Confirm & Save'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
