'use client'

/**
 * Privacy-preserving first-party client analytics.
 * Generates an anonymous random session identifier.
 * Collects zero personal data, performs zero device fingerprinting.
 */

function getAnonymousSessionId() {
  if (typeof window === 'undefined') return 'server'
  
  let sessionId = sessionStorage.getItem('mo_anon_session')
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36)
    try {
      sessionStorage.setItem('mo_anon_session', sessionId)
    } catch {
      // Ignore storage restrictions
    }
  }
  return sessionId
}

export function trackEvent({ eventType, productId = null, path = null, referrer = null }) {
  if (typeof window === 'undefined') return

  const sessionId = getAnonymousSessionId()

  // Track the visited path or external referrer to enable granular page and blog analytics
  let refValue = referrer
  if (!refValue) {
    if (path) {
      refValue = path
    } else if (typeof window !== 'undefined' && window.location && window.location.pathname) {
      refValue = window.location.pathname
    } else {
      refValue = document.referrer || null
    }
  }

  const payload = {
    eventType,
    productId,
    sessionId,
    referrer: refValue,
  }

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
      navigator.sendBeacon('/api/analytics/event', blob)
    } else {
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {})
    }
  } catch (err) {
    // Analytics failures must never interrupt user experience
  }
}
