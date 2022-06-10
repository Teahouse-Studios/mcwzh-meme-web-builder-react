import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
} from '@mui/material'
import { FormatQuoteOpen, Heart } from 'mdi-material-ui'
import { useTranslation } from 'react-i18next'
import { useSnackbar } from 'notistack'
import type { Dispatch, SetStateAction } from 'react'
import { AdType } from './Form'

export default function QuoteAd({
  adLS,
  setLS,
  adSettings,
  setAdSettings,
}: {
  adLS: { shown: boolean; lastShown: number; clicked: boolean }
  setLS: Dispatch<SetStateAction<typeof adLS>>
  adSettings: {
    shouldDisplayAd: boolean
    adType: AdType
  }
  setAdSettings: Dispatch<SetStateAction<typeof adSettings>>
}) {
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()

  return (
    <>
      <Card sx={{ width: '100%' }}>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            '&:last-child': {
              pb: '16px',
            },
          }}
        >
          <Box sx={{ mb: 1, display: 'flex', opacity: 0.8, mr: 2 }}>
            <FormatQuoteOpen
              fontSize="large"
              sx={{ color: 'text.secondary' }}
            />
          </Box>
          <Box
            sx={{
              width: '100%',
            }}
          >
            <Typography variant="body1" sx={{ mb: 1 }}>
              {t('form.quote_ad.none')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('form.quote_ad.author')}
            </Typography>
            <Divider sx={{ mt: 2, mb: 1 }} />
            <Typography
              variant="caption"
              component="p"
              sx={{ mt: 1, color: 'text.secondary' }}
            >
              {t('log.ad.donationNotice')}
            </Typography>
            <Button
              className="donate-button"
              startIcon={<Heart />}
              color="error"
              href="https://afdian.net/@teahouse"
              target="_blank"
              rel="noreferer noopener"
              onClick={() => {
                setAdSettings((adSettings) => {
                  return { ...adSettings, shouldDisplayAd: false }
                })
                setLS({
                  shown: true,
                  lastShown: Date.now(),
                  clicked: true,
                })
                enqueueSnackbar(t('log.ad.donateSnackbar'), {
                  autoHideDuration: 10000,
                  variant: 'success',
                })
              }}
              sx={{ mr: 1 }}
            >
              {t('footer.donate')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}
