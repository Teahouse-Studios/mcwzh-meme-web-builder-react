import './App.css'
import MemeAppBar from './template/AppBar'
import { useMemo } from 'react'
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from '@mui/material'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import zhHans from './locales/zh-hans.json'
import zhMeme from './locales/zh-meme.json'

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

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MemeAppBar />
    </ThemeProvider>
  )
}

export default App
