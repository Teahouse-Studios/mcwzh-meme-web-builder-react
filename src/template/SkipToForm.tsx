import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

export default function SkipToForm() {
  const { t } = useTranslation()

  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={() => {
        document.querySelector('#form')?.scrollIntoView({ behavior: 'smooth' })
        location.href = '#form'
      }}
      sx={{
        top: -5,
        left: 5,
        position: 'absolute',
        transform: 'translateY(-100%)',
        '&:focus': { transform: 'translateY(0%)', top: 10 },
        zIndex: 1200,
      }}
    >
      {t('skipToForm')}
    </Button>
  )
}
