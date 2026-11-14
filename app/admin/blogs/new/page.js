'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminNav from '@/components/layout/AdminNav'
import BlogPreviewModal from '@/components/admin/BlogPreviewModal'

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export default function NewBlogPage() {
  const router = useRouter()

  // Form Fields
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  
  // Optional Media & Links
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [externalLink, setExternalLink] = useState('')
  const [externalLinkLabel, setExternalLinkLabel] = useState('Reference Resource')

  // AI & Workflow states
  const [isRephrasingAI, setIsRephrasingAI] = useState(false)
  const [aiSuccessMsg, setAiSuccessMsg] = useState(null)
  const [previousDraft, setPreviousDraft] = useState(null) // for undo
  const [previewOpen, setPreviewOpen] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingStatus, setPendingStatus] = useState('published')
  const [error, setError] = useState(null)
  const [savingStatus, setSavingStatus] = useState(false) // 'draft' | 'published' | false

  // Handle Title Change & Auto-Slug
  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (!slugManuallyEdited) {
      setSlug(slugify(newTitle))
    }
  }

  // Handle Image Upload
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

  // Gemini AI Rephrasing
  const handleRephraseAI = async () => {
    if (!content.trim()) {
      setError('Please write or paste your rough thoughts in the content field first.')
      return
    }

    setError(null)
    setIsRephrasingAI(true)
    setAiSuccessMsg(null)

    // Save current content for undo
    setPreviousDraft({
      title,
      excerpt,
      content
    })

    try {
      const res = await fetch('/api/admin/blogs/rephrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          rawContent: content
        })
      })

      const data = await res.json()
      if (data.success && data.data) {
        if (data.data.title && !title.trim()) {
          setTitle(data.data.title)
          if (!slugManuallyEdited) {
            setSlug(slugify(data.data.title))
          }
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
            : '✦ Essay professionally polished and structured by Gemini AI. Review and refine below.'
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

  // Form Submission
  const handleSave = (statusToSet) => {
    setError(null)

    if (!title.trim()) {
      setError('A blog post title is required.')
      return
    }

    if (!content.trim()) {
      setError('Blog essay content cannot be empty.')
      return
    }

    setPendingStatus(statusToSet)
    setShowConfirmModal(true)
  }

  const handleConfirmSave = async () => {
    setSavingStatus(pendingStatus)
    setError(null)

    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim() || slugify(title),
        excerpt: excerpt.trim() || null,
        content: content.trim(),
        image_path: imagePreview.trim() || null,
        video_url: videoUrl.trim() || null,
        external_link: externalLink.trim() || null,
        external_link_label: externalLinkLabel.trim() || 'Reference Resource',
        status: pendingStatus,
      }

      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await res.json()
      if (result.success) {
        setShowConfirmModal(false)
        router.push('/admin/blogs?saved=created')
      } else {
        setShowConfirmModal(false)
        setError(result.error || 'Failed to save blog post.')
        setSavingStatus(false)
      }
    } catch (err) {
      setShowConfirmModal(false)
      setError('Network error while saving blog post.')
      setSavingStatus(false)
    }
  }

  return (
    <div className="min-h-screen bg-luxury-bg text-luxury-text flex flex-col font-sans transition-colors duration-150">
      <AdminNav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex-1 w-full space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-luxury-subtle">
          <Link href="/admin/blogs" className="hover:text-luxury-text transition-colors">
            &larr; Back to Blogs
          </Link>
          <span>/</span>
          <span className="text-luxury-text">New Dispatch</span>
        </div>

        {/* Page Masthead */}
        <div className="border-b border-luxury-border/60 pb-6">
          <span className="text-[10px] uppercase tracking-widest font-mono text-luxury-accent block mb-1">
            Editorial Authoring Suite
          </span>
          <h1 className="font-editorial-serif text-3xl sm:text-4xl text-luxury-text font-normal">
            Write New Blog Post
          </h1>
          <p className="text-xs text-luxury-muted mt-1">
            Compose your essay, attach optional cover imagery or video commentary, and use Gemini AI to professionally polish the cadence.
          </p>
        </div>

        {/* Global Error Notice */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-900 dark:text-red-300 font-mono flex items-center justify-between shadow-sm">
            <span>⚠ {error}</span>
            <button onClick={() => setError(null)} className="text-red-700 dark:text-red-400 hover:text-red-900 ml-4 font-mono">✕</button>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          
          {/* Section 1: Title & URL Slug */}
          <section className="bg-white dark:bg-luxury-card border border-luxury-border p-5 sm:p-8 space-y-6">
            <div className="border-b border-luxury-border/60 pb-3">
              <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent">
                Step 1: Title &amp; URL Identity
              </span>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                Post Title <span className="text-luxury-accent">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. The Tactile Weight of Titanium in Modern Hardware"
                value={title}
                onChange={handleTitleChange}
                className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-base font-editorial-serif focus:bg-white"
              />
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text">
                  URL Route / Slug <span className="text-luxury-accent">*</span>
                </label>
                <span className="text-[10px] font-mono text-luxury-subtle">
                  Live link: /blogs/{slug || '...'}
                </span>
              </div>
              <input
                type="text"
                required
                placeholder="the-tactile-weight-of-titanium"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value)
                  setSlugManuallyEdited(true)
                }}
                className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-xs font-mono focus:bg-white"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                Short Excerpt / Subtitle <span className="text-luxury-subtle font-normal">(Optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="A 1-2 sentence overview shown in article card listings and RSS previews."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-xs leading-relaxed focus:bg-white font-mono"
              />
            </div>
          </section>

          {/* Section 2: Optional Photo, Video & External Link */}
          <section className="bg-white dark:bg-luxury-card border border-luxury-border p-5 sm:p-8 space-y-6">
            <div className="border-b border-luxury-border/60 pb-3">
              <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent">
                Step 2: Optional Media &amp; Reference Links
              </span>
            </div>

            {/* Photo Upload / URL */}
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

              {/* Manual URL option */}
              <div className="pt-2">
                <span className="text-[11px] font-mono text-luxury-subtle block mb-1">
                  Or provide direct image URL:
                </span>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imagePreview}
                  onChange={(e) => setImagePreview(e.target.value)}
                  className="w-full px-3 py-2 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-xs font-mono focus:bg-white"
                />
              </div>

              {/* Image Preview */}
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

            {/* Video Link */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                Video Review / Commentary URL <span className="text-luxury-subtle font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm font-mono focus:bg-white"
              />
              <span className="text-[11px] text-luxury-subtle mt-1 block">
                YouTube videos will embed an inline player. Instagram reels will show a direct visual launch block.
              </span>
            </div>

            {/* External Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text mb-2">
                  External Reference Link <span className="text-luxury-subtle font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://manufacturer.com/whitepaper"
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
                  placeholder="e.g. Official Technical Whitepaper"
                  value={externalLinkLabel}
                  onChange={(e) => setExternalLinkLabel(e.target.value)}
                  className="w-full px-3 py-2.5 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm focus:bg-white font-mono"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Blog Content & Gemini Rephrasing */}
          <section className="bg-white dark:bg-luxury-card border border-luxury-border p-5 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxury-border/60 pb-3">
              <div>
                <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent block">
                  Step 3: Content &amp; Gemini AI Rephrasing
                </span>
                <span className="text-[11px] text-luxury-subtle">
                  Type rough notes or full thoughts. Gemini can professionally rephrase into editorial prose.
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
                placeholder="Write your rough notes or draft thoughts here. Separate paragraphs with double enter. Use the '✦ Polish with Gemini AI' button above anytime to rephrase into refined editorial prose."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 border border-luxury-border bg-[#FAF9F6] text-luxury-text text-sm leading-relaxed focus:bg-white font-mono"
              />
              <div className="flex items-center justify-between text-[11px] text-luxury-subtle font-mono mt-1">
                <span>Separate paragraphs with empty line</span>
                <span>{content ? content.trim().split(/\s+/).length : 0} words</span>
              </div>
            </div>
          </section>

          {/* Section 4: Preview & Publishing Actions */}
          <section className="bg-white dark:bg-luxury-card border border-luxury-border p-5 sm:p-8 space-y-4">
            <div className="border-b border-luxury-border/60 pb-3">
              <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent block mb-1">
                Step 4: Preview &amp; Publishing
              </span>
              <p className="text-xs text-luxury-muted">
                Inspect live article rendering before committing to the public journal.
              </p>
            </div>

            {/* Inline Error Notice */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-900 dark:text-red-300 font-mono flex items-center justify-between">
                <span>⚠ {error}</span>
                <button type="button" onClick={() => setError(null)} className="text-red-700 dark:text-red-400 hover:text-red-900 ml-3">✕</button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-3 pt-2">
              {/* Preview Button */}
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="w-full sm:w-auto px-5 py-3 border border-luxury-border bg-luxury-card hover:bg-luxury-highlight text-luxury-text text-xs uppercase tracking-wider font-mono transition-colors text-center"
              >
                Preview Post &rarr;
              </button>

              {/* Save Draft */}
              <button
                type="button"
                onClick={() => handleSave('draft')}
                disabled={savingStatus !== false}
                className="w-full sm:w-auto px-5 py-3 border border-luxury-border hover:border-luxury-accent bg-luxury-card hover:bg-luxury-highlight text-luxury-text text-xs uppercase tracking-widest font-mono transition-colors text-center"
              >
                {savingStatus === 'draft' ? 'Saving...' : 'Save Draft'}
              </button>

              {/* Publish Button */}
              <button
                type="button"
                onClick={() => handleSave('published')}
                disabled={savingStatus !== false}
                className="w-full sm:w-auto px-6 py-3 bg-luxury-black text-white hover:bg-luxury-accent text-xs uppercase tracking-widest font-mono transition-colors text-center shadow-sm"
              >
                {savingStatus === 'published' ? 'Publishing...' : 'Publish to Journal'}
              </button>
            </div>
          </section>

        </form>

      </main>

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
                {pendingStatus === 'published' ? 'Publish to Public Journal?' : 'Save as Editorial Draft?'}
              </h3>
            </div>

            <div className="space-y-3 text-xs text-luxury-muted leading-relaxed">
              <p>
                Are you sure you want to {pendingStatus === 'published' ? 'publish this blog post publicly' : 'save this blog post as a private draft'}?
              </p>
              <div className="p-3 bg-[#FAF9F6] dark:bg-luxury-highlight border border-luxury-border/60 font-mono text-[11px] space-y-1.5">
                <div className="truncate"><strong>Title:</strong> {title || 'Untitled'}</div>
                <div><strong>Route:</strong> /blogs/{slug || slugify(title)}</div>
                <div><strong>Status:</strong> {pendingStatus === 'published' ? '● Published (Public)' : '○ Draft (Private)'}</div>
                <div><strong>Photo:</strong> {imagePreview ? 'Attached' : 'None (Optional)'}</div>
                <div><strong>Video:</strong> {videoUrl ? 'Attached' : 'None'}</div>
              </div>
              <p className="text-[11px] text-luxury-subtle">
                Once confirmed, the post will be saved and you will be redirected to the blogs management archive.
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
                {savingStatus !== false ? 'Saving...' : 'Confirm & Save'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
