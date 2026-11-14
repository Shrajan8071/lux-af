'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function AdminBlogsPage() {
  const searchParams = useSearchParams()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionMessage, setActionMessage] = useState(null)
  const [deleteModalBlog, setDeleteModalBlog] = useState(null)

  useEffect(() => {
    const saved = searchParams.get('saved')
    if (saved === 'created') {
      setActionMessage('✓ New blog post drafted successfully and added to the editorial archive.')
    } else if (saved === 'updated') {
      setActionMessage('✓ Blog post changes saved successfully and updated live.')
    }
    loadBlogs()
  }, [searchParams])

  const loadBlogs = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/blogs')
      const data = await res.json()
      if (data.success && Array.isArray(data.blogs)) {
        setBlogs(data.blogs)
      }
    } catch (err) {
      console.error('Failed to load blogs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (blog) => {
    const newStatus = blog.status === 'published' ? 'draft' : 'published'
    try {
      const res = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...blog,
          status: newStatus
        })
      })
      const data = await res.json()
      if (data.success) {
        setBlogs(prev =>
          prev.map(b => (b.id === blog.id ? { ...b, status: newStatus } : b))
        )
        setActionMessage(
          `✓ Blog "${blog.title}" is now ${newStatus === 'published' ? 'Published (Live)' : 'Saved as Draft (Private)'}.`
        )
      }
    } catch (err) {
      alert('Failed to update blog status.')
    }
  }

  const handleDelete = async () => {
    if (!deleteModalBlog) return
    try {
      const res = await fetch(`/api/admin/blogs/${deleteModalBlog.id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        setBlogs(prev => prev.filter(b => b.id !== deleteModalBlog.id))
        setActionMessage(`✓ Blog "${deleteModalBlog.title}" permanently removed.`)
        setDeleteModalBlog(null)
      } else {
        alert(data.error || 'Failed to delete blog post.')
      }
    } catch (err) {
      alert('Error during blog deletion.')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header & New Blog CTA */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-luxury-border/60">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-luxury-accent block mb-1">
              Editorial Journal Management
            </span>
            <h1 className="font-editorial-serif text-3xl sm:text-4xl text-luxury-text font-normal">
              Blog Dispatches &amp; Essays
            </h1>
            <p className="text-xs text-luxury-muted mt-1">
              Write, polish with Gemini AI, preview, and publish reflective long-form essays, hardware notes, and video commentary.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Link
              href="/admin/blogs/queue"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-luxury-accent/60 bg-luxury-highlight hover:bg-luxury-card text-luxury-text text-xs uppercase tracking-widest font-mono transition-colors shadow-sm"
            >
              <span className="text-luxury-accent font-bold">✦</span>
              <span>Auto Queue Drafter</span>
            </Link>

            <Link
              href="/admin/blogs/new"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-luxury-black text-white hover:bg-luxury-accent transition-colors text-xs uppercase tracking-widest font-mono shadow-sm"
            >
              <span>+ Write New Blog</span>
            </Link>
          </div>
        </div>

        {/* Action Notification */}
        {actionMessage && (
          <div className="p-3 bg-[#FAF6EE] dark:bg-luxury-card border border-[#E3D9C4] dark:border-luxury-accent/50 text-xs font-mono text-luxury-text flex items-center justify-between shadow-sm">
            <span className="flex items-center gap-2">
              <span className="text-luxury-accent font-bold">✦</span>
              <span>{actionMessage}</span>
            </span>
            <button onClick={() => setActionMessage(null)} className="text-luxury-muted hover:text-luxury-text ml-4 font-mono">✕</button>
          </div>
        )}

        {/* Blogs Presentation */}
        <div className="bg-white dark:bg-luxury-card border border-luxury-border shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center font-mono text-xs text-luxury-muted">
              Loading editorial dispatches...
            </div>
          ) : blogs.length === 0 ? (
            <div className="py-20 text-center space-y-4 p-6">
              <p className="font-editorial-serif text-xl text-luxury-text">No blogs in archive</p>
              <p className="text-xs text-luxury-muted max-w-sm mx-auto">
                Get started by drafting your first long-form essay or field note with Gemini-assisted professional rephrasing.
              </p>
              <Link
                href="/admin/blogs/new"
                className="inline-block mt-2 px-5 py-2.5 bg-luxury-black text-white text-xs font-mono uppercase tracking-wider hover:bg-luxury-accent transition-colors shadow-sm"
              >
                Write First Blog
              </Link>
            </div>
          ) : (
            <>
              {/* Mobile Card List (< sm viewports) */}
              <div className="block sm:hidden divide-y divide-luxury-border/60">
                {blogs.map((item) => {
                  const isPublished = item.status === 'published'
                  const displayDate = new Date(item.published_at || item.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })

                  return (
                    <div key={item.id} className="p-4 space-y-3 bg-luxury-card">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] text-luxury-accent font-medium">
                          /{item.slug}
                        </span>
                        <button
                          onClick={() => handleToggleStatus(item)}
                          className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-sm border ${
                            item.status === 'published'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                              : item.status === 'queued'
                              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60'
                              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                          }`}
                        >
                          {item.status === 'published' ? '● Published' : item.status === 'queued' ? '⏳ Queued' : '○ Draft'}
                        </button>
                      </div>

                      <h4 className="font-editorial-serif text-base text-luxury-text font-normal">
                        {item.title}
                      </h4>

                      {item.excerpt && (
                        <p className="text-xs text-luxury-muted line-clamp-2 font-light">
                          {item.excerpt}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] font-mono text-luxury-subtle">
                        <span>{displayDate}</span>
                        {item.image_path && <span>📷 Photo</span>}
                        {item.video_url && <span>▶ Video</span>}
                        {item.external_link && <span>↗ Link</span>}
                      </div>

                      {/* Touch Action Buttons */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-luxury-border/30 font-mono text-xs">
                        {isPublished ? (
                          <Link
                            href={`/blogs/${item.slug}`}
                            target="_blank"
                            className="flex items-center justify-center min-h-[44px] bg-[#FAF9F6] dark:bg-luxury-highlight border border-luxury-border text-luxury-muted hover:text-luxury-text text-center"
                          >
                            View ↗
                          </Link>
                        ) : (
                          <span className="flex items-center justify-center min-h-[44px] bg-luxury-bg/50 border border-luxury-border/40 text-luxury-subtle/50 text-center cursor-not-allowed">
                            Draft
                          </span>
                        )}
                        <Link
                          href={`/admin/blogs/${item.id}`}
                          className="flex items-center justify-center min-h-[44px] bg-[#FAF9F6] dark:bg-luxury-highlight border border-luxury-border text-luxury-text hover:border-luxury-accent font-medium text-center"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteModalBlog(item)}
                          className="flex items-center justify-center min-h-[44px] bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-400 hover:text-red-900 text-center"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Desktop Table (>= sm viewports) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-luxury-border bg-[#FAF9F6] dark:bg-luxury-highlight font-mono uppercase tracking-wider text-[10px] text-luxury-subtle">
                      <th className="py-3 px-5">Title &amp; Excerpt</th>
                      <th className="py-3 px-4">Slug / Route</th>
                      <th className="py-3 px-4">Media &amp; Links</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-luxury-border/60">
                    {blogs.map((item) => {
                      const isPublished = item.status === 'published'
                      const displayDate = new Date(item.published_at || item.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })

                      return (
                        <tr key={item.id} className="hover:bg-[#FAF9F6]/80 dark:hover:bg-luxury-highlight/50 transition-colors">
                          <td className="py-3.5 px-5">
                            <h4 className="font-editorial-serif text-sm text-luxury-text font-normal max-w-sm truncate">
                              {item.title}
                            </h4>
                            {item.excerpt && (
                              <p className="text-[11px] text-luxury-muted font-light truncate max-w-sm mt-0.5">
                                {item.excerpt}
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-luxury-muted whitespace-nowrap">
                            /blogs/{item.slug}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-luxury-subtle space-x-2 whitespace-nowrap">
                            {item.image_path ? <span title="Has photo">📷 Photo</span> : <span className="opacity-30">—</span>}
                            {item.video_url ? <span title="Has video">▶ Video</span> : null}
                            {item.external_link ? <span title="Has external link">↗ Ref</span> : null}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-luxury-muted whitespace-nowrap">
                            {displayDate}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleStatus(item)}
                              className={`inline-flex items-center px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-sm transition-colors border ${
                                item.status === 'published'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100'
                                  : item.status === 'queued'
                                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100'
                                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 hover:bg-amber-100'
                              }`}
                              title="Click to toggle status"
                            >
                              {item.status === 'published' ? '● Published' : item.status === 'queued' ? '⏳ Queued' : '○ Draft'}
                            </button>
                          </td>
                          <td className="py-3.5 px-5 text-right space-x-3 font-mono text-[11px] whitespace-nowrap">
                            {isPublished && (
                              <Link
                                href={`/blogs/${item.slug}`}
                                target="_blank"
                                className="text-luxury-muted hover:text-luxury-text underline"
                              >
                                View ↗
                              </Link>
                            )}
                            <Link
                              href={`/admin/blogs/${item.id}`}
                              className="text-luxury-text hover:text-luxury-accent font-medium underline"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => setDeleteModalBlog(item)}
                              className="text-red-700 dark:text-red-400 hover:text-red-900 underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

      {/* Delete Confirmation Modal */}
      {deleteModalBlog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-luxury-card border border-luxury-border max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-editorial-serif text-xl text-luxury-text">
              Confirm Blog Post Deletion
            </h3>
            <p className="text-xs text-luxury-muted leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-luxury-text">"{deleteModalBlog.title}"</strong>?
            </p>
            <div className="bg-[#FAF8F5] dark:bg-luxury-highlight p-3 text-[11px] font-mono text-luxury-subtle border border-luxury-border/60">
              Note: This action cannot be reversed. Any bookmarks or incoming links to /blogs/{deleteModalBlog.slug} will return a 404.
            </div>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeleteModalBlog(null)}
                className="px-4 py-2 border border-luxury-border text-xs font-mono text-luxury-muted hover:text-luxury-text hover:bg-luxury-highlight transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-700 text-white text-xs font-mono uppercase tracking-wider hover:bg-red-800 transition-colors shadow-sm"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
