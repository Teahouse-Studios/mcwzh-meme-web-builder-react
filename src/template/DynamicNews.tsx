import {
  Dialog,
  IconButton,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Card,
  Container,
  Typography,
  ButtonBase,
  ThemeProvider,
  createTheme,
  CircularProgress,
} from '@mui/material'
import { AspectRatio } from 'react-aspect-ratio'
import { css } from '@emotion/react'
import { useState, useEffect } from 'react'
import { Close, ArrowRight, Play } from 'mdi-material-ui'
import { useEffectOnce, useLocalStorage } from 'usehooks-ts'
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
  const [showVideo, setShowVideo] = useState(false)
  const [hideIFrame, setHideIFrame] = useState(true)
  const [newsIgnored, setNewsIgnored] = useLocalStorage('memeNewsIgnored', 0)
  const [news, setNews] = useState({} as News)

  // let news: News | undefined

  useEffectOnce(() => {
    fetch('https://fe.wd-ljt.com/meme/dynamic/news.json')
      .then(async (res) => {
        const data = (await res.json()) as News
        setNews(data)
        if (data.id > newsIgnored) {
          setDialogOpen(true)
        }
      })
      .catch((e) => {
        console.error(e)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  useEffect(() => {
    if (!dialogOpen && news.id) {
      setNewsIgnored(news.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen])

  return (
    <Dialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      maxWidth="md"
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
          onClick={() => {
            setDialogOpen(false)
          }}
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
              display: inline-block;
            `}
          />
        )}
        {news.video && (
          <ThemeProvider
            theme={createTheme({
              palette: {
                mode: 'dark',
              },
            })}
          >
            <Card elevation={3} sx={{}}>
              {showVideo && (
                <AspectRatio
                  ratio="16 / 9"
                  style={{
                    display: hideIFrame ? 'none' : 'block',
                  }}
                >
                  <iframe
                    src={news.video}
                    sandbox="allow-scripts allow-same-origin"
                    scrolling="no"
                    css={css`
                      border: 0;
                    `}
                    allow="autoplay; encrypted-media; fullscreen"
                    onLoad={() => setHideIFrame(false)}
                  />
                </AspectRatio>
              )}
              {hideIFrame && (
                <AspectRatio ratio="16 / 9">
                  <ButtonBase
                    onClick={() => {
                      setShowVideo(true)
                    }}
                  >
                    <Container>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '100%',
                          color: '#fff',
                        }}
                      >
                        {showVideo ? (
                          <CircularProgress />
                        ) : (
                          <>
                            <Play
                              sx={{
                                fontSize: '36px',
                                verticalAlign: 'middle',
                              }}
                            />
                            <Typography
                              variant="body1"
                              sx={{ ml: 1, verticalAlign: 'middle' }}
                            >
                              播放视频
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Container>
                  </ButtonBase>
                </AspectRatio>
              )}
            </Card>
          </ThemeProvider>
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
          <Button
            sx={{ mt: 1 }}
            href={news.detail}
            target="_blank"
            rel="noopener"
            startIcon={<ArrowRight />}
          >
            阅读更多
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}
