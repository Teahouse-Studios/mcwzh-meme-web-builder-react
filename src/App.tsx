import './App.css'
import MemeAppBar from './template/AppBar'
import { useMemo, createContext, useState } from 'react'
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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MemeAppBar />
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
