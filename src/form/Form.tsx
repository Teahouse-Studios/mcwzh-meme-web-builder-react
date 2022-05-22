import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Container,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Coffee, Devices, Alert, CloseCircle } from 'mdi-material-ui'
import {
  useState,
  useEffect,
  createContext,
  SyntheticEvent,
  ReactNode,
  MouseEvent,
  MouseEventHandler,
} from 'react'
import { useTranslation } from 'react-i18next'
import JavaForm from './JavaForm'
import BedrockForm from './BedrockForm'
import { MemeApi } from './types'

export const ApiContext = createContext<MemeApi | undefined>(undefined)

export default function Form() {
  const { t } = useTranslation()
  const theme = useTheme()
  const [apiData, setApiData] = useState<MemeApi | undefined>(undefined)
  const [apiError, setApiError] = useState<Error | null>(null)
  const smAndUp = useMediaQuery(theme.breakpoints.up('sm'))

  const load = async () => {
    const data = await fetch('https://meme.wd-api.com/')
    const api = await data.json()
    setApiData(api)
    setApiError(null)
  }
  const catchLoad = async (e: Error) => {
    setApiError(e)
    console.error(e)
  }

  const loadApiData = (event: MouseEvent) => {
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

  return (
    <ApiContext.Provider value={apiData}>
      <ApiContext.Consumer>
        {(value) => {
          return (
            <Box
              sx={{
                minHeight: 'calc(75vh)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: apiError || !value ? 'center' : 'start',
              }}
            >
              {apiError ? (
                <ApiFailed error={apiError} load={loadApiData} />
              ) : !value ? (
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
                    <JavaForm />
                  </TabPanel>
                  <TabPanel value={tab} index={1}>
                    <BedrockForm />
                  </TabPanel>
                </Container>
              )}
            </Box>
          )
        }}
      </ApiContext.Consumer>
    </ApiContext.Provider>
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
      <Alert color="error" fontSize="large" sx={{ mb: 1 }} />
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
      <Button variant="text" color="primary" onClick={load}>
        {t('form.fetchListFailed.retry')}
      </Button>
      <Button
        variant="text"
        color="error"
        href="https://github.com/Teahouse-Studios/mcwzh-meme-web-builder/issues/new/choose"
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
