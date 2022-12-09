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
  Collapse,
} from '@mui/material'
import {
  CloseCircle,
  ChevronDown,
  Check,
  Bug,
  ShareVariant,
  Heart,
  HeartBroken,
  Disc,
  HelpCircle,
  ContentCopy,
  Close,
  Copyright,
  Cube,
} from 'mdi-material-ui'
import { useState, forwardRef, ForwardedRef, useRef } from 'react'
import { css } from '@emotion/react'
import { Trans, useTranslation } from 'react-i18next'
import { AdType, useAd } from '../../hooks/useAd'
import CollapseTransition from '../../template/CollapseTransition'
import type { BuildLog } from '../types'
import allowTracking from '../../tracking'
import LicenseDialog from '../LicenseDialog'
import DownloadCard from './DownloadCard'

const LogAccordion = forwardRef(
  (
    {
      log,
      deleteSelf,
      setManualExpanded,
    }: {
      log: BuildLog
      deleteSelf: () => void
      setManualExpanded: (expanded: boolean) => void
    },
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const { t } = useTranslation()
    const theme = useTheme()
    const [shareCopiedToClipboard, setShareCopiedToClipboard] = useState(false)
    const [openLicenseDialog, setOpenLicenseDialog] = useState(false)
    const [fullLogExpanded, setFullLogExpanded] = useState(false)
    const { shouldDisplayAd, adType, adAccepted, adDismissed } = useAd()
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
    const logRef = useRef<HTMLDivElement>(null)

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
                    s.toUpperCase(),
                  )}`,
                )}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  new Date(log.time).toLocaleString(t('metadata.dateLocale')!)
                }
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
              pb: 4,
              fontFamily:
                "JetBrainsMonoVar, Menlo, Monaco, Consolas, 'Courier New', monospace",
              mb: 1,
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.04))',
              overflowX: 'auto',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: '100%',
                position: 'absolute',
                top: fullLogExpanded ? undefined : `${250 + 8}px`,
                bottom: fullLogExpanded ? '0' : undefined,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <IconButton
                onClick={() => {
                  setFullLogExpanded(!fullLogExpanded)
                }}
                sx={{
                  transform: `rotate(${fullLogExpanded ? '180' : '0'}deg)`,
                  transition:
                    'transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                }}
              >
                <ChevronDown />
              </IconButton>
            </Box>
            <Collapse
              collapsedSize={`${
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
                logRef.current?.scrollHeight! < 250
                  ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
                    logRef.current?.scrollHeight!
                  : 250
              }px`}
              in={fullLogExpanded}
            >
              <Box ref={logRef}>
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
                      fontFamily="JetBrainsMonoVar, Menlo, Monaco, Consolas, 'Courier New', monospace"
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
              </Box>
            </Collapse>
          </Paper>
          <CollapseTransition
            in={shouldDisplayAd}
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
                  }[adType]
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
                      adAccepted()
                    }}
                    sx={{ mr: 1, md: 1 }}
                  >
                    {t('footer.donate')}
                  </Button>
                  <Button
                    startIcon={<HeartBroken />}
                    color="inherit"
                    onClick={() => {
                      adDismissed()
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
            in={!shouldDisplayAd}
            classNames="collapse-in"
            timeout={600}
            nodeRef={
              log.status === 'success' ? actionSuccessRef : actionErrorRef
            }
          >
            {log.status === 'success' ? (
              <Box ref={actionSuccessRef}>
                <LicenseDialog
                  open={openLicenseDialog}
                  close={() => {
                    setOpenLicenseDialog(false)
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    my: 1,
                  }}
                >
                  <Typography component="h3" variant="h6" sx={{ mb: 1 }}>
                    {t('log.download')}
                  </Typography>
                  <Box>
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
                    <Tooltip
                      title={t(
                        shareCopiedToClipboard ? 'log.clipboard' : 'log.share',
                      )}
                    >
                      <IconButton
                        onClick={() => {
                          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                          void shareUrl(log.downloadUrl!)
                        }}
                        sx={{ mr: 1 }}
                      >
                        {shareCopiedToClipboard ? <Check /> : <ShareVariant />}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={t('log.howToInstall')}>
                      <IconButton
                        href="https://lakeus.xyz/wiki/梗体中文/导入"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <HelpCircle />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <DownloadCard
                  actionProps={{
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    href: log.downloadUrl!,
                    rel: 'noopener noreferrer',
                    target: '_blank',
                    onClick: () => {
                      window.gtag('event', 'download', {
                        eventType: log.platform,
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        eventLabel: new URL(log.downloadUrl!).pathname,
                      })
                    },
                  }}
                  name={
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    new URL(log.downloadUrl!).pathname.split('/')[
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      new URL(log.downloadUrl!).pathname.split('/').length - 1
                    ]
                  }
                  caption={t('memepack')}
                  icon={Cube}
                  highlighted
                  sx={{ mr: 1, mb: 1 }}
                />
                <DownloadCard
                  actionProps={{
                    href: {
                      java: 'https://wdf.ink/record-java',
                      bedrock: 'https://wdf.ink/record-bedrock',
                    }[log.platform],

                    target: '_blank',
                    rel: 'noopener noreferrer',
                  }}
                  name={
                    {
                      java: 'java.zip',
                      bedrock: 'bedrock.mcpack',
                    }[log.platform]
                  }
                  caption={t('appbar.discPack')}
                  icon={Disc}
                  sx={{ mr: 1, mb: 1 }}
                />
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

                <Alert icon={<Copyright />} severity="warning">
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
                </Alert>
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
  },
)

LogAccordion.displayName = 'LogAccordion'

export default LogAccordion
