'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

export default function PageViewTracker({ eventType = 'page_view', productId = null }) {
  useEffect(() => {
    trackEvent({
      eventType,
      productId
    })
  }, [eventType, productId])

  return null
}
