import {
  Alert,
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Container,
  CircularProgress,
  Divider,
  IconButton,
  Link,
  Tooltip,
} from '@mui/material'
import {
  Coffee,
  Devices,
  Alert as AlertIcon,
  CloseCircle,
  Bug,
  Refresh,
  CloseCircleMultipleOutline,
  CollapseAll,
  Copyright,
  ExpandAll,
} from '@teahouse-studios/mdi-material-ui'
import {
  useState,
  useEffect,
  ReactNode,
  MouseEventHandler,
  SyntheticEvent,
  useRef,
  Suspense,
  createRef,
  RefObject,
  Dispatch,
  SetStateAction,
  useMemo,
} from 'react'
import { useSnackbar } from 'notistack'
import { Trans, useTranslation } from 'react-i18next'
import JavaForm from './JavaForm'
import BedrockForm from './BedrockForm'
import LogAccordion from './log/LogAccordion'
import SponsorsList from '../sponsor/SponsorsList'
import type { MemeApi, BuildLog } from './types'
import { schema } from './types'
import fakeApiData from './fakeApiData'
import endpoint from '../../api'
import { useEffectOnce, useLocalStorage } from 'usehooks-ts'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import './form.css'
import type { Swiper as SwiperType } from 'swiper'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import CollapseTransition from '../template/CollapseTransition'
import LicenseDialog from '../dialogs/LicenseDialog'
import brotliPromise, { BrotliWasmType } from 'brotli-wasm'

