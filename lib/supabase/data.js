import { createServerSupabaseClient } from './server'
import { createAdminClient } from './admin'
import { DEFAULT_SITE_SETTINGS } from '../sampleData'

function getSupabase() {
  return createAdminClient() || createServerSupabaseClient()
}

/**
 * Get published products for public catalogue (newest first, stable tie-breaker)
 */
export async function getPublishedProducts() {
  const supabase = getSupabase()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })

      if (!error && Array.isArray(data)) {
        return data
      }
    } catch (err) {
      console.warn('Supabase getPublishedProducts error:', err.message)
    }
  }
  return []
}

/**
 * Get single product by article number (e.g. 1001)
 */
export async function getProductByArticleNumber(articleNumber) {
  const num = parseInt(articleNumber, 10)
  if (isNaN(num)) return null

  const supabase = getSupabase()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('article_number', num)
        .eq('status', 'published')
        .single()

      if (!error && data) return data
    } catch (err) {
      console.warn('Supabase getProductByArticleNumber error:', err.message)
    }
  }

  return null
}

/**
 * Get single product by ID (for admin editing)
 */
export async function getProductById(id) {
  const supabase = getSupabase()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (!error && data) return data
    } catch (err) {
      console.warn('Supabase getProductById error:', err.message)
    }
  }

  return null
}

/**
 * Get all products for admin management (both drafts and published)
 */
export async function getAllProductsAdmin() {
  const supabase = getSupabase()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })

      if (!error && Array.isArray(data)) return data
    } catch (err) {
      console.warn('Supabase getAllProductsAdmin error:', err.message)
    }
  }

  return []
}

/**
 * Get site settings
 */
export async function getSiteSettings() {
  const supabase = getSupabase()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single()

      if (!error && data) return data
    } catch (err) {
      console.warn('Supabase getSiteSettings error:', err.message)
    }
  }

  return DEFAULT_SITE_SETTINGS
}

/**
 * Update site settings (Admin only)
 */
export async function updateSiteSettings(newSettings) {
  const supabase = getSupabase()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .update({
          ...newSettings,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1)
        .select()
        .single()

      if (!error && data) {
        return { success: true, data }
      }
      return { success: false, error: error?.message }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return { success: false, error: 'Database client unavailable' }
}

/**
 * Save new product
 */
export async function createProduct(productData) {
  const supabase = getSupabase()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          published_at: productData.status === 'published' ? new Date().toISOString() : null
        }])
        .select()
        .single()

      if (!error && data) {
        return { success: true, data }
      }
      return { success: false, error: error?.message }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return { success: false, error: 'Database client unavailable' }
}

/**
 * Update existing product
 */
