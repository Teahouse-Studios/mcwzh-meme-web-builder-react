import { Box, Fab, Zoom, useScrollTrigger } from '@mui/material'
import { ChevronUp } from 'mdi-material-ui'

export default function BackToTop() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  })

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        sx={[{ position: 'fixed', bottom: 24, right: 24, zIndex: 10 }]}
      >
        <Fab color="primary" size="small">
          <ChevronUp />
        </Fab>
      </Box>
    </Zoom>
  )
}
