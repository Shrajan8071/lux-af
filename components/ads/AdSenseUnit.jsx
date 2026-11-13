'use client'

import { useEffect } from 'react'

export default function AdSenseUnit({ clientId, slotId, enabled = false }) {
  // If not enabled or IDs not set, return null (strictly zero placeholder, zero empty space)
  if (!enabled || !clientId || !slotId) {
    return null
  }

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({})
      }
    } catch (e) {
      // Graceful error handling if ad blocker active
    }
  }, [clientId, slotId])

  return (
    <aside
      aria-label="Sponsored Content"
      className="my-16 max-w-4xl mx-auto px-4 text-center border-t border-b border-luxury-border/40 py-6"
    >
      <div className="text-[10px] uppercase tracking-widest text-luxury-subtle font-mono mb-3">
        Advertisement
      </div>
      <div className="overflow-hidden flex justify-center items-center min-h-[90px]">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minWidth: '300px', width: '100%' }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  )
}
