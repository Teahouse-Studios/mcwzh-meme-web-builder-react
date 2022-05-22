import { Alert } from '@mui/material'

export default async function DymanicAlerts() {
  await fetch(
    'https://fastly.jsdelivr.net/gh/Teahouse-Studios/mcwzh-meme-resourcepack@master/alerts.json'
  )

  return <></>
}
