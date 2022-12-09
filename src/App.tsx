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
import { mdRefPalette } from './theme'

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
          primary: mdRefPalette.primary,
          secondary: mdRefPalette.secondary,
          t: mdRefPalette.t,
          neutral: mdRefPalette.neutral,
          neutralVariant: mdRefPalette.neutralVariant,
          error: mdRefPalette.error,
          background: {
            default: mode === 'dark' ? mdRefPalette.neutral[100] : undefined,
            paper: mdRefPalette.neutralVariant[mode === 'dark' ? 300 : 950],
          },
          mode,
        },
        shape: {
          borderRadius: 10,
        },
        typography: {
          fontFamily: '"InterVar","Roboto","Helvetica","Arial",sans-serif',
        },
        components: {
          MuiPaper: {
            variants: [
              {
                props: { variant: 'elevation' },
                style: {
                  backgroundColor:
                    mdRefPalette.neutral[mode === 'dark' ? 100 : 990],
                },
              },
              {
                props: { elevation: 0 },
                style: {
                  backgroundColor:
                    mdRefPalette.neutralVariant[mode === 'dark' ? 300 : 950],
                },
              },
            ],
          },
          MuiAppBar: {
            defaultProps: {
              elevation: 0,
            },
          },
          MuiAccordion: {
            defaultProps: {
              elevation: 0,
            },
          },
          MuiCssBaseline: {
            styleOverrides: {
              body: css`
                @font-face {
                  font-family: 'InterVar';
                  font-weight: 300 900;
                  font-display: swap;
                  font-style: normal;
                  src: url(${InterVar}) format('woff2-variations'),
                    url(${InterVar}) format('woff2');
                  src: url(${InterVar}) format('woff2') tech('variations');
                }
                @font-face {
                  font-family: 'InterVar';
                  font-weight: 300 900;
                  font-display: swap;
                  font-style: italic;
                  src: url(${InterVarItalic}) format('woff2-variations'),
                    url(${InterVarItalic}) format('woff2');
                  src: url(${InterVarItalic}) format('woff2') tech('variations');
                }
                @font-face {
                  font-family: 'JetBrainsMonoVar';
                  font-weight: 300 900;
                  font-display: swap;
                  font-style: normal;
                  src: url(${JetBrainsMonoVar}) format('woff2-variations'),
                    url(${JetBrainsMonoVar}) format('woff2');
                  src: url(${JetBrainsMonoVar}) format('woff2')
                    tech('variations');
                }
                @font-face {
                  font-family: 'JetBrainsMonoVar';
                  font-weight: 300 900;
                  font-display: swap;
                  font-style: italic;
                  src: url(${JetBrainsMonoVarItalic}) format('woff2-variations'),
                    url(${JetBrainsMonoVarItalic}) format('woff2');
                  src: url(${JetBrainsMonoVarItalic}) format('woff2')
                    tech('variations');
                }
              `,
            },
          },
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
          color: ${theme.palette.primary[mode === 'light' ? 'main' : 'dark']};
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
