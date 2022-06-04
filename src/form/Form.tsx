import './Form.css'
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
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
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
  MouseEvent,
  MouseEventHandler,
  SyntheticEvent,
  Dispatch,
  SetStateAction,
} from 'react'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import JavaForm from './JavaForm'
import BedrockForm from './BedrockForm'
import { MemeApi, BuildLog } from './types'
import allowTracking from '../tracking'
import { useLocalStorage } from 'usehooks-ts'

enum AdType {
  FirstTime,
  Reconsider,
  Renew,
}

export default function Form() {
  const { t } = useTranslation()
  const theme = useTheme()
  const [api, setApi] = useState<MemeApi | undefined>(undefined)
  const [apiError, setApiError] = useState<Error | null>(null)
  const [logs, setLogs] = useState<BuildLog[]>([])
  const smAndUp = useMediaQuery(theme.breakpoints.up('sm'))

  const load = async () => {
    const data = await fetch('https://meme.wd-api.com/')
    const api = await data.json()
    setApi(api)
    setApiError(null)
  }

  const catchLoad = async (e: Error) => {
    setApiError(e)
    console.error(e)
  }

  const loadApi = (event: MouseEvent) => {
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

  const addLog = (log: BuildLog) => {
    setLogs([...logs, log])
  }

  let [adLS, setLS] = useLocalStorage('memeAd', {
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
      adLS.shown &&
      adLS.clicked === false &&
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
          <a
            href="https://github.com/Teahouse-Studios/mcwzh-meme-web-builder-react/issues"
            target="_blank"
            rel="noreferer noopener"
          >
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
      >
        {apiError ? (
          <ApiFailed error={apiError} load={loadApi} />
        ) : !api ? (
          <ApiLoading />
        ) : (
          <Container>
            <Tabs value={tab} onChange={handleChange} centered={smAndUp}>
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
              <JavaForm api={api!} addLog={addLog} />
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <BedrockForm api={api!} addLog={addLog} />
            </TabPanel>
          </Container>
        )}
        {logs.length > 0 && (
          <Container id="build-logs">
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
              {t('log.headline')}
            </Typography>
            <Box>
              {logs.reverse().map((log, index) => (
                <LogAccordion
                  key={log.time}
                  log={log}
                  adLS={adLS}
                  setLS={setLS}
                  adSettings={adSettings}
                  setAdSettings={setAdSettings}
                />
              ))}
            </Box>
          </Container>
        )}
      </Box>
    </>
  )
}

function LogAccordion({
  log,
  adLS,
  setLS,
  adSettings,
  setAdSettings,
}: {
  log: BuildLog
  adLS: { shown: boolean; lastShown: number; clicked: boolean }
  setLS: Dispatch<SetStateAction<typeof adLS>>
  adSettings: { shouldDisplayAd: boolean; adType: AdType }
  setAdSettings: Dispatch<SetStateAction<typeof adSettings>>
}) {
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()
  const [shareCopiedToClipboard, setShareCopiedToClipboard] = useState(false)
  const shareUrl = (url: string) => {
    if (allowTracking) window.gtag('event', 'share')

    if (navigator.share) {
      navigator.share({
        title: '梗体中文构建配置分享',
        text: '你的好友给你分享了 ta 他的梗体中文！此链接 7 日内有效：',
        url: url,
      })
    } else {
      navigator.clipboard.writeText(url)
      setShareCopiedToClipboard(true)
      setTimeout(() => {
        setShareCopiedToClipboard(false)
      }, 3000)
    }
  }

  return (
    <Accordion key="log.time">
      <AccordionSummary expandIcon={<ChevronDown />}>
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
            padding: 2,
            fontFamily: 'monospace',
            filter: 'invert(.05)',
            mb: 2,
          }}
        >
          {log.log}
        </Paper>
        {adSettings.shouldDisplayAd && (
          <>
            <Alert severity="error" icon={<Heart className="donate-button" />}>
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
                    })
                  }}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  {t('log.ad.dismiss')}
                </Button>
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
                  shareUrl(log.downloadUrl!)
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
                rel="noreferer noopener"
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
              target="_blank"
              rel="noreferer noopener"
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
        target="_blank"
        rel="noreferer noopener"
        startIcon={<Bug />}
        sx={{ mr: 1 }}
      >
        {t('form.fetchListFailed.feedback')}
      </Button>
    </Box>
  )
}

function ApiLoading() {
  const { t } = useTranslation()

  return <CircularProgress />
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
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}
