import { NextResponse } from 'next/server'
import { getProductById, recordEvent } from '@/lib/supabase/data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request, { params }) {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const product = await getProductById(id)
    if (!product || !product.affiliate_url) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Validate and normalize outbound URL
    let targetUrl = product.affiliate_url.trim()
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl
    }

    let parsedUrl
    try {
      parsedUrl = new URL(targetUrl)
    } catch {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Strictly ensure only http and https protocols are followed
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Record the affiliate buy button click event
    try {
      const sessionId = request.cookies.get('mo_anon_session')?.value || 'redirect-session'
      const referrer = request.headers.get('referer') || null
      await recordEvent({
        eventType: 'buy_button_click',
        productId: product.id,
        sessionId,
        referrer
      })
    } catch (e) {
      // Never let analytics failure prevent user redirection
    }

    // Fast 302 temporary redirect to the retailer affiliate destination with explicit no-cache
    const response = NextResponse.redirect(parsedUrl.toString(), 302)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  } catch (error) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}
