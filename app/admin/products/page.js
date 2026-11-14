'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import ContainImage from '@/components/product/ContainImage'

export default function AdminProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteModalProduct, setDeleteModalProduct] = useState(null)
  const [actionMessage, setActionMessage] = useState(null)

  useEffect(() => {
    const saved = searchParams.get('saved')
    if (saved === 'created') {
      setActionMessage('✓ New editorial object successfully created and added to archive.')
      router.replace('/admin/products')
    } else if (saved === 'updated') {
      setActionMessage('✓ Product changes saved successfully and live across the catalogue.')
      router.replace('/admin/products')
    }
  }, [searchParams, router])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || [])
      }
    } catch (e) {
      console.error('Error fetching products:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleToggleStatus = async (product) => {
    const newStatus = product.status === 'published' ? 'draft' : 'published'
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        setActionMessage(`Status updated to ${newStatus}`)
        setTimeout(() => setActionMessage(null), 3000)
        fetchProducts()
      }
    } catch (e) {
      console.error('Error updating status:', e)
    }
  }

  const handleDelete = async () => {
    if (!deleteModalProduct) return
    try {
      const res = await fetch(`/api/admin/products/${deleteModalProduct.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setActionMessage(`Product No. ${deleteModalProduct.article_number} removed. Analytics retained.`)
        setTimeout(() => setActionMessage(null), 4000)
        setDeleteModalProduct(null)
        fetchProducts()
      }
    } catch (e) {
      console.error('Error deleting product:', e)
    }
  }

  return (
    <div className="space-y-8">
      
      {/* Title & Add Product Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxury-border/80 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-mono text-luxury-accent block mb-1">
            Catalogue Management
          </span>
          <h1 className="font-editorial-serif text-3xl sm:text-4xl text-luxury-text font-normal">
            Objects Archive
          </h1>
          <p className="text-xs text-luxury-muted mt-1">
            Review, edit, publish, draft or remove editorial catalogue objects.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 bg-luxury-black text-white hover:bg-luxury-accent transition-colors text-xs uppercase tracking-widest font-mono shrink-0 w-full sm:w-auto"
        >
          <span>+ Add New Object</span>
        </Link>
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

      {/* Products Presentation */}
      <div className="bg-white border border-luxury-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center font-mono text-xs text-luxury-muted">
            Loading archive objects...
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center space-y-4 p-6">
            <p className="font-editorial-serif text-xl text-luxury-text">No products in catalogue</p>
            <p className="text-xs text-luxury-muted max-w-sm mx-auto">
              Get started by creating your first editorial discovery item using the Gemini-assisted creation workflow.
            </p>
            <Link
              href="/admin/products/new"
              className="inline-block mt-2 px-4 py-2.5 bg-luxury-black text-white text-xs font-mono uppercase tracking-wider"
            >
              Add First Product
            </Link>
          </div>
        ) : (
          <>
            {/* 1. Mobile Card List (< sm viewports) */}
            <div className="block sm:hidden divide-y divide-luxury-border/60">
              {products.map((item) => {
                const isPublished = item.status === 'published'
                const displayCurrency = item.currency === 'INR' ? '₹' : item.currency
                return (
                  <div key={item.id} className="p-4 space-y-3">
                    <div className="flex gap-3">
                      <div className="w-14 h-16 border border-luxury-border/60 bg-[#F6F3EC] overflow-hidden shrink-0">
                        <ContainImage src={item.image_path} alt={item.title} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] text-luxury-accent font-medium">
                            No. {item.article_number}
                          </span>
                          <button
                            onClick={() => handleToggleStatus(item)}
                            className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-sm border ${
                              isPublished
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                            }`}
                          >
                            {isPublished ? '● Published' : '○ Draft'}
                          </button>
                        </div>
                        <h4 className="font-editorial-serif text-sm text-luxury-text font-normal truncate mt-0.5">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-xs font-mono text-luxury-muted">
                          <span>{displayCurrency} {Number(item.price).toLocaleString()}</span>
                          <span>★ {Number(item.rating).toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Touch-Friendly Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-luxury-border/30 font-mono text-xs">
                      {isPublished ? (
                        <Link
                          href={`/article/${item.article_number}`}
                          target="_blank"
                          className="flex items-center justify-center min-h-[44px] bg-[#FAF9F6] border border-luxury-border text-luxury-muted hover:text-luxury-text text-center"
                        >
                          View ↗
                        </Link>
                      ) : (
                        <div className="flex items-center justify-center min-h-[44px] bg-gray-50 border border-gray-200 text-gray-400 text-[10px] uppercase text-center">
                          Unpublished
                        </div>
                      )}
                      <Link
                        href={`/admin/products/${item.id}`}
                        className="flex items-center justify-center min-h-[44px] bg-[#FAF9F6] border border-luxury-border text-luxury-text hover:text-luxury-accent font-medium text-center"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteModalProduct(item)}
                        className="flex items-center justify-center min-h-[44px] bg-red-50 border border-red-200 text-red-700 hover:text-red-900 text-center"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 2. Tablet & Desktop Editorial Table (>= sm viewports) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-luxury-border bg-[#FAF9F6] font-mono uppercase tracking-wider text-[10px] text-luxury-subtle">
                    <th className="py-3 px-4 w-16">Image</th>
                    <th className="py-3 px-4 w-20">No.</th>
                    <th className="py-3 px-4">Title &amp; Reference</th>
                    <th className="py-3 px-4 w-28">Price</th>
                    <th className="py-3 px-4 w-20">Rating</th>
                    <th className="py-3 px-4 w-28">Status</th>
                    <th className="py-3 px-4 w-44 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-border/60">
                  {products.map((item) => {
                    const isPublished = item.status === 'published'
                    return (
                      <tr key={item.id} className="hover:bg-[#FAF9F6]/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="w-12 h-14 border border-luxury-border/60 bg-[#F6F3EC] overflow-hidden">
                            <ContainImage src={item.image_path} alt={item.title} />
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-luxury-accent">
                          {item.article_number}
                        </td>
                        <td className="py-3 px-4 min-w-[220px]">
                          <Link
                            href={`/admin/products/${item.id}`}
                            className="font-medium text-luxury-text hover:text-luxury-accent transition-colors block text-sm"
                          >
                            {item.title}
                          </Link>
                          <span className="text-[11px] text-luxury-muted font-mono truncate max-w-xs block mt-0.5">
                            {item.affiliate_url}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-luxury-text whitespace-nowrap">
                          {item.currency === 'INR' ? '₹' : item.currency} {Number(item.price).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-mono text-luxury-text whitespace-nowrap">
                          ★ {Number(item.rating).toFixed(1)}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleStatus(item)}
                            className={`inline-flex items-center px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-sm transition-colors border ${
                              isPublished
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100'
                                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 hover:bg-amber-100'
                            }`}
                            title="Click to toggle publish status"
                          >
                            {isPublished ? '● Published' : '○ Draft'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right space-x-3 font-mono text-[11px]">
                          {isPublished && (
                            <Link
                              href={`/article/${item.article_number}`}
                              target="_blank"
                              className="text-luxury-muted hover:text-luxury-text underline"
                            >
                              View
                            </Link>
                          )}
                          <Link
                            href={`/admin/products/${item.id}`}
                            className="text-luxury-text hover:text-luxury-accent font-medium underline"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => setDeleteModalProduct(item)}
                            className="text-red-700 hover:text-red-900 underline"
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
      {deleteModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-luxury-card border border-luxury-border max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-editorial-serif text-xl text-luxury-text">
              Confirm Object Deletion
            </h3>
            <p className="text-xs text-luxury-muted leading-relaxed">
              Are you sure you want to delete <strong className="text-luxury-text">"{deleteModalProduct.title}"</strong> (Article No. {deleteModalProduct.article_number})?
            </p>
            <div className="bg-[#FAF8F5] dark:bg-luxury-highlight p-3 text-[11px] font-mono text-luxury-subtle border border-luxury-border/60">
              Note: The article number will NOT be recycled to preserve canonical integrity. Historical on-site click events will be retained in aggregate.
            </div>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeleteModalProduct(null)}
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
