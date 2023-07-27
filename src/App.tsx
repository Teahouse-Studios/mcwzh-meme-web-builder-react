import './App.css'
import InterVar from './assets/Inter.var.woff2'
import InterVarItalic from './assets/Inter-Italic.var.woff2'
import JetBrainsMonoVar from './assets/JetBrainsMono.var.woff2'
import JetBrainsMonoVarItalic from './assets/JetBrainsMono-Italic.var.woff2'

import { useMemo, lazy, memo, useState } from 'react'
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  type PaletteMode,
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

import MemeAppBar from './components/template/AppBar'
import TeahouseFooter from './components/template/Footer'
import WebviewWarning from './components/dialogs/WebviewWarning'
import DynamicAlerts from './components/dialogs/DynamicAlerts'
import BackToTop from './components/template/BackToTop'
import SkipToForm from './components/template/SkipToForm'
const DynamicNews = memo(lazy(() => import('./components/dialogs/DynamicNews')))
import Form from './components/form/Form'
import { useEffectOnce } from 'usehooks-ts'
// import SplashWrapper from './components/template/splash/SplashWrapper'
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

declare module '@mui/material/styles' {
  interface PaletteColor {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
  }
}

function App() {
  const [shouldCensor, setShouldCensor] = useState(false)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const mode = useMemo<PaletteMode>(
    () => (prefersDarkMode ? 'dark' : 'light'),
    [prefersDarkMode],
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            900: '#1f41b6',
            800: '#1d61d5',
            700: '#1a73e8',
            600: '#1386fc',
            500: '#0095ff',
            400: '#34a4ff',
            300: '#5cb5ff',
            200: '#8dcaff',
            100: '#bbdeff',
            50: '#e3f2ff',
            main: mode === 'light' ? '#1a73e8' : '#0095ff',
          },
          info: {
            900: '#1f41b6',
            800: '#1d61d5',
            700: '#1a73e8',
            600: '#1386fc',
            500: '#0095ff',
            400: '#34a4ff',
            300: '#5cb5ff',
            200: '#8dcaff',
            100: '#bbdeff',
            50: '#e3f2ff',
            main: mode === 'light' ? '#1d61d5' : '#34a4ff',
          },
        },
        typography: {
          fontFamily: '"InterVar","Roboto","Helvetica","Arial",sans-serif',
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: css`
                @font-face {
                  font-family: 'InterVar';
                  font-weight: 300 900;
                  font-display: swap;
                  font-style: normal;
                  src:
                    url(${InterVar}) format('woff2-variations'),
                    url(${InterVar}) format('woff2');
                  src: url(${InterVar}) format('woff2') tech('variations');
                }
                @font-face {
                  font-family: 'InterVar';
                  font-weight: 300 900;
                  font-display: swap;
                  font-style: italic;
                  src:
                    url(${InterVarItalic}) format('woff2-variations'),
                    url(${InterVarItalic}) format('woff2');
                  src: url(${InterVarItalic}) format('woff2') tech('variations');
                }
                @font-face {
                  font-family: 'JetBrainsMonoVar';
                  font-weight: 300 900;
                  font-display: swap;
                  font-style: normal;
                  src:
                    url(${JetBrainsMonoVar}) format('woff2-variations'),
                    url(${JetBrainsMonoVar}) format('woff2');
                  src: url(${JetBrainsMonoVar}) format('woff2')
                    tech('variations');
                }
                @font-face {
                  font-family: 'JetBrainsMonoVar';
                  font-weight: 300 900;
                  font-display: swap;
                  font-style: italic;
                  src:
                    url(${JetBrainsMonoVarItalic}) format('woff2-variations'),
                    url(${JetBrainsMonoVarItalic}) format('woff2');
                  src: url(${JetBrainsMonoVarItalic}) format('woff2')
                    tech('variations');
                }
              `,
            },
          },
          MuiButton: {
            variants: [
              {
                props: { variant: 'contained' },
                style: {
                  boxShadow: 'none',
                },
              },
            ],
          },
        },
      }),
    [mode],
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
              new Date('2023-06-03'),
              new Date('2023-06-05'),
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
          color: ${mode === 'light'
            ? theme.palette.primary[900]
            : theme.palette.primary[400]};
        }

        .SnackbarContent-root:not(
            .SnackbarContent-variantSuccess,
            .SnackbarContent-variantError,
            .SnackbarContent-variantWarning,
            .SnackbarContent-variantInfo
          )
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
          {/* <SplashWrapper /> */}
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
