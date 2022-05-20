import {
  ThemeProvider,
  AppBar,
  Toolbar,
  Typography,
  Button,
  MenuItem,
  Menu,
  createTheme,
} from '@mui/material'
import { useState, MouseEvent } from 'react'
import { Github } from 'mdi-material-ui'

export default function MemeAppBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

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
          <Button onClick={handleMenu} color="inherit" startIcon={<Github />}>
            GitHub
          </Button>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  )
}
