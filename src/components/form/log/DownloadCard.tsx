import { PropsOf } from '@emotion/react'
import {
  Card,
  CardActionArea,
  Typography,
  SvgIcon,
  CardActionAreaProps,
  SxProps,
  Box,
  IconButton,
} from '@mui/material'
import { Download } from 'mdi-material-ui'

interface DownloadCardProps {
  // props for CardActionArea
  actionProps: CardActionAreaProps & PropsOf<'a'>
  icon: typeof SvgIcon
  name: string
  caption: string
  highlighted?: boolean
  sx?: SxProps
}

export default function DownloadCard(props: DownloadCardProps) {
  return (
    <Card sx={{ width: 'fit-content', display: 'inline-flex', ...props.sx }}>
      <CardActionArea
        sx={{
          py: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
        }}
        {...props.actionProps}
      >
        <props.icon
          sx={{
            ml: 2,
            mr: 1,
            fontSize: '24px',
          }}
        />
        <Box sx={{ height: '100%', ml: 1, mr: 1 }}>
          <Typography variant="subtitle2">{props.name}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="caption">{props.caption}</Typography>
            {props.highlighted && '✨'}
          </Box>
        </Box>
        <IconButton sx={{ mr: 1 }}>
          <Download />
        </IconButton>
      </CardActionArea>
    </Card>
  )
}
