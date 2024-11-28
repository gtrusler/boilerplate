import Plausible from '@plausible/tracker'
import type { AnalyticsEvent, EventProperties } from '@/types/analytics'

const config = {
  domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN!,
  apiHost: process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST!,
  trackLocalhost: process.env.NODE_ENV === 'development',
}

export const plausible = Plausible({
  domain: config.domain,
  apiHost: config.apiHost,
  trackLocalhost: config.trackLocalhost,
})

export function trackEvent(
  event: AnalyticsEvent,
  properties?: EventProperties
) {
  try {
    plausible.trackEvent(event, {
      props: {
        ...properties,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Analytics error:', error)
  }
} 