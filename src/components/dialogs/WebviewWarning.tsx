import { useState } from 'react'
import {
  Dialog,
  AppBar,
  Toolbar,
  Typography,
  useTheme,
  Container,
  Box,
  Button,
} from '@mui/material'
import {
  Alert as AlertIcon,
  Bug,
  Close,
} from '@teahouse-studios/mdi-material-ui'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/react'

export default function WebviewWarning() {
  const { t } = useTranslation()
  const theme = useTheme()

  let dialog = false
  let provider: string | undefined

  if (navigator.userAgent.includes('MicroMessenger/')) {
    dialog = true
    provider = 'WeChat'
  } else if (navigator.userAgent.includes('QQ/')) {
    dialog = true
    provider = 'QQ'
  } else if (navigator.userAgent.includes('BiliApp/')) {
    dialog = true
    provider = 'BiliApp'
  }

  const [dialogOpen, setDialogOpen] = useState(dialog)

  return (
    <Dialog fullScreen open={dialogOpen}>
      <AppBar
        color="default"
        position="sticky"
        sx={{ mb: 4, position: 'relative' }}
        css={css`
          background-color: ${theme.palette.background.paper};
        `}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            啊这！
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box
          sx={{
            textAlign: 'center',
            py: 2,
          }}
        >
          <AlertIcon color="error" fontSize="large" sx={{ mb: 1 }} />
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            您被困在了第三方 App 的世界里。
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            梗中在线构建在第三方 App 的内置浏览器中会出现
            <strong>无法正常下载</strong>
            的情况。请使用<strong>其他浏览器</strong>打开在线构建。
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            请点击右上角的“更多” → “浏览器打开”以进一步操作。
          </Typography>
          <Box sx={{ mb: 1 }}>
            <Button
              variant="text"
              color="primary"
              onClick={() => setDialogOpen(false)}
              startIcon={<Close />}
              sx={{ mr: 1 }}
            >
              {t('form.fetchListFailed.ignore')}
            </Button>
            <Button
              variant="text"
              color="error"
              href="https://github.com/Teahouse-Studios/mcwzh-meme-web-builder/issues/new/choose"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<Bug />}
              sx={{ mr: 1 }}
            >
              {t('form.fetchListFailed.feedback')}
            </Button>
          </Box>
          <Typography variant="caption" sx={{ mb: 1, color: 'text.secondary' }}>
            Provider: {provider ?? '[NONE]'} | UA: {navigator.userAgent}
          </Typography>
        </Box>
      </Container>
    </Dialog>
  )
}
