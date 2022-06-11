import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
} from '@mui/material'
import { FormatQuoteOpen, Heart, MessageText } from 'mdi-material-ui'
import { useTranslation } from 'react-i18next'
import { useSnackbar } from 'notistack'
import type { Dispatch, SetStateAction } from 'react'
import { css } from '@emotion/react'
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
            '&:last-child': {
              pb: '16px',
            },
          }}
        >
          <Typography
            component="p"
            variant="caption"
            sx={{ mb: 1, color: 'text.secondary' }}
          >
            <MessageText
              fontSize="small"
              sx={{ verticalAlign: 'middle', mr: 1 }}
            ></MessageText>
            {t('sponsor.quoteAd.subtitle')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
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
                {t('sponsor.quoteAd.none')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('sponsor.quoteAd.author')}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mt: 2, mb: 1 }} />
          <Box sx={{ textAlign: 'center', maxWidth: '500px', mx: 'auto' }}>
            <Typography component="h2" variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t('sponsor.overline')}
            </Typography>
            <Typography variant="body1">{t('sponsor.thankYou')}</Typography>
            <a
              href="https://afdian.net/@teahouse"
              rel="noopener noreferer"
              target="_blank"
            >
              <img
                src="https://fe.wd-ljt.com/m3me/sP0ns0r5/sP0ns0r5.svg" // lol easylist
                alt="爱发电赞助者列表"
                css={css`
                  width: 100%;
                  height: auto;
                  margin: 0;
                `}
                loading="lazy"
              />
            </a>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="caption"
            component="p"
            sx={{ mt: 1, color: 'text.secondary' }}
          >
            {t('log.ad.donationNotice')}
            {t('sponsor.quoteAd.commercialWarning')}
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
        </CardContent>
      </Card>
    </>
  )
}
