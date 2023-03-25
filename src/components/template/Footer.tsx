import {
  Paper,
  ThemeProvider,
  createTheme,
  Grid,
  Container,
  Typography,
  createSvgIcon,
  IconButton,
  Button,
  Box,
  useMediaQuery,
} from '@mui/material'
import type { ReactNode } from 'react'
import {
  Web,
  NewspaperVariantOutline,
  Email,
  Github,
  LightningBolt,
  Lock,
  Script,
} from '@teahouse-studios/mdi-material-ui'
import Logo from '../../assets/logo.svg'

export default function TeahouseFooter() {
  const theme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#323437',
      },
    },
    typography: {
      fontFamily: '"InterVar","Roboto","Helvetica","Arial",sans-serif',
    },
  })

  const smAndDown = useMediaQuery(theme.breakpoints.up('md'))

  const Bilibili = createSvgIcon(
    <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373Z" />,
    'bilibili',
  )

  return (
    <ThemeProvider theme={theme}>
      <Paper
        square={true}
        elevation={12}
        sx={{
          p: '30px',
          px: 4,
          mt: 2,
        }}
      >
        <Container>
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="space-between"
            alignItems="end"
          >
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  mb: 1,
                }}
              >
                <LinkLabel>关注我们</LinkLabel>

                <LinkIconButton href="https://teahouse.team/" title="官网">
                  <Web />
                </LinkIconButton>
                <LinkIconButton
                  href="https://story.teahouse.team/"
                  title="博客"
                >
                  <NewspaperVariantOutline />
                </LinkIconButton>
                <LinkIconButton href="mailto:admin@teahou.se" title="邮箱">
                  <Email />
                </LinkIconButton>
                <LinkIconButton
                  href="https://space.bilibili.com/406275313"
                  title="哔哩哔哩"
                >
                  <Bilibili />
                </LinkIconButton>
                <LinkIconButton
                  href="https://github.com/Teahouse-Studios"
                  title="GitHub"
                >
                  <Github />
                </LinkIconButton>
                <LinkIconButton
                  href="https://afdian.net/@teahouse"
                  title="爱发电"
                >
                  <LightningBolt />
                </LinkIconButton>
              </Box>
              <Box
                sx={{
                  mb: 1,
                }}
              >
                <LinkLabel>产品</LinkLabel>

                <LinkButton href="https://meme.teahouse.team/">
                  梗体中文
                </LinkButton>
                <LinkButton href="https://bot.teahouse.team/">小可</LinkButton>
              </Box>

              <Box
                sx={{
                  mb: 1,
                }}
              >
                <LinkLabel>法律</LinkLabel>

                <LinkButton
                  href="https://teahouse.team/terms"
                  icon={<Script />}
                >
                  服务条款
                </LinkButton>
                <LinkButton
                  href="https://teahouse.team/privacy"
                  icon={<Lock />}
                >
                  隐私政策
                </LinkButton>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                textAlign: smAndDown ? 'right' : 'center',
              }}
            >
              <a
                href="https://teahouse.team/"
                target="_blank"
                rel="noopener noreferrer"
                title="Teahouse Studios"
              >
                <Box
                  component="img"
                  src={Logo}
                  height="50px"
                  sx={{
                    filter: 'invert(1)',
                    display: 'inline-block',
                  }}
                  alt="Teahouse Studios"
                  loading="lazy"
                />
              </a>
              <br />
              <Typography
                variant="body2"
                component="a"
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noreferrer noopener"
                sx={{
                  color: 'white !important',
                  textDecoration: 'none',
                }}
              >
                蜀 ICP 备 2022011374 号-1
              </Typography>
              <br />
              <Typography variant="body2" component="span">
                © 2022 成都问谛居科技有限公司
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Paper>
    </ThemeProvider>
  )
}

interface ChildrenProps {
  children: ReactNode
}

function LinkLabel({ children }: ChildrenProps) {
  return (
    <Typography
      variant="caption"
      component="span"
      sx={{
        display: {
          xs: 'block',
          md: 'inline',
        },
        mr: 3,
      }}
    >
      {children}
    </Typography>
  )
}

function LinkIconButton({
  children,
  href,
  title,
}: {
  children: ReactNode
  href: string
  title: string
}) {
  return (
    <Box
      sx={{
        display: 'inline-block',
        mr: 1,
      }}
    >
      <IconButton
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={title}
        size="small"
      >
        {children}
      </IconButton>
    </Box>
  )
}

function LinkButton({
  children,
  href,
  icon,
}: {
  children: ReactNode
  href: string
  icon?: JSX.Element
}) {
  return (
    <Box
      sx={{
        display: 'inline-block',
        mr: 1,
      }}
    >
      <Button
        variant="text"
        size="small"
        startIcon={icon}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: 'white',
        }}
      >
        {children}
      </Button>
    </Box>
  )
}
