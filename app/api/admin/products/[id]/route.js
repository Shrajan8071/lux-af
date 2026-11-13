import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getProductById, updateProduct, deleteProduct } from '@/lib/supabase/data'

export async function GET(request, { params }) {
  try {
    const { id } = params
    const product = await getProductById(id)
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, product })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()

    // Validate URL if affiliate_url is being updated
    if (body.affiliate_url) {
      try {
        const parsed = new URL(body.affiliate_url)
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw new Error()
      } catch {
        return NextResponse.json({ success: false, error: 'Invalid affiliate URL' }, { status: 400 })
      }
    }

    const result = await updateProduct(id, body)
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

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const result = await deleteProduct(id)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
