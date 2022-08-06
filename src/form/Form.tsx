import {
  Alert,
  AlertTitle,
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Container,
  CircularProgress,
  Divider,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  useTheme,
} from '@mui/material'
import {
  Coffee,
  Devices,
  Alert as AlertIcon,
  CloseCircle,
  ChevronDown,
  Check,
  Download,
  Bug,
  ShareVariant,
  Heart,
  HeartBroken,
  Refresh,
} from 'mdi-material-ui'
import {
  useState,
  useEffect,
  ReactNode,
  MouseEventHandler,
  SyntheticEvent,
  Dispatch,
  SetStateAction,
  useRef,
} from 'react'
import { css } from '@emotion/react'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import JavaForm from './JavaForm'
import BedrockForm from './BedrockForm'
import SponsorsList from './SponsorsList'
import type { MemeApi, BuildLog } from './types'
import fakeApiData from './fakeApiData'
import allowTracking from '../tracking'
import endpoint from '../api'
import { useLocalStorage } from 'usehooks-ts'

export enum AdType {
  FirstTime,
  Reconsider,
  Renew,
}

export default function Form() {
  const { t } = useTranslation()
  const [api, setApi] = useState<MemeApi | undefined>(undefined)
  const [apiError, setApiError] = useState<Error | null>(null)
  const [logs, setLogs] = useState<BuildLog[]>([])
  const { enqueueSnackbar } = useSnackbar()

  const load = async () => {
    const data = await fetch(`${endpoint}/v2/modules`)
    const api = (await data.json()) as MemeApi
    setApi(api)
    setApiError(null)
  }

  const catchLoad = (e: Error) => {
    setApiError(e)
    console.error(e)
  }

  const loadApi = () => {
    setApiError(null)
    load().catch(catchLoad)
  }

  useEffect(() => {
    load().catch(catchLoad)
  }, [])

  const [tab, setTab] = useState(0)
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  const logRootRef = useRef<HTMLDivElement>(null)

  const addLog = (log: BuildLog) => {
    setLogs([...logs, log])
    setTimeout(() => {
      logRootRef.current?.scrollIntoView({
        behavior: 'smooth',
      })
    })
    ;({
      success() {
        enqueueSnackbar(t('snackbar.buildSuccess'), {
          variant: 'success',
        })
      },
      error() {
        enqueueSnackbar(t('snackbar.buildError'), { variant: 'error' })
      },
    }[log.status]())
  }

  const [adLS, setLS] = useLocalStorage('memeAd', {
    shown: false,
    lastShown: 0,
    clicked: false,
  })

  const [adSettings, setAdSettings] = useState(() => {
    let shouldDisplayAd = false
    let adType: AdType = AdType.FirstTime

    if (!adLS.shown) {
      adType = AdType.FirstTime
      shouldDisplayAd = true
    } else if (
      !adLS.clicked &&
      Date.now() - adLS.lastShown > 1000 * 60 * 60 * 24 * 7 // 7 days
    ) {
      shouldDisplayAd = true
      adType = AdType.Reconsider
    } else if (
      adLS.clicked &&
      Date.now() - adLS.lastShown > 1000 * 60 * 60 * 24 * 40 // 40 days
    ) {
      shouldDisplayAd = true
      adType = AdType.Renew
    }

    return { shouldDisplayAd, adType }
  })

  return (
    <>
      <Container sx={{ mb: 1 }}>
        <Alert severity="warning">
          <AlertTitle>高能警告</AlertTitle>
          您已被挑选进入实验性的新版在线构建。在使用过程中如有任何问题，请到{' '}
          <a href="https://github.com/Teahouse-Studios/mcwzh-meme-web-builder-react/issues">
            GitHub Issues
          </a>{' '}
          报告。
        </Alert>
      </Container>
      <Box
        sx={{
          minHeight: 'calc(75vh)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: apiError || !api ? 'center' : 'start',
          flexWrap: 'wrap',
        }}
        id="form"
      >
        {apiError ? (
          <ApiFailed error={apiError} load={loadApi} />
        ) : (
          <Container>
            <Tabs value={tab} onChange={handleChange} centered>
              <Tab
                icon={<Coffee />}
                iconPosition="start"
                label={t('java')}
                sx={{
                  minHeight: 'unset',
                }}
              />
              <Tab
                icon={<Devices />}
                iconPosition="start"
                label={t('bedrock')}
                sx={{
                  minHeight: 'unset',
                }}
              />
            </Tabs>
            <TabPanel value={tab} index={0}>
              {!api ? (
                <LoadingMask>
                  <JavaForm api={fakeApiData} addLog={addLog} />
                </LoadingMask>
              ) : (
                <JavaForm api={api} addLog={addLog} />
              )}
            </TabPanel>
            <TabPanel value={tab} index={1}>
              {!api ? (
                <LoadingMask>
                  <BedrockForm api={fakeApiData} addLog={addLog} />
                </LoadingMask>
              ) : (
                <BedrockForm api={api} addLog={addLog} />
              )}
            </TabPanel>
          </Container>
        )}
        {logs.length > 0 && (
          <Container id="build-logs" ref={logRootRef}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
              {t('log.headline')}
            </Typography>
            <Box>
              {logs
                .slice()
                .reverse()
                .map((log, index) => (
                  <LogAccordion
                    key={log.time}
                    log={log}
                    adLS={adLS}
                    setLS={setLS}
                    adSettings={adSettings}
                    setAdSettings={setAdSettings}
                    defaultExpanded={index === 0}
                  />
                ))}
            </Box>
          </Container>
        )}
      </Box>
      <Container sx={{ mb: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <SponsorsList
          adLS={adLS}
          setLS={setLS}
          adSettings={adSettings}
          setAdSettings={setAdSettings}
        />
      </Container>
    </>
  )
}

function LogAccordion({
  log,
  adLS,
  setLS,
  adSettings,
  setAdSettings,
  defaultExpanded,
}: {
  log: BuildLog
  adLS: { shown: boolean; lastShown: number; clicked: boolean }
  setLS: Dispatch<SetStateAction<typeof adLS>>
  adSettings: { shouldDisplayAd: boolean; adType: AdType }
  setAdSettings: Dispatch<SetStateAction<typeof adSettings>>
  defaultExpanded: boolean
}) {
  const { t } = useTranslation()
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [shareCopiedToClipboard, setShareCopiedToClipboard] = useState(false)
  const shareUrl = async (url: string) => {
    if (allowTracking) window.gtag('event', 'share')

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (navigator.share) {
      await navigator.share({
        title: '梗体中文构建配置分享',
        text: '你的好友给你分享了 ta 他的梗体中文！此链接 7 日内有效：',
        url: url,
      })
    } else {
      await navigator.clipboard.writeText(url)
      setShareCopiedToClipboard(true)
      setTimeout(() => {
        setShareCopiedToClipboard(false)
      }, 3000)
    }
  }

  return (
    <Accordion key="log.time" expanded={expanded}>
      <AccordionSummary
        expandIcon={<ChevronDown />}
        onClick={() => setExpanded(!expanded)}
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
          {t(`log.build${log.status.replace(/^\S/, (s) => s.toUpperCase())}`)}
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          {new Date(log.time).toLocaleString()}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Paper
          elevation={0}
          sx={{
            pt: 2,
            pb: 2,
            fontFamily: 'monospace',
            filter: 'invert(.05)',
            mb: 2,
          }}
        >
          {log.log.split('\n').map((line, index) => {
            return (
              <Typography
                variant="body1"
                fontFamily="monospace"
                key={index}
                sx={{
                  whiteSpace: 'pre-wrap',
                }}
                css={css`
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
        {adSettings.shouldDisplayAd && (
          <>
            <Alert
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
                    rel="noreferrer noopener"
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
          </>
        )}
        {!adSettings.shouldDisplayAd &&
          (log.status === 'success' ? (
            <>
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
                href={log.downloadUrl}
                sx={{ mr: 1 }}
              >
                {t('log.download')}
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
                color="warning"
                href="https://afdian.net/@teahouse"
                target="_blank"
                rel="noreferrer noopener"
                sx={{ mr: 1 }}
              >
                {t('footer.donate')}
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              startIcon={<Bug />}
              color="error"
              href="https://github.com/Teahouse-Studios/mcwzh-meme-web-builder/issues/new/choose"
              rel="noreferrer noopener"
              sx={{ mr: 1 }}
            >
              {t('log.feedback')}
            </Button>
          ))}
      </AccordionDetails>
    </Accordion>
  )
}

function ApiFailed({ error, load }: { error: Error; load: MouseEventHandler }) {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 2,
      }}
    >
      <AlertIcon color="error" fontSize="large" sx={{ mb: 1 }} />
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        {t('form.fetchListFailed.headline')}
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        {t('form.fetchListFailed.text')}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        <CloseCircle
          color="error"
          fontSize="small"
          sx={{
            verticalAlign: 'middle',
            mr: '6px',
          }}
        />
        <code>
          {error.name}: {error.message}
        </code>
      </Typography>
      <Button
        variant="text"
        color="primary"
        onClick={load}
        startIcon={<Refresh />}
        sx={{ mr: 1 }}
      >
        {t('form.fetchListFailed.retry')}
      </Button>
      <Button
        variant="text"
        color="error"
        href="https://github.com/Teahouse-Studios/mcwzh-meme-web-builder/issues/new/choose"
        startIcon={<Bug />}
        sx={{ mr: 1 }}
      >
        {t('form.fetchListFailed.feedback')}
      </Button>
    </Box>
  )
}

interface TabPanelProps {
  children?: ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      <Box
        sx={{
          p: {
            xs: 2,
            md: 3,
          },
          pt: {
            xs: 3,
          },
        }}
      >
        <Typography>{children}</Typography>
      </Box>
    </div>
  )
}

function LoadingMask({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ width: '100%', float: 'left', position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          zIndex: 50,
          top: '40%',
          left: '50%',
          width: '100%',
          height: '100%',
        }}
      >
        <CircularProgress />
      </Box>
      <Box
        sx={{
          filter: 'blur(2px)',
          pointerEvents: 'none',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
