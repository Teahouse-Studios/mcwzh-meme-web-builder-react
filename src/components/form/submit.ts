import endpoint from '../../api'
import allowTracking from '../../tracking'
import type { BuildLog } from './types'
import { z } from 'zod'
import { schema } from './types'

export default async function submit(
  platform: 'java' | 'bedrock',
  body: unknown,
  addLog: (log: BuildLog) => void,
  share: Partial<z.infer<typeof schema>>,
) {
  if (allowTracking)
    window.gtag('event', 'build', {
      eventType: { java: 'je', bedrock: 'be' }[platform],
    })

  interface Data {
    logs: string
    root: string
    filename: string
    size: number
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
      for (const [key, value] of Object.entries(share)) {
        if (Array.isArray(value) && value.length === 0) {
          // @ts-expect-error weird type error
          share[key] = ['!!!EMPTY']
        }
      }
      addLog({
        status: 'success',
        platform: platform,
        log: data.logs,
        downloadUrl: data.root + data.filename,
        size: data.size,
        time: Date.now(),
        expanded: true,
        share,
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
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (navigator.vibrate) {
    navigator.vibrate(300)
  }
}
