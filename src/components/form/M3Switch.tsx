import { styled, Switch } from '@mui/material'

export default styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
  },
  '& .Mui-checked + .MuiSwitch-track': {
    opacity: '1 !important',
  },
  '& .Mui-checked .MuiSwitch-thumb': {
    width: 16,
    height: 16,
    margin: '2.5px 1.5px',
    backgroundColor: theme.palette.background.paper,
    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
      theme.palette.getContrastText(theme.palette.background.paper),
    )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
    backgroundPosition: 'center',
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 12,
    height: 12,
    margin: 4,
  },
}))
