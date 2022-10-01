import {
  Alert,
  AlertTitle,
  Box,
  Typography,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  useTheme,
  IconButton,
  Tooltip,
  Link,
  AccordionActions,
} from '@mui/material'
import {
  CloseCircle,
  ChevronDown,
  Check,
  Download,
  Bug,
  ShareVariant,
  Heart,
  HeartBroken,
  Disc,
  HelpCircle,
  ContentCopy,
  Close,
  Copyright,
} from 'mdi-material-ui'
import {
  useState,
  Dispatch,
  SetStateAction,
  forwardRef,
  ForwardedRef,
  useRef,
} from 'react'
import { css } from '@emotion/react'
import { useSnackbar } from 'notistack'
import { Trans, useTranslation } from 'react-i18next'
import { AdType, CollapseTransition } from './Form'
import type { BuildLog } from './types'
import allowTracking from '../tracking'
import LicenseDialog from './LicenseDialog'

const LogAccordion = forwardRef(
  (
    {
      log,
      adLS,
      setLS,
      deleteSelf,
      adSettings,
      setAdSettings,
      setManualExpanded,
    }: {
      log: BuildLog
      adLS: { shown: boolean; lastShown: number; clicked: boolean }
      setLS: Dispatch<SetStateAction<typeof adLS>>
      deleteSelf: () => void
      adSettings: { shouldDisplayAd: boolean; adType: AdType }
      setAdSettings: Dispatch<SetStateAction<typeof adSettings>>
      setManualExpanded: (expanded: boolean) => void
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { t } = useTranslation()
    const theme = useTheme()
    const { enqueueSnackbar } = useSnackbar()
    const [shareCopiedToClipboard, setShareCopiedToClipboard] = useState(false)
    const [openLicenseDialog, setOpenLicenseDialog] = useState(false)
    const shareUrl = async (url: string) => {
      if (allowTracking) window.gtag('event', 'share')

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (navigator.share) {
        try {
          await navigator.share({
            title: '梗体中文构建配置分享',
            text: '你的好友给你分享了 ta 他的梗体中文！此链接 7 日内有效：',
            url: url,
          })
        } catch (err) {
          if ((err as Error).name !== 'AbortError') {
            throw err
          }
        }
      } else {
        await navigator.clipboard.writeText(url)
        setShareCopiedToClipboard(true)
        setTimeout(() => {
          setShareCopiedToClipboard(false)
        }, 3000)
      }
    }
    const adRef = useRef<HTMLDivElement>(null)
    const actionErrorRef = useRef<HTMLElement>(null)
    const actionSuccessRef = useRef<HTMLElement>(null)

    return (
      <Accordion
        key={log.time}
        expanded={log.expanded}
        ref={ref}
        TransitionProps={{ unmountOnExit: true }}
      >
        <AccordionSummary
          expandIcon={<ChevronDown />}
          onClick={() => setManualExpanded(!log.expanded)}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Typography
                sx={{
                  width: '33%',
                  flexShrink: 0,
                  color: `${log.status}.main`,
                }}
              >
                {log.status === 'success' ? (
                  <Check sx={{ mr: 1, verticalAlign: 'top' }} />
                ) : (
                  <CloseCircle sx={{ mr: 1, verticalAlign: 'top' }} />
                )}
                {t(
                  `log.build${log.status.replace(/^\S/, (s) =>
                    s.toUpperCase()
                  )}`
                )}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {new Date(log.time).toLocaleString(t('metadata.dateLocale'))}
              </Typography>
            </Box>
            <AccordionActions sx={{ padding: '0', pr: 1 }}>
              <IconButton
                size="small"
                color="error"
                sx={{ padding: '0' }}
                onClick={(event) => {
                  event.stopPropagation()
                  deleteSelf()
                }}
              >
                <Close />
              </IconButton>
            </AccordionActions>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Paper
            elevation={0}
            sx={{
              pt: 2,
              pb: 2,
              fontFamily:
                "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
              mb: 1,
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.04))',
              overflowX: 'auto',
            }}
          >
            <Tooltip title={t('log.logCopy')}>
              <IconButton
                onClick={() => {
                  void navigator.clipboard.writeText(log.log)
                }}
                sx={{ position: 'relative', float: 'right', right: '12px' }}
              >
                <ContentCopy />
              </IconButton>
            </Tooltip>
            {log.log.split('\n').map((line, index) => {
              return (
                <Typography
                  variant="body1"
                  fontFamily="source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"
                  key={index}
                  css={css`
                    position: relative;
                    white-space: pre-wrap;
                    counter-increment: line;
                    padding-left: 3.5rem;
                    padding-right: 2rem;
                    transition: color, background-color 0.075s ease-in-out;
                    &::before {
                      content: counter(line);
                      position: absolute;
                      left: 1.5rem;
                    }
                    &:hover {
                      background-color: ${theme.palette.action.hover};
                    }
                  `}
                  color={
                    {
                      warning: 'warning.main',
                      error: 'error.main',
                      success: 'success.main',
                      info: 'info.main',
                      debug: 'text.secondary',
                      default: 'text.primary',
                    }[
                      line.toLowerCase().match(/(fail|error)/)
                        ? 'error'
                        : line.toLowerCase().match(/(warn)/)
                        ? 'warning'
                        : line.toLowerCase().match(/(success|succeed)/)
                        ? 'success'
                        : line.toLowerCase().match(/(info)/)
                        ? 'info'
                        : line.toLowerCase().match(/ {4}/)
                        ? 'debug'
                        : 'default'
                    ]
                  }
                >
                  {line}
                </Typography>
              )
            })}
          </Paper>
          <CollapseTransition
            in={adSettings.shouldDisplayAd}
            classNames="collapse-out"
            timeout={300}
            nodeRef={adRef}
          >
            <Alert
              ref={adRef}
              severity="error"
              icon={false}
              sx={{
                '& > div': {
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                },
              }}
            >
              <Box sx={{ mb: 1, display: 'flex', opacity: 0.8, mr: 2 }}>
                <Heart color="error" className="donate-button" />
              </Box>
              <Box>
                <AlertTitle>{t('log.ad.title')}</AlertTitle>
                {
                  {
                    [AdType.FirstTime]: t('log.ad.firstTime'),
                    [AdType.Reconsider]: t('log.ad.reconsider'),
                    [AdType.Renew]: t('log.ad.renew'),
                  }[adSettings.adType]
                }
                <Typography
                  variant="caption"
                  component="p"
                  sx={{ mt: 1, color: 'text.secondary' }}
                >
                  {t('log.ad.donationNotice')}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Button
                    className="donate-button"
                    startIcon={<Heart />}
                    variant="contained"
                    color="error"
                    href="https://afdian.net/@teahouse"
                    target="_blank"
                    rel="noopener noreferrer"
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
                    sx={{ mr: 1, md: 1 }}
                  >
                    {t('footer.donate')}
                  </Button>
                  <Button
                    startIcon={<HeartBroken />}
                    color="inherit"
                    onClick={() => {
                      setAdSettings((adSettings) => {
                        return { ...adSettings, shouldDisplayAd: false }
                      })
                      setLS({
                        shown: true,
                        lastShown: Date.now(),
                        clicked: false,
                      })
                      enqueueSnackbar(t('log.ad.dismissSnackbar'), {
                        autoHideDuration: 10000,
                        variant: 'info',
                      })
                    }}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    {t('log.ad.dismiss')}
                  </Button>
                </Box>
              </Box>
            </Alert>
          </CollapseTransition>
          <CollapseTransition
            in={!adSettings.shouldDisplayAd}
            classNames="collapse-in"
            timeout={600}
            nodeRef={
              log.status === 'success' ? actionSuccessRef : actionErrorRef
            }
          >
            {log.status === 'success' ? (
              <Box ref={actionSuccessRef}>
                <Alert
                  severity="info"
                  sx={{
                    mb: 1,
                  }}
                >
                  <Trans i18nKey="log.followUpdates">
                    梗体中文每时每刻都在持续迭代更新！我们推荐您在一段时间后更新您的梗体中文资源包。您也可以关注我们的
                    <Link
                      href="https://space.bilibili.com/406275313"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      B 站动态
                    </Link>
                    获得一手资讯。
                  </Trans>
                </Alert>
                <Box
                  sx={{
                    display: 'flex',
                    alignItem: 'center',
                    mb: 2,
                  }}
                >
                  <Copyright sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    <Trans i18nKey="log.copyright">
                      梗体中文以
                      <Link
                        href="https://creativecommons.org/licenses/by-sa/4.0/legalcode"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        知识共享 署名-相同方式共享 4.0 国际（CC BY-SA 4.0）
                      </Link>
                      许可协议发布。若您想要重新发布本资源包或在本资源包的基础上二次创作，烦请阅读此
                      <Link onClick={() => setOpenLicenseDialog(true)}>
                        版权指南
                      </Link>
                      。
                    </Trans>
                  </Typography>
                </Box>
                <LicenseDialog
                  open={openLicenseDialog}
                  close={() => {
                    setOpenLicenseDialog(false)
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={() =>
                    window.gtag('event', 'download', {
                      eventType: log.platform,
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      eventLabel: new URL(log.downloadUrl!).pathname,
                    })
                  }
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  href={log.downloadUrl!}
                  rel="noopener noreferrer"
                  target="_blank"
                  sx={{ mr: 1 }}
                >
                  {t('log.download')}
                </Button>
                <Button
                  startIcon={<Disc />}
                  sx={{ mr: 1 }}
                  href={
                    {
                      java: 'https://wdf.ink/record-java',
                      bedrock: 'https://wdf.ink/record-bedrock',
                    }[log.platform]
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('appbar.discPack')}
                </Button>
                <Button
                  startIcon={
                    shareCopiedToClipboard ? <Check /> : <ShareVariant />
                  }
                  onClick={() => {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    void shareUrl(log.downloadUrl!)
                  }}
                  sx={{ mr: 1 }}
                >
                  {t(shareCopiedToClipboard ? 'log.clipboard' : 'log.share')}
                </Button>
                <Button
                  className="donate-button"
                  startIcon={<Heart />}
                  color="error"
                  href="https://afdian.net/@teahouse"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mr: 1 }}
                >
                  {t('footer.donate')}
                </Button>
                <Tooltip title={t('log.howToInstall')}>
                  <IconButton
                    href="https://lakeus.xyz/wiki/梗体中文/导入"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ float: 'right' }}
                  >
                    <HelpCircle />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              <Box ref={actionErrorRef}>
                <Button
                  variant="contained"
                  startIcon={<Bug />}
                  color="error"
                  href="https://github.com/Teahouse-Studios/mcwzh-meme-web-builder/issues/new/choose"
                  rel="noopener noreferrer"
                  sx={{ mr: 1 }}
                >
                  {t('log.feedback')}
                </Button>
              </Box>
            )}
          </CollapseTransition>
        </AccordionDetails>
      </Accordion>
    )
  }
)

LogAccordion.displayName = 'LogAccordion'

export default LogAccordion