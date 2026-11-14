'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

export default function PageViewTracker({ eventType = 'page_view', productId = null, path = null }) {
  useEffect(() => {
    trackEvent({
      eventType,
      productId,
      path
    })
  }, [eventType, productId, path])

  return null
}
