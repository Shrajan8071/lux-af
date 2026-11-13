import { getPublishedProducts } from '@/lib/supabase/data'

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const products = await getPublishedProducts()

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/article/${product.article_number}`,
    lastModified: new Date(product.published_at || product.updated_at || product.created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...productUrls,
  ]
}
