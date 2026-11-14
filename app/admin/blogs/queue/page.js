'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BlogPreviewModal from '@/components/admin/BlogPreviewModal'

export default function AdminBlogQueuePage() {
  const [queuedBlogs, setQueuedBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [sourceDump, setSourceDump] = useState('')
  const [focusTopic, setFocusTopic] = useState('Everyday utility: How this gadget helps normal people in day-to-day life and practical routines')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isProcessingQueue, setIsProcessingQueue] = useState(false)
  const [actionMessage, setActionMessage] = useState(null)
  const [error, setError] = useState(null)
  const [previewBlog, setPreviewBlog] = useState(null)

  useEffect(() => {
    loadQueue()
  }, [])

  const loadQueue = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/blogs/queue')
      const data = await res.json()
      if (data.success && Array.isArray(data.queue)) {
        setQueuedBlogs(data.queue)
      }
    } catch (err) {
      console.error('Failed to load queue:', err)
    } finally {
      setLoading(false)
    }
  }

  // Generate a new blog from dump and add directly to queue
  const handleGenerateAndQueue = async () => {
    if (!sourceDump.trim()) {
      setError('Please paste product or gadget text in the dump box first.')
      return
    }

    setError(null)
    setIsGenerating(true)
    setActionMessage(null)

    try {
      const res = await fetch('/api/admin/blogs/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceDump: sourceDump.trim(),
          focusTopic: focusTopic.trim()
        })
      })

      const data = await res.json()
      if (data.success && data.blog) {
        setQueuedBlogs(prev => [...prev, data.blog])
        setSourceDump('')
        setActionMessage(`✓ Success! "${data.blog.title}" generated and placed in queue (Position #${queuedBlogs.length + 1}).`)
      } else {
        setError(data.error || 'Failed to generate and queue blog post.')
      }
    } catch (err) {
      setError('Network error during AI queue generation.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Test the automated queue drip engine on demand
  const handleTestProcessQueue = async () => {
    if (queuedBlogs.length === 0) {
      setError('The queue is currently empty. Add at least one post before testing the queue processor.')
      return
    }

    setError(null)
    setIsProcessingQueue(true)
    setActionMessage(null)

    try {
      const res = await fetch('/api/cron/process-queue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-trigger': 'true'
        }
      })

      const data = await res.json()
      if (data.success && data.published) {
        setQueuedBlogs(prev => prev.filter(b => b.id !== data.published.id))
        setActionMessage(`⚡ Queue Processor Test Successful: Published "${data.published.title}" live to the journal!`)
      } else {
        setActionMessage(data.message || 'Queue checked. No posts were published.')
      }
    } catch (err) {
      setError('Failed to trigger queue processing engine.')
    } finally {
      setIsProcessingQueue(false)
    }
  }

  // Instant Publish individual queued post
  const handlePublishNow = async (blog) => {
    try {
      const res = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...blog,
          status: 'published'
        })
      })

      const data = await res.json()
      if (data.success) {
        setQueuedBlogs(prev => prev.filter(b => b.id !== blog.id))
        setActionMessage(`✓ "${blog.title}" published live immediately.`)
      } else {
        alert(data.error || 'Failed to publish post.')
      }
    } catch (err) {
      alert('Network error while publishing.')
    }
  }

  // Delete from queue
  const handleDelete = async (blog) => {
    if (!window.confirm(`Remove "${blog.title}" from the automated queue?`)) return

    try {
      const res = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: 'DELETE'
      })

      const data = await res.json()
      if (data.success) {
        setQueuedBlogs(prev => prev.filter(b => b.id !== blog.id))
        setActionMessage(`Removed "${blog.title}" from queue.`)
      } else {
        alert(data.error || 'Failed to delete post.')
      }
    } catch (err) {
      alert('Network error while deleting.')
    }
  }

  // Determine health status
  const queueCount = queuedBlogs.length
  const healthLabel =
    queueCount >= 4 ? '● BUFFER HEALTHY' : queueCount >= 1 ? '▲ BUFFER LOW' : '○ QUEUE EMPTY'
  const healthColor =
    queueCount >= 4
      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
      : queueCount >= 1
      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'

  return (
    <div className="space-y-8 pb-16">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between text-xs font-mono text-luxury-subtle">
        <div className="flex items-center gap-2">
          <Link href="/admin/blogs" className="hover:text-luxury-text transition-colors">
            &larr; Back to Blogs
          </Link>
          <span>/</span>
          <span className="text-luxury-text">Automated Queue Drafter</span>
        </div>

        <Link
          href="/blogs"
          target="_blank"
          className="text-luxury-accent hover:text-luxury-text underline"
        >
          View Public Journal ↗
        </Link>
      </div>

      {/* Masthead Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-luxury-border/60">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-mono text-luxury-accent block mb-1">
            Automated Publishing Pipeline
          </span>
          <h1 className="font-editorial-serif text-3xl sm:text-4xl text-luxury-text font-normal">
            Automated Queue Drafter
          </h1>
          <p className="text-xs text-luxury-muted mt-1 max-w-2xl">
            Batch-generate product dispatches from Amazon or gadget dumps. Queued posts are preserved in a rolling buffer and automatically published one post daily at 9:00 AM IST.
          </p>
        </div>

        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-luxury-black text-white hover:bg-luxury-accent transition-colors text-xs uppercase tracking-widest font-mono shrink-0 shadow-sm"
        >
          <span>+ Write Manual Blog</span>
        </Link>
      </div>

      {/* Global Alerts */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-900 dark:text-red-300 font-mono flex items-center justify-between shadow-sm">
          <span>⚠ {error}</span>
          <button onClick={() => setError(null)} className="text-red-700 dark:text-red-400 hover:text-red-900 ml-4 font-mono">✕</button>
        </div>
      )}

      {actionMessage && (
        <div className="p-4 bg-[#FAF6EE] dark:bg-luxury-card border border-[#E3D9C4] dark:border-luxury-accent/50 text-xs font-mono text-luxury-text flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-luxury-accent font-bold">✦</span>
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-luxury-muted hover:text-luxury-text ml-4 font-mono">✕</button>
        </div>
      )}

      {/* Queue Buffer Metric & Health Card */}
      <section className="bg-white dark:bg-luxury-card border border-luxury-border p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxury-border/60 pb-5">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest font-mono text-luxury-accent block">
              Buffer Health Monitor
            </span>
            <div className="flex items-baseline gap-3">
              <span className="font-editorial-serif text-3xl sm:text-4xl text-luxury-text">
                {queueCount} {queueCount === 1 ? 'Queued Post' : 'Queued Posts'}
              </span>
              <span className={`px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-sm border ${healthColor}`}>
                {healthLabel}
              </span>
            </div>
            <p className="text-xs text-luxury-muted font-light pt-0.5">
              {queueCount === 0
                ? 'Your release queue is currently empty. Add products below to resume automated daily releases.'
                : `Enough buffered content for the next ${queueCount} ${queueCount === 1 ? 'day' : 'days'} of automated morning releases.`}
            </p>
          </div>

          {/* Test Queue Process Button */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <button
              type="button"
              onClick={handleTestProcessQueue}
              disabled={isProcessingQueue || queueCount === 0}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-luxury-border hover:border-luxury-accent bg-[#FAF9F6] dark:bg-luxury-highlight hover:bg-luxury-card text-xs font-mono text-luxury-text disabled:opacity-40 transition-colors shadow-sm"
              title="Test the cron execution logic on demand"
            >
              {isProcessingQueue ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-luxury-accent/30 border-t-luxury-accent rounded-full animate-spin" />
                  <span>Processing Queue...</span>
                </>
              ) : (
                <>
                  <span className="text-luxury-accent font-bold">⚡</span>
                  <span>Test Publish Next Post Now</span>
                </>
              )}
            </button>
            <span className="text-[10px] font-mono text-luxury-subtle">
              Scheduled Daily Release: 09:00 AM IST (03:30 UTC)
            </span>
          </div>
        </div>

        {/* Quick Ingestion Form */}
        <div className="space-y-4 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent font-semibold flex items-center gap-1.5">
              <span>✦</span>
              <span>Fast Queue Ingestion (Paste Gadget Text &rarr; Auto-Queue)</span>
            </span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-luxury-text">
              Paste Raw Gadget / Amazon Text Dump <span className="text-luxury-accent">*</span>
            </label>
            <textarea
              rows={5}
              placeholder="Paste Amazon gadget specs, product description, or raw notes here...&#10;e.g., 'Xiaomi Power Bank 5i 20000mAh 67W Turbo Charging, in-built lanyard cable, digital battery display...'"
              value={sourceDump}
              onChange={(e) => setSourceDump(e.target.value)}
              className="w-full px-3.5 py-3 border border-luxury-border bg-[#FAF9F6] dark:bg-luxury-frame text-luxury-text text-xs leading-relaxed focus:border-luxury-accent font-mono"
            />
          </div>

          {/* Optional Focus */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-luxury-subtle">
              Editorial Focus / Angle (Optional)
            </label>
            <input
              type="text"
              value={focusTopic}
              onChange={(e) => setFocusTopic(e.target.value)}
              placeholder="Everyday utility: How this gadget helps normal people in day-to-day life and practical routines"
              className="w-full px-3 py-2 border border-luxury-border/70 bg-[#FAF9F6] dark:bg-luxury-frame text-luxury-text text-xs font-mono focus:border-luxury-accent"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleGenerateAndQueue}
              disabled={isGenerating || !sourceDump.trim()}
              className="px-6 py-3 bg-luxury-black text-white hover:bg-luxury-accent disabled:opacity-50 text-xs uppercase tracking-widest font-mono flex items-center justify-center gap-2 transition-all shadow-sm group"
            >
              {isGenerating ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Gemini Synthesizing &amp; Adding to Queue...</span>
                </>
              ) : (
                <>
                  <span className="group-hover:rotate-12 transition-transform">✦</span>
                  <span>Generate &amp; Add to Queue</span>
                </>
              )}
            </button>

            {sourceDump && (
              <button
                type="button"
                onClick={() => setSourceDump('')}
                className="text-xs text-luxury-muted hover:text-luxury-text font-mono underline underline-offset-4 self-end sm:self-center"
              >
                Clear Dump Text
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Queue Dispatches List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-luxury-border/60 pb-3">
          <span className="text-xs uppercase tracking-widest font-mono text-luxury-accent font-semibold">
            Upcoming Scheduled Dispatches ({queueCount})
          </span>
          <span className="text-[11px] font-mono text-luxury-subtle">
            Published chronologically from top to bottom
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center font-mono text-xs text-luxury-muted bg-luxury-card border border-luxury-border">
            Loading queue buffer...
          </div>
        ) : queuedBlogs.length === 0 ? (
          <div className="py-16 text-center space-y-3 p-8 bg-luxury-card border border-luxury-border">
            <p className="font-editorial-serif text-xl text-luxury-text">The Queue is Currently Empty</p>
            <p className="text-xs text-luxury-muted max-w-md mx-auto leading-relaxed">
              Paste your first product dump into the ingestion box above. Once queued, our automated system will release one post every morning at 9:00 AM IST.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {queuedBlogs.map((blog, idx) => {
              const dateAdded = new Date(blog.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })

              const releaseOrderText =
                idx === 0
                  ? '⚡ Position #1 (Next in line · Scheduled for tomorrow morning)'
                  : `Position #${idx + 1} (Scheduled for Day +${idx + 1})`

              return (
                <div
                  key={blog.id}
                  className="bg-white dark:bg-luxury-card border border-luxury-border p-5 sm:p-6 space-y-4 hover:border-luxury-accent/60 transition-colors shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-luxury-border/40 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-sm border ${
                        idx === 0
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60 font-semibold'
                          : 'bg-luxury-highlight text-luxury-muted border-luxury-border'
                      }`}>
                        {releaseOrderText}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-luxury-subtle">
                      <span>Queued {dateAdded}</span>
                      <span>&middot;</span>
                      <span className="truncate max-w-[200px]">/blogs/{blog.slug}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-editorial-serif text-xl sm:text-2xl text-luxury-text font-normal">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="text-xs sm:text-sm text-luxury-muted font-light leading-relaxed max-w-3xl">
                        {blog.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-luxury-border/40 font-mono text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPreviewBlog(blog)}
                        className="px-3 py-1.5 border border-luxury-border hover:border-luxury-accent bg-luxury-highlight text-luxury-text transition-colors"
                      >
                        Preview Draft ↗
                      </button>

                      <Link
                        href={`/admin/blogs/${blog.id}`}
                        className="px-3 py-1.5 border border-luxury-border hover:border-luxury-text text-luxury-muted hover:text-luxury-text transition-colors"
                      >
                        Edit in Studio
                      </Link>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handlePublishNow(blog)}
                        className="px-4 py-1.5 bg-luxury-black text-white hover:bg-luxury-accent transition-colors uppercase tracking-wider text-[11px]"
                        title="Skip queue and publish to live site right now"
                      >
                        Publish Now ↗
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(blog)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 underline text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Preview Modal */}
      {previewBlog && (
        <BlogPreviewModal
          isOpen={!!previewBlog}
          onClose={() => setPreviewBlog(null)}
          blogData={previewBlog}
        />
      )}

    </div>
  )
}
