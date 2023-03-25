import { generalSplashes } from './splashData'

export default function Splash() {
  const target =
    generalSplashes[Math.floor(Math.random() * generalSplashes.length)]
  return <>{target}</>
}
