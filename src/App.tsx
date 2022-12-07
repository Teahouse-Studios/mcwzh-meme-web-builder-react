import { useMemo, lazy, memo, useState } from 'react'
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
import { useEffectOnce } from 'usehooks-ts'

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

const ENABLE_GEOIP_CENSORSHIP = true

function App() {
  const [shouldCensor, setShouldCensor] = useState(false)
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

  useEffectOnce(() => {
    async function checkCensorship() {
      try {
        let shouldCensorL = false

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (ENABLE_GEOIP_CENSORSHIP) {
          const geoip = (await (
            await fetch('https://api.ip.sb/geoip')
          ).json()) as {
            country_code: string
          }

          shouldCensorL =
            geoip.country_code === 'CN' &&
            isDateInRange(
              new Date(),
              new Date('2022-10-01'),
              new Date('2022-10-24')
            )
        }
        setShouldCensor(shouldCensorL)
      } catch (err) {
        console.error('Failed to check GeoIP:', err)
      }
    }

    void checkCensorship()
  })

  return (
    <div
      // eslint-disable-next-line react/no-unknown-property
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
          <Form shouldCensor={shouldCensor} />
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

// if date falls into a date range
function isDateInRange(date: Date, start: Date, end: Date) {
  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime()
}
