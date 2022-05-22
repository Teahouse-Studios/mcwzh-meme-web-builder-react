import {
  ReactNode,
  useState,
  MouseEvent,
  useContext,
  createContext,
} from 'react'
import {
  ThemeProvider,
  AppBar,
  Button,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  createTheme,
  useTheme,
  IconButton,
} from '@mui/material'
import {
  Github,
  Disc,
  Post,
  Translate,
  ChevronDown,
  Brightness7,
  Brightness4,
} from 'mdi-material-ui'
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
      <AppBar position="sticky" color="primary" sx={{ mb: 2 }}>
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
      <LangMenu />
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

function LangMenu() {
  interface Option {
    name: string
    value: string
  }

  const { t, i18n } = useTranslation()

  const options: Option[] = [
    { name: '简体中文', value: 'zhHans' },
    { name: '梗体中文', value: 'zhMeme' },
    { name: 'English', value: 'en' },
  ]

  let langIndex: number = 1
  options.filter((value, index) => {
    if (i18n.language === value.value) {
      langIndex = index
    }
  })

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedItem, setSelectedItem] = useState<Option>(options[langIndex])
  const open = Boolean(anchorEl)
  const handleButtonClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuItemClick = (
    event: MouseEvent<HTMLElement>,
    option: Option
  ) => {
    setSelectedItem(option)
    i18n.changeLanguage(option.value)
    console.log(option.value)
    setAnchorEl(null)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Button
        onClick={handleButtonClick}
        color="inherit"
        startIcon={<Translate />}
        endIcon={<ChevronDown />}
        sx={{ ml: 1 }}
      >
        {t('appbar.languages')}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {options.map((option, index) => (
          <MenuItem
            key={option.value}
            selected={option === selectedItem}
            onClick={(event) => handleMenuItemClick(event, option)}
          >
            {option.name}（{option.value}）
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

const ColorModeContext = createContext({ toggleColorMode: () => {} })

function ToggleColorMode() {
  const theme = useTheme()
  const colorMode = useContext(ColorModeContext)
  return (
    <IconButton
      sx={{ ml: 1 }}
      onClick={colorMode.toggleColorMode}
      color="inherit"
    >
      {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  )
}
