import { NextResponse } from 'next/server'
import { recordEvent } from '@/lib/supabase/data'

export async function POST(request) {
  try {
    const body = await request.json()
    const { eventType, productId, sessionId, referrer } = body

    if (!eventType || typeof eventType !== 'string') {
      return NextResponse.json({ error: 'Missing eventType' }, { status: 400 })
    }

    const validTypes = ['page_view', 'product_view', 'product_card_click', 'buy_button_click']
    if (!validTypes.includes(eventType)) {
      return NextResponse.json({ error: 'Invalid eventType' }, { status: 400 })
    }

    await recordEvent({
      eventType,
      productId: productId || null,
      sessionId: (sessionId || 'anon').slice(0, 64),
      referrer: referrer ? String(referrer).slice(0, 500) : null
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Event processing error' }, { status: 500 })
  }
}
