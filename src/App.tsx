import { useMemo, lazy, memo } from 'react'
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  PaletteMode,
} from '@mui/material'
import { SnackbarProvider } from 'notistack'

import { css } from '@emotion/react'
import 'react-aspect-ratio/aspect-ratio.css'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import zhHans from './locales/zh-hans.json'
import zhMeme from './locales/zh-meme.json'

import MemeAppBar from './template/AppBar'
import TeahouseFooter from './template/Footer'
import WebviewWarning from './template/WebviewWarning'
import DynamicAlerts from './template/DynamicAlerts'
import BackToTop from './template/BackToTop'
import SkipToForm from './template/SkipToForm'
const DynamicNews = memo(lazy(() => import('./template/DynamicNews')))
import Form from './form/Form'

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
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
    fallbackLng: ['zhHans', 'zhMeme', 'en'],

    interpolation: {
      escapeValue: false,
    },
  })

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const mode = useMemo<PaletteMode>(
    () => (prefersDarkMode ? 'dark' : 'light'),
    [prefersDarkMode]
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
    <div
      css={css`
        color-scheme: ${mode === 'light' ? 'light' : 'dark'};

        a:not(.MuiButtonBase-root) {
          color: ${theme.palette.primary.main};
        }

        .SnackbarContent-root:not(.SnackbarContent-variantSuccess, .SnackbarContent-variantError, .SnackbarContent-variantWarning, .SnackbarContent-variantInfo)
          a {
          color: ${mode === 'light'
            ? theme.palette.primary.light
            : theme.palette.primary.dark};
        }
      `}
    >
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={4}>
          <SkipToForm />
          <CssBaseline />
          <MemeAppBar />
          <Form />
          <TeahouseFooter />
          <WebviewWarning />
          <DynamicAlerts />
          <DynamicNews />
          <BackToTop />
        </SnackbarProvider>
      </ThemeProvider>
    </div>
  )
}

export default App
