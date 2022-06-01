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
  Refresh,
} from 'mdi-material-ui'
import {
  useState,
  useEffect,
  ReactNode,
  MouseEvent,
  MouseEventHandler,
  SyntheticEvent,
} from 'react'
import { useTranslation } from 'react-i18next'
import JavaForm from './JavaForm'
import BedrockForm from './BedrockForm'
import { MemeApi, BuildLog } from './types'
import allowTracking from '../allowTracking'

export default function Form() {
  const { t } = useTranslation()
  const theme = useTheme()
  const [api, setApi] = useState<MemeApi | undefined>(undefined)
  const [apiError, setApiError] = useState<Error | null>(null)
  const [logs, setLogs] = useState<BuildLog[]>([])
  const [shareCopiedToClipboard, setShareCopiedToClipboard] = useState(false)
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
    <>
      <Box
        sx={{
          minHeight: 'calc(75vh)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: apiError || !api ? 'center' : 'start',
          flexWrap: 'wrap',
        }}
      >
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
              {logs.reverse().map((log) => (
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
                      {t(
                        `log.build${log.status.replace(/^\S/, (s) =>
                          s.toUpperCase()
                        )}`
                      )}
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
                    {log.status === 'success' ? (
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
                            shareCopiedToClipboard ? (
                              <Check />
                            ) : (
                              <ShareVariant />
                            )
                          }
                          onClick={() => {
                            shareUrl(log.downloadUrl!)
                          }}
                          sx={{ mr: 1 }}
                        >
                          {t(
                            shareCopiedToClipboard
                              ? 'log.clipboard'
                              : 'log.share'
                          )}
                        </Button>
                        <Button
                          className="donate-button"
                          startIcon={<Heart />}
                          color="warning"
                          href="https://afdian.net/@teahouse"
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
                        sx={{ mr: 1 }}
                      >
                        {t('log.feedback')}
                      </Button>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Container>
        )}
      </Box>
    </>
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
