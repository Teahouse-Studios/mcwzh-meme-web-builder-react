import { Button, type ButtonProps } from '@mui/material'
import { useAd } from '../../hooks/useAd'
import { Heart } from '@teahouse-studios/mdi-material-ui'
import { useTranslation } from 'react-i18next'

export default function SponsorButton(props: ButtonProps<'a'>) {
  const { adAccepted } = useAd()
  const { t } = useTranslation()
  return (
    <Button
      className="donate-button"
      startIcon={<Heart />}
      color="error"
      href="https://afdian.com/@teahouse"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        adAccepted()
      }}
      {...props}
    >
      {t('footer.donate')}
    </Button>
  )
}
