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
  ExpandAll,
} from 'mdi-material-ui'
import {
  useState,
  useEffect,
  ReactNode,
  MouseEventHandler,
  SyntheticEvent,
  useRef,
  lazy,
  Suspense,
  Key,
  createRef,
  RefObject,
} from 'react'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import JavaForm from './JavaForm'
import BedrockForm from './BedrockForm'
import LogAccordion from './log/LogAccordion'
const SponsorsList = lazy(() => import('./SponsorsList'))
import type { MemeApi, BuildLog } from './types'
import fakeApiData from './fakeApiData'
import endpoint from '../api'
import { useEffectOnce, useLocalStorage } from 'usehooks-ts'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import './form.css'
import type { Swiper as SwiperType } from 'swiper'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

export enum AdType {
  FirstTime,
  Reconsider,
  Renew,
}

export default function Form(props: { shouldCensor: boolean }) {
  const { t } = useTranslation()
  const [api, setApi] = useState<MemeApi | undefined>(undefined)
  const [apiError, setApiError] = useState<Error | null>(null)
  const [logs, setLogs] = useLocalStorage<BuildLog[]>('memeBuildLogs', [])
  const [logsExpired, setLogsExpired] = useState(false)
  useEffectOnce(() => {
    const original = logs.length
    const newLogs = logs.filter(
      (log) => Date.now().valueOf() - log.time < 1000 * 60 * 60 * 24 * 7
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
    formRootRef.current?.addEventListener('click', listener)
  }, [])
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [swiper, setSwiper] = useState<SwiperType>()

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
  const slideChange = (index: number) => {
    setTab(index)
  }

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTab(newValue)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    swiper?.slideTo(newValue)
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
                disabled={!api}
              />
            </Tabs>
            {!api && (
              <TabPanel>
                <LoadingMask>
                  <JavaForm
                    api={fakeApiData}
                    addLog={addLog}
                    shouldCensor={false}
                  />
                </LoadingMask>
              </TabPanel>
            )}
            <CSSTransition
              in={!!api}
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
                      />
                    </TabPanel>
                  </SwiperSlide>
                </Swiper>
              </Box>
            </CSSTransition>
          </Container>
        )}
        <CollapseTransition in={logs.length > 0} nodeRef={logRootRef}>
          <Container id="build-logs" ref={logRootRef}>
            <Divider sx={{ mb: 2 }} />
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
                        logs.map((log) => ({ ...log, expanded: false }))
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
                        logs.map((log) => ({ ...log, expanded: true }))
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
                          deleteSelf={() => {
                            setLogs(logs.filter((l) => l.time !== log.time))
                          }}
                          adLS={adLS}
                          setLS={setLS}
                          adSettings={adSettings}
                          setAdSettings={setAdSettings}
                          setManualExpanded={(exp) => {
                            setLogs(
                              logs.map((l) =>
                                l.time === log.time
                                  ? { ...l, expanded: exp }
                                  : l
                              )
                            )
                          }}
                        />
                      </CollapseTransition>
                    )
                  })}
              </TransitionGroup>
            </Box>
            {logsExpired && (
              <Alert severity="info" sx={{ my: 1 }}>
                {t('log.expired')}
              </Alert>
            )}
          </Container>
        </CollapseTransition>
      </Box>
      <Container sx={{ mb: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Suspense fallback={<CircularProgress />}>
          <SponsorsList
            adLS={adLS}
            setLS={setLS}
            adSettings={adSettings}
            setAdSettings={setAdSettings}
          />
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

export function CollapseTransition(props: {
  children?: ReactNode
  in?: boolean
  key?: Key
  classNames?: string
  timeout?: number
  nodeRef: RefObject<HTMLElement>
}) {
  return (
    <CSSTransition
      in={props.in}
      key={props.key}
      timeout={props.timeout ?? 300}
      classNames={props.classNames ?? 'collapse'}
      unmountOnExit={!props.key}
      onEnter={() => {
        props.nodeRef.current?.style.setProperty(
          '--transition-height',
          `${props.nodeRef.current.scrollHeight}px`
        )
      }}
      onExit={() => {
        props.nodeRef.current?.style.setProperty(
          '--transition-height',
          `${props.nodeRef.current.scrollHeight}px`
        )
      }}
      nodeRef={props.nodeRef}
    >
      {props.children}
    </CSSTransition>
  )
}
