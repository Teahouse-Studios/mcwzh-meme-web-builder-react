import {
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  SvgIcon,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import {
  AccountCircleOutline,
  Cancel,
  Close,
  LockAlertOutline,
  Reload,
  ScaleBalance,
  Share,
  SourceFork,
  TextShort,
  Trademark,
} from 'mdi-material-ui'
import { ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'

export default function LicenseDialog(props: {
  open: boolean
  close: () => void
}) {
  const { t } = useTranslation()
  return (
    <Dialog maxWidth="md" open={props.open} onClose={() => props.close()}>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {t('license.title')}
        <IconButton
          size="small"
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={() => {
            props.close()
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pb: 3 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <Trans i18nKey={'license.tagline'}>
            嗨。作为梗体中文的作者，我们相信开放的环境一定能激发更好的创作。因此，我们支持并欢迎转载和二创。然而，我们也不得不用
            <Link
              href="https://creativecommons.org/licenses/by-sa/4.0/legalcode"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY-SA 4.0
            </Link>
            协议保护自己的权益。我们允许你：
          </Trans>
        </Typography>
        <Container sx={{ mb: 2 }}>
          <IconItem
            icon={Share}
            title={t('license.share')}
            text={t('license.shareDetail')}
          />
          <IconItem
            icon={SourceFork}
            title={t('license.remix')}
            text={t('license.remixDetail')}
          />
        </Container>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {t('license.revoke')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {t('license.caveat')}
        </Typography>
        <Container sx={{ mb: 2 }}>
          <IconItem
            icon={AccountCircleOutline}
            title={t('license.attribution')}
            text={t('license.attributionDetail')}
          />
          <IconItem
            icon={Reload}
            title={t('license.shareAlike')}
            text={t('license.shareAlikeDetail')}
          />
          <IconItem
            icon={Cancel}
            title={t('license.noRestrictions')}
            text={t('license.noRestrictionsDetail')}
          />
        </Container>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {t('license.disclaimer')}
        </Typography>
        <Container sx={{ mb: 2 }}>
          <IconItem
            icon={ScaleBalance}
            title={t('license.exceptions')}
            text={t('license.exceptionsDetail')}
          />
          <IconItem
            icon={LockAlertOutline}
            title={t('license.warranty')}
            text={t('license.warrantyDetail')}
          />
          <IconItem
            icon={Trademark}
            title={t('license.otherRights')}
            text={t('license.otherRightsDetail')}
          />
          <IconItem
            icon={TextShort}
            title={t('license.notSubstitute')}
            text={t('license.notSubstituteDetail')}
          />
        </Container>
      </DialogContent>
    </Dialog>
  )
}

function IconItem(props: {
  icon: typeof SvgIcon
  title: ReactNode
  text: ReactNode
}) {
  return (
    <Box sx={{ mb: 2, display: 'flex' }}>
      <props.icon
        sx={{
          width: '3rem',
          height: '3rem',
          mr: 1,
        }}
      />
      <Box>
        <Typography component="h3" variant="h5" sx={{ mb: 1 }}>
          {props.title}
        </Typography>
        <Typography variant="body1">{props.text}</Typography>
      </Box>
    </Box>
  )
}
