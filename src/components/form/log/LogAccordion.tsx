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
  AccordionActions,
  Collapse,
} from '@mui/material'
import {
  CloseCircle,
  ChevronDown,
  Check,
  Bug,
  Heart,
  HeartBroken,
  Album,
  HelpCircle,
  ContentCopy,
  Close,
  ZipBox,
} from '@teahouse-studios/mdi-material-ui'
import { useState, forwardRef, type ForwardedRef, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { AdType, useAd } from '../../../hooks/useAd'
import CollapseTransition from '../../template/CollapseTransition'
import type { BuildLog } from '../types'
import allowTracking from '../../../tracking'
import DownloadCard from './DownloadCard'
import type { BrotliWasmType } from 'brotli-wasm'

const LogAccordion = forwardRef(
  (
    {
      log,
      deleteSelf,
      setManualExpanded,
      brotli,
    }: {
      log: BuildLog
      deleteSelf: () => void
      setManualExpanded: (expanded: boolean) => void
      brotli: BrotliWasmType
    },
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const { t } = useTranslation()
    const theme = useTheme()
    const [fullLogExpanded, setFullLogExpanded] = useState(false)
    const { shouldDisplayAd, adType, adAccepted, adDismissed } = useAd()

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
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  new Intl.DateTimeFormat(t('metadata.dateLocale')!, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hourCycle: 'h23',
                  }).format(new Date(log.time))
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
              overflowY: 'hidden',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: '100%',
                position: 'absolute',
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                transition: 'top,bottom 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
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
                      sx={{
                        position: 'relative',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        counterIncrement: 'line',
                        paddingLeft: '3.5rem',
                        paddingRight: '2rem',
                        transition:
                          'color, background-color 0.075s ease-in-out',
                        '&::before': {
                          content: 'counter(line)',
                          position: 'absolute',
                          left: '1.5rem',
                        },
                        '&:hover': {
                          backgroundColor: `${theme.palette.action.hover}`,
                        },
                      }}
                      color={
                        {
                          warning: 'warning.main',
                          error: 'error.main',
                          success: 'success.main',
                          info: 'info.main',
                          debug: 'text.secondary',
                          default: 'text.primary',
                        }[
                          line.toLowerCase().match(/ {4}/)
                            ? 'debug'
                            : line.toLowerCase().match(/(fail|error)/)
                              ? 'error'
                              : line.toLowerCase().match(/(warn)/)
                                ? 'warning'
                                : line.toLowerCase().match(/(success|succeed)/)
                                  ? 'success'
                                  : line.toLowerCase().match(/(info)/)
                                    ? 'info'
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
                    href="https://afdian.com/@teahouse"
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
                      href="https://afdian.com/@teahouse"
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
                      if (allowTracking)
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
                  caption={`${t('memepack')}${
                    log.size ? ` (${byteToReadable(log.size)})` : ''
                  }`}
                  icon={ZipBox}
                  highlighted
                  share={{
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    file: log.downloadUrl!,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    params: log.share!,
                    brotli,
                  }}
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
                  caption={t('appbar.discPack') + ' (~80MiB)'}
                  icon={Album}
                  sx={{ mr: 1, mb: 1 }}
                />
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

function byteToReadable(bytes: number) {
  if (bytes === 0) return '0B'
  const k = 1024
  const sizes = ['B', 'KiB', 'MiB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))}${sizes[i]}`
}
