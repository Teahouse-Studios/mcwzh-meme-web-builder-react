import './App.css'
import MemeAppBar from './template/AppBar'

import { useMemo, createContext, useState, lazy } from 'react'
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Container,
} from '@mui/material'
import { SnackbarProvider } from 'notistack'

import { css } from '@emotion/react'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import zhHans from './locales/zh-hans.json'
import zhMeme from './locales/zh-meme.json'
import TeahouseFooter from './template/Footer'
import WebviewWarning from './template/WebviewWarning'
import DynamicAlerts from './template/DynamicAlerts'
const DynamicNews = lazy(() => import('./template/DynamicNews'))
import Form from './form/Form'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      main: en,
    },
    zhHans: {
      main: zhHans,
    },
    zhMeme: {
      main: zhMeme,
    },
  },
  ns: ['main'],
  defaultNS: 'main',
  lng: 'zhHans',
  fallbackLng: ['zhMeme', 'en', 'zhHans'],

  interpolation: {
    escapeValue: false,
  },
})

export const ColorModeContext = createContext({ toggleColorMode: () => {} })

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setMode] = useState<'light' | 'dark'>(
    prefersDarkMode ? 'dark' : 'light'
  )

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      },
    }),
    []
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  )

  return (
    <ColorModeContext.Provider value={colorMode}>
      <div
        css={css`
          color-scheme: ${mode === 'light' ? 'light' : 'dark'};

          a:not(.MuiButton-root) {
            color: ${theme.palette.primary.main};
          }

          .SnackbarContent-root:not(.SnackbarContent-variantSuccess, .SnackbarContent-variantError, .SnackbarContent-variantWarning, .SnackbarContent-variantInfo)
            a {
            color: ${theme.palette.primary.light};
          }
        `}
      >
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={4}>
            <CssBaseline />
            <MemeAppBar />
            <Container>
              <Form />
            </Container>
            <TeahouseFooter />
            <WebviewWarning />
            <DynamicAlerts />
            <DynamicNews />
          </SnackbarProvider>
        </ThemeProvider>
      </div>
    </ColorModeContext.Provider>
  )
}

export default App
