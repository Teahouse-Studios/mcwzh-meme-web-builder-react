const allowTracking =
  window.location.host === 'meme.teahouse.team' ||
  window.location.host === 'meme.wd-ljt.com'
    ? true
    : false

export default allowTracking

import type { Metric } from 'web-vitals'

export async function tracking() {
  const { init } = await import('@sentry/react')
  const { BrowserTracing } = await import('@sentry/tracing')
  const { getCLS, getFID, getLCP } = await import('web-vitals')

  if (allowTracking) {
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

    getCLS(sendToGoogleAnalytics)
    getFID(sendToGoogleAnalytics)
    getLCP(sendToGoogleAnalytics)

    init({
      dsn: 'https://7d9348af05c34b97b4db4bbbf2411d29@o417398.ingest.sentry.io/6451320',
      integrations: [new BrowserTracing()],

      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate: 0.3,
    })
  }
}
