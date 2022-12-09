/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
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
        const form = document.querySelector('#form')

        const selectable = form?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) as HTMLButtonElement
        selectable.focus()
      }}
      sx={{
        top: 10,
        left: -5,
        position: 'absolute',
        transform: 'translateX(-100%)',
        '&:focus': { transform: 'translateX(0%)', left: 10 },
        zIndex: 1200,
      }}
    >
      {t('skipToForm')}
    </Button>
  )
}
