import { Button, Menu, MenuItem, SvgIcon } from '@mui/material'
import { useState, MouseEvent, ReactNode, MouseEventHandler } from 'react'

interface Props {
  children: ReactNode
  icon: JSX.Element
  items: {
    name: string
    href: string
  }[]
}

export default function CompositeMenu(props: Props) {
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
      <Button onClick={handleMenu} color="inherit" startIcon={props.icon}>
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
