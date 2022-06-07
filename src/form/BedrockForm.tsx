import { useState, useEffect, Dispatch, SetStateAction, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Grid,
  Stack,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  Switch,
  InputLabel,
  Select,
  Slider,
  MenuItem,
  Box,
  Typography,
  SelectChangeEvent,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useSnackbar } from 'notistack'
import {
  Archive,
  Group,
  AccountChildCircle,
  CloudDownload,
  FolderInformation,
} from 'mdi-material-ui'
import { css } from '@emotion/react'
import ResourceSelect from './ResourceSelect'
import { MemeModule, MemeApi, BuildLog } from './types'
import allowTracking from '../tracking'

export default function BedrockForm({
  api,
  addLog,
}: {
  api: MemeApi
  addLog: (log: BuildLog) => void
}) {
  const [enabledCollections, setEnabledCollections] = useState<string[]>([])
  const [defaultCollections, setDefaultCollections] = useState<string[]>([])
  const [disabledCollections, setDisabledCollections] = useState<string[]>([])
  const [enabledModules, setEnabledModules] = useState<string[]>([])
  const [defaultModules, setDefaultModules] = useState<string[]>([])
  const [disabledModules, setDisabledModules] = useState<string[]>([])
  const [beExtType, setBeExtType] = useState<'mcpack' | 'zip'>('mcpack')
  const [useCompatible, setUseCompatible] = useState<boolean>(false)
  const [sfw, setSfw] = useState<number>(2)
  const [submitting, setSubmitting] = useState(false)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { t } = useTranslation()

  useEffect(() => {
    setDefaultCollections(['choice_modules_1'])
  })

  const handleSelectChange = <T,>(
    event: SelectChangeEvent<T>,
    setState: Dispatch<SetStateAction<T>>
  ) => {
    const {
      target: { value },
    } = event
    setState(value as unknown as T)
  }

  const undefinedPredicate = <T,>(i: T | undefined) => i !== undefined

  useEffect(() => {
    const getModulesInCollection = () => {
      return enabledCollections
        .flatMap(
          (m) => api?.be_modules.collection!.find((c) => c.name === m)?.contains
        )
        .filter(undefinedPredicate) as string[]
    }
    const getIncompatibleModulesInCollection = () => {
      return api?.be_modules.resource
        .filter((resourceModules) =>
          enabledCollections
            .flatMap(
              (enabledCollection) =>
                api?.be_modules.collection!.find(
                  (collection) => collection.name === enabledCollection
                )?.contains
            )
            .filter(undefinedPredicate)
            .includes(resourceModules.name)
        )
        .flatMap((resourceModule) => resourceModule.incompatible_with)
        .filter(undefinedPredicate) as string[]
    }

    let sfwModules: string[] = []

    switch (sfw) {
      case 1:
        sfwModules = ['lang_sfc', 'lang_sfw']
        break
      case 2:
        sfwModules = ['lang_sfw']
        break
      case 3:
        sfwModules = []
        break
    }

    let versionModules: string[] = []

    setDefaultModules([
      ...getModulesInCollection(),
      ...getIncompatibleModulesInCollection(),
      ...sfwModules,
      ...versionModules,
    ])
  }, [enabledCollections, sfw, api])

  const calculatedEnabledCollections = useMemo(
    () => [...enabledCollections, ...defaultCollections],
    [enabledCollections, defaultCollections]
  )

  const calculatedEnabledModules = useMemo(
    () => [...enabledModules, ...defaultModules],
    [enabledModules, defaultModules]
  )

  const handleSubmit = () => {
    if (allowTracking)
      window.gtag('event', 'build', {
        eventType: 'be',
      })

    setSubmitting(true)
    fetch('https://meme.wd-api.com/ajax', {
      method: 'POST',
      body: JSON.stringify({
        _be: true,
        type: beExtType,
        compatible: useCompatible,
        mod: [],

        modules: {
          resource: calculatedEnabledModules,
          collection: calculatedEnabledCollections,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setSubmitting(false)
            addLog({
              status: 'success',
              platform: 'bedrock',
              log: data.logs as string,
              downloadUrl: data.root + data.filename,
              time: Date.now(),
            })
            enqueueSnackbar(t('snackbar.buildSuccess'), { variant: 'success' })
          })
        } else {
          res.json().then((data) => {
            setSubmitting(false)
            addLog({
              status: 'error',
              platform: 'bedrock',
              log: data.logs as string,
              time: Date.now(),
            })
            enqueueSnackbar(t('snackbar.buildError'), {
              variant: 'error',
            })
          })
        }
      })
      .catch((err) => {
        setSubmitting(false)
        addLog({
          status: 'error',
          platform: 'bedrock',
          log: err as string,
          time: Date.now(),
        })
        enqueueSnackbar(t('snackbar.buildError'), {
          variant: 'error',
        })
      })
    document.getElementById('build-log')?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <Grid
      container
      spacing={{
        xs: 1,
        md: 2,
      }}
    >
      <Grid item xs={12} md={6}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <FolderInformation
            sx={{ color: 'action.active', marginTop: '16.5px', mr: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>{t('form.version.label')}</InputLabel>
            <Select
              label={t('form.beExtType.label')}
              value={beExtType}
              onChange={(e) => {
                handleSelectChange(e, setBeExtType)
              }}
            >
              <MenuItem value="mcpack">.mcpack</MenuItem>
              <MenuItem value="zip">.zip</MenuItem>
            </Select>
            <FormHelperText>{t('form.beExtType.helper')}</FormHelperText>
          </FormControl>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <ResourceSelect
          onChange={(v) => {
            setEnabledModules(v)
          }}
          options={api?.be_modules.resource!}
          defaultOptions={defaultModules}
          disabledOptions={disabledModules}
          label={t('form.resource.label')}
          helper={t('form.resource.helper')}
          prependIcon={<Archive />}
        />
      </Grid>
      <Grid item xs={12}>
        <ResourceSelect
          onChange={(v) => {
            setEnabledCollections(v)
          }}
          defaultOptions={defaultCollections}
          disabledOptions={disabledCollections}
          options={api?.be_modules.collection!}
          label={t('form.collections.label')}
          helper={t('form.collections.helper')}
          prependIcon={<Group />}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <FormControlLabel
            control={
              <Switch
                checked={useCompatible}
                onChange={(e, c) => setUseCompatible(c)}
              />
            }
            label={t('form.compatible.label')}
            sx={{ color: 'text.secondary' }}
          />
          <FormHelperText>{t('form.compatible.disabled')}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2}>
          <FormLabel sx={{ whiteSpace: 'nowrap' }}>
            <AccountChildCircle
              sx={{ color: 'action.active', mr: 1, verticalAlign: 'bottom' }}
            />
            {t('form.child.label')}
          </FormLabel>
          <Box sx={{ width: '100%' }}>
            <Slider
              onChange={(e, v) => {
                setSfw(v as number)
              }}
              sx={{ mx: 1 }}
              value={sfw}
              step={1}
              marks={[
                { value: 1, label: t('form.child.ticks.0') },
                { value: 2, label: t('form.child.ticks.1') },
                { value: 3, label: t('form.child.ticks.2') },
              ]}
              min={1}
              max={3}
            />
            <FormHelperText>
              {t('form.child.helpers.' + (sfw - 1))}
            </FormHelperText>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('form.bedrockHint.text')}
          <a
            href="https://github.com/Teahouse-Studios/mcwzh-meme-resourcepack-bedrock"
            rel="noopener noreferer"
            target="_blank"
          >
            {t('form.bedrockHint.readme')}
          </a>
          {t('form.bedrockHint.end')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <LoadingButton
          color="primary"
          variant="contained"
          startIcon={<CloudDownload />}
          loading={submitting}
          onClick={() => handleSubmit()}
        >
          {t('form.submit')}
        </LoadingButton>
        <Typography
          variant="body2"
          component="span"
          sx={{
            ml: {
              md: 2,
            },
            mt: {
              xs: 1,
              md: 0,
            },
            display: {
              xs: 'block',
              md: 'inline',
            },
            color: 'text.secondary',
          }}
        >
          {t('form.modified')}
          {new Date(api?.be_modified).toLocaleString()}
        </Typography>
      </Grid>
    </Grid>
  )
}