export default function Form(props: { shouldCensor: boolean }) {
  const { t } = useTranslation()
  const [api, setApi] = useState<MemeApi | undefined>(undefined)
  const [brotli, setBrotli] = useState<BrotliWasmType>()
  const [apiError, setApiError] = useState<Error | null>(null)
  const [logs, setLogs] = useLocalStorage<BuildLog[]>('memeBuildLogs', [])
  const [logsExpired, setLogsExpired] = useState(false)
  useEffectOnce(() => {
    const original = logs.length
    const newLogs = logs.filter(
      (log) => Date.now().valueOf() - log.time < 1000 * 60 * 60 * 24 * 7,
    )
    if (original !== newLogs.length) {
      setLogsExpired(true)
      setLogs(newLogs)
    }
  })
  const { enqueueSnackbar } = useSnackbar()
  const formRootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const listener = () => {
      formRootRef.current?.removeEventListener('click', listener)
      window.addEventListener('beforeunload', (event) => {
        event.preventDefault()
        event.returnValue = 'Are you sure you want to leave?'
        return 'Are you sure you want to leave?'
      })
    }
    const ref = formRootRef.current
    ref?.addEventListener('click', listener)

    return () => {
      ref?.removeEventListener('click', listener)
    }
  }, [])
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [swiper, setSwiper] = useState<SwiperType>()

  const load = async () => {
    const data = await fetch(`${endpoint}/v2/modules`)
    const api = (await data.json()) as MemeApi
    const brotli = await brotliPromise
    setBrotli(brotli)
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

  useEffect(() => {
    const listener = (event: HashChangeEvent) => {
      if (
        event.newURL.startsWith('#{') ||
        event.newURL.startsWith('#br=') ||
        event.oldURL.startsWith('#{') ||
        event.oldURL.startsWith('#br=')
      )
        location.reload()
    }
    window.addEventListener('hashchange', listener)
    return () => {
      window.removeEventListener('hashchange', listener)
    }
  })
  const [tab, setTab] = useState(0)

  useEffect(() => {
    swiper?.slideTo(tab, 400)
  }, [tab, swiper])

  const params = useMemo(() => {
    const extractHash = () => {
      const { hash } = location
      if (!brotli || hash.length <= 1) return {}
      let res: unknown = {}
      try {
        const content = hash.split('#')[1]
        if (content.startsWith('br=')) {
          res = JSON.parse(
            new TextDecoder().decode(
              brotli.decompress(
                new Uint8Array(
                  atob(content.slice(3))
                    .split('')
                    .map((c) => c.charCodeAt(0)),
                ),
              ),
            ),
          )
        } else if (content.startsWith('{')) {
          res = JSON.parse(decodeURIComponent(content)) as unknown
        }
      } catch (e) {
        console.error('Unable to parse hash config:', e)
      }
      return res
    }

    const extracted = extractHash()
    const parsed = schema.safeParse(extracted)
    setTab(parsed.success ? (parsed.data.platform === 'bedrock' ? 1 : 0) : 0)

    return parsed
  }, [brotli])

  const slideChange = (index: number) => {
    setTab(index)
  }

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
    })[log.status]()
  }

  const formRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <Box
        ref={formRootRef}
        sx={{
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
            <Tabs
              value={tab}
              onChange={handleChange}
              centered
              TabIndicatorProps={{
                children: <span className="MuiTabs-indicatorSpan" />,
              }}
              sx={{
                '& .MuiTabs-indicator': {
                  display: 'flex',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  height: '3px',
                },
                '& .MuiTabs-indicatorSpan': {
                  width: '55%',
                  backgroundColor: 'primary.main',
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
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
                disabled={!api}
              />
            </Tabs>
            {(!api || !brotli) && (
              <TabPanel>
                <LoadingMask>
                  <JavaForm
                    api={fakeApiData}
                    addLog={addLog}
                    shouldCensor={false}
                    rawParams={schema.safeParse({})}
                  />
                </LoadingMask>
              </TabPanel>
            )}
            <CSSTransition
              in={!!api && !!brotli}
              classNames="blur"
              timeout={1000}
              mountOnEnter
              nodeRef={formRef}
            >
              <Box ref={formRef}>
                <Swiper
                  spaceBetween={50}
                  slidesPerView={1}
                  autoHeight={true}
                  simulateTouch={false}
                  preventClicks={false}
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                  onSlideChange={(index) => slideChange(index.activeIndex)}
                  onSwiper={(swiper) => {
                    setSwiper(swiper)
                  }}
                >
                  <SwiperSlide>
                    <TabPanel>
                      <JavaForm
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        api={api!}
                        addLog={addLog}
                        shouldCensor={props.shouldCensor}
                        rawParams={params}
                      />
                    </TabPanel>
                  </SwiperSlide>
                  <SwiperSlide>
                    <TabPanel>
                      <BedrockForm
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        api={api!}
                        addLog={addLog}
                        shouldCensor={props.shouldCensor}
                        rawParams={params}
                      />
                    </TabPanel>
                  </SwiperSlide>
                </Swiper>
              </Box>
            </CSSTransition>
          </Container>
        )}
        <CollapseTransition
          in={logs.length > 0 && !!brotli}
          nodeRef={logRootRef}
        >
          <BuildLogs
            logRootRef={logRootRef}
            setLogs={setLogs}
            logs={logs}
            logsExpired={logsExpired}
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            brotli={brotli!}
          />
        </CollapseTransition>
      </Box>
      <Container sx={{ mb: 2 }}>
        <Divider sx={{ my: 2 }} />
        <Suspense fallback={<CircularProgress />}>
          <SponsorsList />
        </Suspense>
      </Container>
    </>
  )
}

function ApiFailed({ error, load }: { error: Error; load: MouseEventHandler }) {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        width: '100%',
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

function TabPanel(props: { children?: ReactNode }) {
  const { children, ...other } = props

  return (
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
      {...other}
    >
      <Typography component="div">{children}</Typography>
    </Box>
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

function BuildLogs({
  logRootRef,
  setLogs,
  logs,
  logsExpired,
  brotli,
}: // complete the type
{
  logRootRef: RefObject<HTMLDivElement>
  setLogs: Dispatch<SetStateAction<BuildLog[]>>
  logs: BuildLog[]
  logsExpired: boolean
  brotli: BrotliWasmType
}) {
  const { t } = useTranslation()
  const [openLicenseDialog, setOpenLicenseDialog] = useState(false)

  return (
    <Container id="build-logs" ref={logRootRef}>
      <LicenseDialog
        open={openLicenseDialog}
        close={() => {
          setOpenLicenseDialog(false)
        }}
      />
      <Divider
        sx={{
          mb: 2,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h2">
          {t('log.headline')}
        </Typography>
        <Box>
          <Tooltip title={t('form.clearAll')}>
            <IconButton
              color="error"
              onClick={() => {
                setLogs([])
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
              }}
            >
              <CloseCircleMultipleOutline />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('log.collapseAll')}>
            <IconButton
              onClick={() => {
                setLogs((logs) =>
                  logs.map((log) => ({ ...log, expanded: false })),
                )
              }}
            >
              <CollapseAll />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('log.expandAll')}>
            <IconButton
              onClick={() => {
                setLogs((logs) =>
                  logs.map((log) => ({ ...log, expanded: true })),
                )
              }}
            >
              <ExpandAll />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box>
        <TransitionGroup>
          {logs
            .slice()
            .reverse()
            .map((log) => {
              const itemRef = createRef<HTMLDivElement>()
              return (
                <CollapseTransition
                  classNames="delayed-collapse"
                  key={log.time}
                  nodeRef={itemRef}
                >
                  <LogAccordion
                    ref={itemRef}
                    log={log}
                    brotli={brotli}
                    deleteSelf={() => {
                      setLogs(logs.filter((l) => l.time !== log.time))
                    }}
                    setManualExpanded={(exp) => {
                      setLogs(
                        logs.map((l) =>
                          l.time === log.time ? { ...l, expanded: exp } : l,
                        ),
                      )
                    }}
                  />
                </CollapseTransition>
              )
            })}
        </TransitionGroup>
      </Box>
      <Box sx={{ mt: 1 }}>
        {logsExpired && (
          <Alert
            severity="info"
            sx={{
              mb: 1,
            }}
          >
            {t('log.expired')}
          </Alert>
        )}
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
            <Link onClick={() => setOpenLicenseDialog(true)}>版权指南</Link>。
          </Trans>
        </Alert>
      </Box>
    </Container>
  )
}
