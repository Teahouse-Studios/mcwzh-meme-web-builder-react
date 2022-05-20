import './App.css'
import { useState } from 'react'
import MemeAppBar from './template/AppBar'
import * as React from 'react'
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from '@mui/material'

function App() {
  const [count, setCount] = useState(0)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = React.useMemo(
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
