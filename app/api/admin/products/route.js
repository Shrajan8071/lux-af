import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getAllProductsAdmin, createProduct } from '@/lib/supabase/data'

export async function GET() {
  try {
    const products = await getAllProductsAdmin()
    return NextResponse.json({ success: true, products })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { title, description, price, currency, rating, my_take, affiliate_url, image_path, source_content, status, video_url } = body

    if (!title || !description || !price || !rating || !affiliate_url || !image_path) {
      return NextResponse.json(
        { success: false, error: 'All primary fields (title, description, price, rating, affiliate URL, image) are required.' },
        { status: 400 }
      )
    }

    // Validate affiliate URL
    try {
      const parsedUrl = new URL(affiliate_url)
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        throw new Error()
      }
    } catch {
      return NextResponse.json({ success: false, error: 'Affiliate URL must be a valid http/https URL.' }, { status: 400 })
    }

    const result = await createProduct({
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      currency: currency || 'INR',
      rating: parseFloat(rating),
      my_take: my_take ? my_take.trim() : '',
      affiliate_url: affiliate_url.trim(),
      image_path: image_path.trim(),
      source_content: source_content ? source_content.trim() : null,
      video_url: video_url ? video_url.trim() : null,
      status: status || 'draft'
    })

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    try {
      revalidatePath('/')
      if (result.data?.article_number) {
        revalidatePath(`/article/${result.data.article_number}`)
      }
    } catch (e) {}

    return NextResponse.json({ success: true, product: result.data })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
