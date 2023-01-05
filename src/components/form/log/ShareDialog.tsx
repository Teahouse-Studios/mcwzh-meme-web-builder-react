import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material'
import { useRef } from 'react'
import { Close, ContentCopy, ShareVariant } from 'mdi-material-ui'
import { useTranslation } from 'react-i18next'
import { useSnackbar } from 'notistack'
import type { SchemaType } from '../types'
import { base64ArrayBuffer } from './base64ArrayBuffer'
import { BrotliWasmType } from 'brotli-wasm'
import allowTracking from '../../../tracking'

interface ShareDialogProps {
  open: boolean
  onClose: () => void
  file: string
  params: Partial<SchemaType>
  brotli: BrotliWasmType
}

export default function ShareDialog(props: ShareDialogProps) {
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()
  const brCompressed = base64ArrayBuffer(
    props.brotli.compress(
      new TextEncoder().encode(JSON.stringify(props.params)),
      {
        quality: 11,
      },
    ),
  )
  const hash = encodeURI(
    `${location.origin}${location.pathname}#br=${brCompressed}`,
  )
  const noShare = !navigator.share as boolean
  const shareUrl = async (url: string, expires = false) => {
    if (allowTracking) window.gtag('event', 'share')
    try {
      await navigator.share({
        title: '梗体中文构建配置分享',
        text: `你的好友给你分享了 ta 他的梗体中文！${
          expires ? '此链接 7 日内有效：' : ''
        }`,
        url: url,
      })
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        throw err
      }
    }
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="md">
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {t('log.share')}
        <IconButton
          size="small"
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={props.onClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pb: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
            {t('log.shareDialog.download.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {t('log.shareDialog.download.desc')}
          </Typography>
          <ShareLinkField value={props.file} />
          <List>
            <ShareActionItem
              icon={ContentCopy}
              text={{
                primary: t('log.shareDialog.file.copy.primary'),
              }}
              onClick={() => {
                void navigator.clipboard.writeText(props.file)
                enqueueSnackbar(t('log.shareDialog.copiedToClipboard'))
              }}
            />
            <ShareActionItem
              icon={ShareVariant}
              text={{
                primary: t('log.shareDialog.file.share.primary'),
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                secondary: t('log.shareDialog.file.share.secondary') as string,
              }}
              unsupported={noShare}
              onClick={() => {
                void shareUrl(props.file)
              }}
            />
          </List>
        </Box>

        <Box>
          <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
            {t('log.shareDialog.config.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {t('log.shareDialog.config.desc')}
          </Typography>
          <ShareLinkField value={hash} />
          <List>
            <ShareActionItem
              icon={ContentCopy}
              text={{
                primary: t('log.shareDialog.file.copy.primary'),
              }}
              onClick={() => {
                void navigator.clipboard.writeText(hash)
                enqueueSnackbar(t('log.shareDialog.copiedToClipboard'))
              }}
            />
            <ShareActionItem
              icon={ShareVariant}
              text={{
                primary: t('log.shareDialog.file.share.primary'),
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                secondary: t('log.shareDialog.file.share.secondary') as string,
              }}
              unsupported={noShare}
              onClick={() => {
                void shareUrl(hash)
              }}
            />
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

interface ShareActionItemProps {
  icon: typeof SvgIcon
  text: {
    primary: string
    secondary?: string
  }
  unsupported?: boolean
  onClick: () => void
}

function ShareActionItem(props: ShareActionItemProps) {
  return (
    <ListItemButton disabled={props.unsupported} onClick={props.onClick}>
      <ListItemAvatar>
        <Avatar>
          <props.icon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText {...props.text} />
    </ListItemButton>
  )
}

interface ShareLinkFieldProps {
  value: string
}

function ShareLinkField(props: ShareLinkFieldProps) {
  const inputRef = useRef<HTMLInputElement>()
  return (
    <TextField
      sx={{ width: '100%' }}
      variant="standard"
      value={props.value}
      onClick={() => inputRef.current?.select()}
      inputRef={inputRef}
      InputProps={{
        readOnly: true,
      }}
    />
  )
}
