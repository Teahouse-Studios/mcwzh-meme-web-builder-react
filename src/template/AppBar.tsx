import { ReactNode, useState, MouseEvent } from 'react'
import {
  ThemeProvider,
  AppBar,
  Button,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  createTheme,
} from '@mui/material'
import { Github, Disc, Post } from 'mdi-material-ui'
import { useTranslation } from 'react-i18next'

export default function MemeAppBar() {
  const { t } = useTranslation()
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
            {t('appbar.title')}
          </Typography>
          <BarLinks />
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  )
}

function BarLinks() {
  const { t } = useTranslation()

  return (
    <>
      <CompositeMenu
        icon={<Post />}
        items={[
          {
            name: t('java'),
            href: 'https://www.mcbbs.net/thread-1004643-1-1.html',
          },
          {
            name: t('bedrock'),
            href: 'https://www.mcbbs.net/thread-1005191-1-1.html',
          },
        ]}
      >
        {t('appbar.mcbbs')}
      </CompositeMenu>
      <CompositeMenu
        icon={<Github />}
        items={[
          {
            name: t('java'),
            href: 'https://github.com/Teahouse-Studios/mcwzh-meme-resourcepack',
          },
          {
            name: t('bedrock'),
            href: 'https://github.com/Teahouse-Studios/mcwzh-meme-resourcepack-bedrock',
          },
        ]}
      >
        {t('appbar.github')}
      </CompositeMenu>
      <CompositeMenu
        icon={<Disc />}
        items={[
          {
            name: t('java'),
            href: 'https://wdf.ink/record-java',
          },
          {
            name: t('bedrock'),
            href: 'https://wdf.ink/record-bedrock',
          },
        ]}
      >
        {t('appbar.discPack')}
      </CompositeMenu>
    </>
  )
}

interface CompositeMenuProps {
  children: ReactNode
  icon: JSX.Element
  items: {
    name: string
    href: string
  }[]
}

function CompositeMenu(props: CompositeMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const openHref = (href: string) => {
    window.open(href, '_blank')
    handleClose()
  }

  return (
    <>
      <Button
        onClick={handleMenu}
        color="inherit"
        startIcon={props.icon}
        sx={{ ml: 1 }}
      >
        {props.children}
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
        {props.items.map((item) => (
          <MenuItem onClick={() => openHref(item.href)} key={item.name}>
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