export async function updateProduct(id, productData) {
  const supabase = getSupabase()
  if (supabase) {
    try {
      const payload = { ...productData }
      if (productData.status === 'published' && !productData.published_at) {
        payload.published_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

      if (!error && data) {
        return { success: true, data }
      }
      return { success: false, error: error?.message }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return { success: false, error: 'Database client unavailable' }
}

/**
 * Delete product
 */
export async function deleteProduct(id) {
  const supabase = getSupabase()
  if (supabase) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (!error) {
        return { success: true }
      }
      return { success: false, error: error?.message }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return { success: false, error: 'Database client unavailable' }
}

/**
 * Record analytics event
 */
export async function recordEvent({ eventType, productId, sessionId, referrer }) {
  if (!['page_view', 'product_view', 'product_card_click', 'buy_button_click'].includes(eventType)) {
    return { error: 'Invalid event type' }
  }

  const supabase = getSupabase()
  if (supabase) {
    try {
      await supabase.from('product_events').insert([{
        event_type: eventType,
        product_id: productId || null,
        session_id: sessionId || 'anonymous',
        referrer: referrer ? referrer.slice(0, 500) : null
      }])
    } catch (err) {
      console.warn('Analytics event insert error:', err.message)
    }
  }

  return { ok: true }
}

/**
 * Get analytics summary for admin dashboard
 */
export async function getAnalyticsSummary(timeRange = '30d') {
  const supabase = getSupabase()
  let events = []

  if (supabase) {
    try {
      let query = supabase.from('product_events').select('*')
      
      const now = new Date()
      if (timeRange === '7d') {
        const since = new Date(now.getTime() - 7 * 86400000).toISOString()
        query = query.gte('created_at', since)
      } else if (timeRange === '30d') {
        const since = new Date(now.getTime() - 30 * 86400000).toISOString()
        query = query.gte('created_at', since)
      }

      const { data, error } = await query
      if (!error && data) {
        events = data
      }
    } catch (err) {
      console.warn('Supabase analytics fetch error:', err.message)
    }
  }

  // Calculate metrics
  const totalPageViews = events.filter(e => e.event_type === 'page_view').length
  const uniqueSessions = new Set(events.map(e => e.session_id)).size
  const totalProductViews = events.filter(e => e.event_type === 'product_view').length
  const totalCardClicks = events.filter(e => e.event_type === 'product_card_click').length
  const totalAffiliateClicks = events.filter(e => e.event_type === 'buy_button_click').length

  const funnel = {
    visits: totalPageViews || (events.length > 0 ? 1 : 0),
    views: totalProductViews,
    clicks: totalAffiliateClicks,
    conversionToArticle: totalPageViews ? ((totalProductViews / totalPageViews) * 100).toFixed(1) : 0,
    conversionToAffiliate: totalProductViews ? ((totalAffiliateClicks / totalProductViews) * 100).toFixed(1) : 0,
  }

  const productClicksMap = {}
  const productViewsMap = {}

  events.forEach(e => {
    if (e.product_id) {
      if (e.event_type === 'buy_button_click') {
        productClicksMap[e.product_id] = (productClicksMap[e.product_id] || 0) + 1
      }
      if (e.event_type === 'product_view') {
        productViewsMap[e.product_id] = (productViewsMap[e.product_id] || 0) + 1
      }
    }
  })

  return {
    metrics: {
      pageViews: totalPageViews,
      uniqueVisitorsEstimate: uniqueSessions,
      productViews: totalProductViews,
      cardClicks: totalCardClicks,
      affiliateClicks: totalAffiliateClicks,
    },
    funnel,
    productClicksMap,
    productViewsMap,
    rawEventsCount: events.length
  }
}

/**
 * ---------------------------------------------------------------------------
 * BLOGS & EDITORIAL DISPATCHES DATA ACCESS
 * ---------------------------------------------------------------------------
 */

export async function getPublishedBlogs() {
  const supabase = getSupabase()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })

      if (!error && Array.isArray(data)) {
        return data
      }
    } catch (err) {
      console.warn('Supabase getPublishedBlogs error:', err.message)
    }
  }
  return []
}

export async function getBlogBySlug(slug) {
  if (!slug) return null
  const supabase = getSupabase()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (!error && data) return data
    } catch (err) {
      console.warn('Supabase getBlogBySlug error:', err.message)
    }
  }

  return null
}

export async function getBlogById(id) {
  if (!id) return null
  const supabase = getSupabase()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single()

      if (!error && data) return data
    } catch (err) {
      console.warn('Supabase getBlogById error:', err.message)
    }
  }

  return null
}

export async function getAllBlogsAdmin() {
  const supabase = getSupabase()
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })

      if (!error && Array.isArray(data)) {
        return data
      }
    } catch (err) {
      console.warn('Supabase getAllBlogsAdmin error:', err.message)
    }
  }

  return []
}

export async function createBlog(blogData) {
  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, error: 'Database client unavailable in preview mode' }
  }

  try {
    const payload = {
      slug: blogData.slug,
      title: blogData.title,
      excerpt: blogData.excerpt || null,
      content: blogData.content,
      image_path: blogData.image_path || null,
      video_url: blogData.video_url || null,
      external_link: blogData.external_link || null,
      external_link_label: blogData.external_link_label || 'Reference Resource',
      status: blogData.status || 'draft',
      published_at: blogData.status === 'published' ? new Date().toISOString() : null
    }

    const { data, error } = await supabase
      .from('blogs')
      .insert([payload])
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function updateBlog(id, blogData) {
  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, error: 'Database client unavailable in preview mode' }
  }

  try {
    const payload = {
      slug: blogData.slug,
      title: blogData.title,
      excerpt: blogData.excerpt || null,
      content: blogData.content,
      image_path: blogData.image_path || null,
      video_url: blogData.video_url || null,
      external_link: blogData.external_link || null,
      external_link_label: blogData.external_link_label || 'Reference Resource',
      status: blogData.status,
      updated_at: new Date().toISOString(),
    }

    if (blogData.status === 'published' && !blogData.published_at) {
      payload.published_at = new Date().toISOString()
    } else if (blogData.status === 'draft') {
      payload.published_at = null
    }

    const { data, error } = await supabase
      .from('blogs')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function deleteBlog(id) {
  const supabase = getSupabase()
  if (!supabase) {
    return { success: false, error: 'Database client unavailable in preview mode' }
  }

  try {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

