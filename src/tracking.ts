const allowTracking =
  window.location.host === 'meme.teahouse.team' ||
  window.location.host === 'meme.wd-ljt.com'
    ? true
    : false

export default allowTracking

import { replayIntegration } from '@sentry/react'
import type { Metric } from 'web-vitals'

export async function tracking() {
  const { init, browserTracingIntegration } = await import('@sentry/react')
  const { onLCP, onINP, onCLS } = await import('web-vitals')

  if (allowTracking) {
    onCLS(sendToGoogleAnalytics)
    onINP(sendToGoogleAnalytics)
    onLCP(sendToGoogleAnalytics)

    init({
      dsn: 'https://7d9348af05c34b97b4db4bbbf2411d29@o417398.ingest.sentry.io/6451320',
      integrations: [browserTracingIntegration(), replayIntegration()],

      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate: 0.3,
    })
  }

  function sendToGoogleAnalytics({ name, delta, value, id }: Metric) {
    // Assumes the global `gtag()` function exists, see:
    // https://developers.google.com/analytics/devguides/collection/ga4
    gtag('event', name, {
      value: delta,
      metric_id: id,
      metric_value: value,
      metric_delta: delta,
    })
  }
}
