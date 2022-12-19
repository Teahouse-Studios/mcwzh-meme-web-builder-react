import endpoint from '../api'
import allowTracking from '../tracking'
import type { BuildLog } from './types'

export default async function submit(
  platform: 'java' | 'bedrock',
  body: unknown,
  addLog: (log: BuildLog) => void,
) {
  if (allowTracking)
    window.gtag('event', 'build', {
      eventType: { java: 'je', bedrock: 'be' }[platform],
    })

  interface Data {
    logs: string
    root: string
    filename: string
  }
  try {
    const res = await fetch(`${endpoint}/v2/build/${platform}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = (await res.json()) as Data
    if (res.status === 200) {
      addLog({
        status: 'success',
        platform: platform,
        log: data.logs,
        downloadUrl: data.root + data.filename,
        time: Date.now(),
        expanded: true,
      })
    } else {
      addLog({
        status: 'error',
        platform: platform,
        log: data.logs,
        time: Date.now(),
        expanded: true,
      })
    }
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      addLog({
        status: 'error',
        platform: platform,
        log: `${error.name}: ${error.message}`,
        time: Date.now(),
        expanded: true,
      })
    } else if (typeof error === 'string') {
      addLog({
        status: 'error',
        platform: platform,
        log: error,
        time: Date.now(),
        expanded: true,
      })
    } else {
      addLog({
        status: 'error',
        platform: platform,
        log: 'Unknown error. Maybe check console?',
        time: Date.now(),
        expanded: true,
      })
    }
  }
}
