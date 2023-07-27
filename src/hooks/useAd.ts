import { useLocalStorage } from 'usehooks-ts'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'

export const AdType = {
  FirstTime: 0,
  Reconsider: 1,
  Renew: 2,
} as const

export interface AdStorage {
  shown: boolean
  lastShown: number
  clicked: boolean
}

export function useAd() {
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()
  const [adStorage, setAdStorage] = useLocalStorage('memeAd', {
    shown: false,
    lastShown: 0,
    clicked: false,
  })

  let shouldDisplayAd = false
  let adType: typeof AdType[keyof typeof AdType] = AdType.FirstTime

  if (!adStorage.shown) {
    adType = AdType.FirstTime
    shouldDisplayAd = true
  } else if (
    !adStorage.clicked &&
    Date.now() - adStorage.lastShown > 1000 * 60 * 60 * 24 * 7 // 7 days
  ) {
    shouldDisplayAd = true
    adType = AdType.Reconsider
  } else if (
    adStorage.clicked &&
    Date.now() - adStorage.lastShown > 1000 * 60 * 60 * 24 * 40 // 40 days
  ) {
    shouldDisplayAd = true
    adType = AdType.Renew
  }

  const adAccepted = () => {
    setAdStorage({
      shown: true,
      lastShown: Date.now(),
      clicked: true,
    })
    enqueueSnackbar(t('log.ad.donateSnackbar'), {
      autoHideDuration: 10000,
      variant: 'success',
    })
  }

  const adDismissed = () => {
    setAdStorage({
      shown: true,
      lastShown: Date.now(),
      clicked: false,
    })
    enqueueSnackbar(t('log.ad.dismissSnackbar'), {
      autoHideDuration: 10000,
      variant: 'info',
    })
  }

  return {
    adStorage,
    setAdStorage,
    shouldDisplayAd,
    adType,
    adAccepted,
    adDismissed,
  }
}
