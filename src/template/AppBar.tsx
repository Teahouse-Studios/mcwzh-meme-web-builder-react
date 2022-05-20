import {
  ThemeProvider,
  AppBar,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material'
import { Github } from 'mdi-material-ui'
import CompositeMenu from './CompositeMenu'

export default function MemeAppBar() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#fff',
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            梗体中文 · 在线构建
          </Typography>

          <CompositeMenu icon={<Github />} items={[
            { name: 'Java 版', href: 'https://github.com/Teahouse-Studios/mcwzh-meme-resourcepack' },
            { name: '基岩版', href: 'https://github.com/Teahouse-Studios/mcwzh-meme-resourcepack-bedrock' }
          ]}>GitHub</CompositeMenu>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  )
}
