import { type ReactNode, useState, type MouseEvent } from 'react'
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  IconButton,
  Box,
  type SxProps,
  styled,
} from '@mui/material'
import { css } from '@emotion/react'
import {
  Album,
  Translate,
  ChevronDown,
  DotsVertical,
} from '@teahouse-studios/mdi-material-ui'
import { useTranslation } from 'react-i18next'
import mcbbsLogo from '../../assets/mcbbs.svg'
import githubMark from '../../assets/github-mark.svg'
import githubLogo from '../../assets/github-logo.svg'
import SponsorButton from '../sponsor/SponsorButton'

export default function MemeAppBar() {
  const { t } = useTranslation()
  const theme = useTheme()
  const smAndDown = useMediaQuery(theme.breakpoints.up('md'))

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar
      color="default"
      position="sticky"
      sx={{ mb: 2 }}
      css={css`
        background-color: ${theme.palette.background.paper};
      `}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {t('appbar.title')}
        </Typography>
        {smAndDown ? (
          <BarLinks sx={{}} />
        ) : (
          <>
            <IconButton sx={{ ml: 1 }} onClick={handleClick} color="inherit">
              <DotsVertical />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <BarLinks
                sx={{
                  display: 'flex',
                  flexWrap: 'warp',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  pr: 1,
                }}
              />
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}

function BarLinks({ sx }: { sx: SxProps | undefined }) {
  const { t } = useTranslation()
  const Img18 = styled('img')(({ theme }) => ({
    filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'invert(0)',
    width: 'auto',
    height: '18px',
  }))
  const Img14 = styled('img')(({ theme }) => ({
    filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'invert(0)',
    width: 'auto',
    height: '14px',
  }))

  return (
    <Box sx={sx}>
      <SponsorButton sx={{ ml: 1 }} />
      <CompositeMenu
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
        <Img14
          src={mcbbsLogo}
          width={237}
          height={49}
          alt={t('appbar.mcbbs')}
        />
      </CompositeMenu>
      <CompositeMenu
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
        <Img18
          src={githubMark}
          alt=""
          width={98}
          height={96}
          sx={{
            mr: 0.75,
          }}
        />
        <Img18
          src={githubLogo}
          alt={t('appbar.github')}
          width={45}
          height={16}
          sx={{
            mr: 0.75,
          }}
        />
      </CompositeMenu>
      <CompositeMenu
        icon={<Album />}
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
    </Box>
  )
}

interface CompositeMenuProps {
  children: ReactNode
  icon?: JSX.Element
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
          <MenuItem
            onClick={() => {
              handleClose()
            }}
            key={item.name}
            component="a"
            href={item.href}
            rel="noopener noreferrer"
            target="_blank"
          >
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

  let langIndex = 1
  options.forEach((value, index) => {
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

  const handleMenuItemClick = async (
    event: MouseEvent<HTMLElement>,
    option: Option,
  ) => {
    setSelectedItem(option)
    await i18n.changeLanguage(option.value)
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
        {options.map((option) => (
          <MenuItem
            key={option.value}
            selected={option === selectedItem}
            onClick={(event) => {
              void handleMenuItemClick(event, option)
            }}
          >
            {option.name}（{option.value}）
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
