import { IconButton } from '@mui/material'
import { useSnackbar, type SnackbarKey } from 'notistack'
import { Fragment, useEffect } from 'react'
import { Close } from '@teahouse-studios/mdi-material-ui'
import { useLocalStorage } from 'usehooks-ts'

interface Alert {
  name: string
  message: string
  emoji: string
}

export default function DynamicAlerts() {
  const [alertsRead, setAlertsRead] = useLocalStorage<string[]>(
    'memeAlertsRead',
    [],
  )
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const dismissAlert = (key: SnackbarKey, name: string) => {
    closeSnackbar(name)
    setAlertsRead((prev) => [...prev, name])
  }

  useEffect(() => {
    fetch('https://fe.wd-ljt.com/meme/dynamic/alerts.json')
      .then(async (res) => {
        const alerts = (await res.json()) as Alert[]

        alerts.forEach((alert) => {
          if (alertsRead.includes(alert.name)) return

          enqueueSnackbar(
            <span
              dangerouslySetInnerHTML={{
                __html: alert.emoji
                  ? alert.emoji + '&nbsp;' + alert.message
                  : '' + alert.message,
              }}
            ></span>,
            {
              key: alert.name,
              persist: true,
              preventDuplicate: true,
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
              action: (key) => (
                <Fragment>
                  <IconButton
                    onClick={() => dismissAlert(key, alert.name)}
                    sx={{ filter: 'invert(1)' }}
                  >
                    <Close />
                  </IconButton>
                </Fragment>
              ),
            },
          )
        })
      })
      .catch((e) => {
        console.error(e)
      })
  }, [])

  return <></>
}
