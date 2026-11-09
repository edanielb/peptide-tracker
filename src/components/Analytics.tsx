import { useEffect } from 'react'

const GA_MEASUREMENT_ID = 'G-1Y9DHZCNPP'

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

/**
 * Sends a custom event to Google Analytics.
 * Use this anywhere in the app to track user interactions.
 *
 * Example:
 *   trackEvent('search_used', { search_term: 'BPC-157' })
 *   trackEvent('submit_report_clicked')
 *   trackEvent('filter_clicked', { filter_type: 'peptide_type' })
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }
}

/**
 * Analytics component — mount once at the top of your app.
 * Fires a page_view event on initial load and whenever the URL changes.
 */
export default function Analytics() {
  useEffect(() => {
    const sendPageView = () => {
      if (typeof window.gtag === 'function') {
        window.gtag('config', GA_MEASUREMENT_ID, {
          page_path: window.location.pathname + window.location.search,
          page_title: document.title,
        })
      }
    }

    // Fire on mount
    sendPageView()

    // Listen for client-side navigation (works with React Router history API)
    const originalPushState = history.pushState.bind(history)
    const originalReplaceState = history.replaceState.bind(history)

    history.pushState = (...args) => {
      originalPushState(...args)
      sendPageView()
    }

    history.replaceState = (...args) => {
      originalReplaceState(...args)
      sendPageView()
    }

    window.addEventListener('popstate', sendPageView)

    return () => {
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
      window.removeEventListener('popstate', sendPageView)
    }
  }, [])

  return null
}
