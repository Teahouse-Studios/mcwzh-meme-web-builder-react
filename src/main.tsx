import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

Sentry.init({
  dsn: 'https://7d9348af05c34b97b4db4bbbf2411d29@o417398.ingest.sentry.io/6451320',
  integrations: [new BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 0.3,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
