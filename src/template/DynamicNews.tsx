import {
  Dialog,
  IconButton,
  DialogContent,
  DialogTitle,
  Button,
  Box,
} from '@mui/material'
import { css } from '@emotion/react'
import { useState } from 'react'
import { Close, ArrowRight } from 'mdi-material-ui'
import { useLocalStorage } from 'usehooks-ts'
import MuiMarkdown from 'mui-markdown'

interface News {
  id: number
  title: string
  image?: string
  video?: string
  content: string
  detail?: string
}

export default function DynamicNews() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newsIgnored, setNewsIgnored] = useLocalStorage('memeNewsIgnored', 0)
  const [news, setNews] = useState({} as News)

  // let news: News | undefined

  fetch('https://fe.wd-ljt.com/meme/dynamic/news.json')
    .then(async (res) => {
      setNews(await res.json())
      if (news?.id! > newsIgnored) {
        setDialogOpen(true)
      }
    })
    .catch((e) => {
      console.error(e)
    })

  const dismissNews = (name: number) => {
    setDialogOpen(false)
    setNewsIgnored(name || newsIgnored)
  }

  return (
    <Dialog
      open={dialogOpen}
      onClose={() => dismissNews(news.id)}
      maxWidth="sm"
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        梗中新闻 #{news.id} - {news.title}
        <IconButton
          size="small"
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={() => setDialogOpen(false)}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pb: 3 }}>
        {news.image && (
          <img
            src={news.image}
            css={css`
              width: 100%;
            `}
          />
        )}
        {news.video && (
          <iframe
            src={news.video}
            css={css`
              width: 100%;
            `}
            scrolling="no"
            frameborder="no"
            framespacing="0"
            allowfullscreen="true"
          />
        )}
        <Box
          css={css`
            p,
            .MuiTypography-root {
              margin-bottom: 1rem;
            }
          `}
        >
          <MuiMarkdown>{news.content}</MuiMarkdown>
        </Box>
        {news.detail && (
          <Button sx={{ mt: 1 }} href={news.detail} startIcon={<ArrowRight />}>
            阅读更多
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}
