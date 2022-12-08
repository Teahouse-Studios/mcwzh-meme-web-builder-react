/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  FormatQuoteOpen,
  Heart,
  MessageText,
} from 'mdi-material-ui'
import { useTranslation } from 'react-i18next'
import { useState, useEffect, createElement } from 'react'
import { useAd } from '../hooks/useAd'
import { useEffectOnce } from 'usehooks-ts'

export default function QuoteAd() {
  const { t } = useTranslation()
  const { adAccepted } = useAd()
  const [msgs, setMsgs] = useState<{ [key: string]: string }>({
    [t('sponsor.quoteAd.author')]: t('sponsor.quoteAd.none'),
  })
  const [msg, setMsg] = useState<{
    msg: string
    author: string
  }>({
    msg: t('sponsor.quoteAd.none'),
    author: t('sponsor.quoteAd.author'),
  })
  const [rollDice, setRollDice] = useState('')
  const [randomDice, setRandomDice] = useState(5)

  const roll = (data: { [key: string]: string } = msgs) => {
    const random = Math.floor(Math.random() * Object.entries(data).length)
    const entry = Object.entries(data)[random]
    const randomD = Math.floor(Math.random() * 6)
    setRollDice('rolling-dice')
    setTimeout(() => {
      setRollDice('')
      setMsg({
        msg: entry[1],
        author: entry[0],
      })
      setRandomDice(randomD)
    }, 1000)
  }
  useEffectOnce(() => {
    fetch('https://fe.wd-ljt.com/meme/dynamic/sp_messages.json')
      .then(async (res) => {
        const data = (await res.json()) as { [key: string]: string }
        setMsgs(data)
      })
      .catch((e) => {
        console.error(e)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  useEffect(() => {
    roll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgs])

  return (
    <>
      <Card sx={{ width: '100%' }} variant="outlined">
        <CardContent
          sx={{
            '&:last-child': {
              pb: '16px',
            },
          }}
        >
          <Typography
            component="p"
            variant="caption"
            sx={{ mb: 1, color: 'text.secondary' }}
          >
            <MessageText
              fontSize="small"
              sx={{ verticalAlign: 'middle', mr: 1 }}
            ></MessageText>
            {t('sponsor.quoteAd.subtitle')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <Box sx={{ mb: 1, display: 'flex', opacity: 0.8, mr: 2 }}>
                <FormatQuoteOpen
                  fontSize="large"
                  sx={{ color: 'text.secondary' }}
                />
              </Box>
              <Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {msg.msg}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {msg.author}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Tooltip title={t('sponsor.roll')}>
                <IconButton
                  disabled={rollDice !== ''}
                  onClick={() => roll(msgs)}
                >
                  <Dice rollDice={rollDice} randomDice={randomDice as 0} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Divider sx={{ mt: 2, mb: 1 }} />
          <Box sx={{ textAlign: 'center', maxWidth: '500px', mx: 'auto' }}>
            <Typography component="h2" variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t('sponsor.overline')}
            </Typography>
            <Typography variant="body1">{t('sponsor.thankYou')}</Typography>
            <a
              href="https://afdian.net/@teahouse"
              rel="noopener noreferrer"
              target="_blank"
              title="爱发电赞助者列表"
            >
              <Box
                component="img"
                src="https://fe.wd-ljt.com/m3me/sP0ns0r5/sP0ns0r5.svg" // lol easylist
                alt="爱发电赞助者列表"
                sx={{
                  width: '100%',
                  height: 'auto',
                  margin: 0,
                  display: 'inline-block',
                }}
                loading="lazy"
              />
            </a>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="caption"
            component="p"
            sx={{ mt: 1, color: 'text.secondary' }}
          >
            {t('log.ad.donationNotice')}
            {t('sponsor.quoteAd.commercialWarning')}
          </Typography>
          <Button
            className="donate-button"
            startIcon={<Heart />}
            color="error"
            href="https://afdian.net/@teahouse"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              adAccepted()
            }}
            sx={{ mr: 1 }}
          >
            {t('footer.donate')}
          </Button>
        </CardContent>
      </Card>
    </>
  )
}

const Dice = ({
  rollDice,
  randomDice,
}: {
  rollDice: string
  randomDice: 0 | 1 | 2 | 3 | 4 | 5
}) => {
  return createElement([Dice1, Dice2, Dice3, Dice4, Dice5, Dice6][randomDice], {
    className: rollDice,
    sx: {
      '& svg': {
        transition: 'all 0.2s ease-in-out',
      },
    },
  })
}
