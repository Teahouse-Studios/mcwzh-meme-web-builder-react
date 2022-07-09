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
  ListSubheader,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { LoadingButton } from '@mui/lab'
import {
  Archive,
  Clock,
  Cog,
  SelectGroup,
  Group,
  AccountChildCircle,
  CloudDownload,
} from 'mdi-material-ui'
import { css } from '@emotion/react'
import ResourceSelect from './ResourceSelect'
import { MemeApi, BuildLog } from './types'
import allowTracking from '../tracking'

export default function JavaForm({
  api,
  addLog,
}: {
  api: MemeApi
  addLog: (log: BuildLog) => void
}) {
  const [enabledCollections, setEnabledCollections] = useState<string[]>([])
  const [fixedCollections, setFixedCollections] = useState<string[]>([])
  const [enabledResourceModules, setEnabledResourceModules] = useState<
    string[]
  >([])
  const [enabledLanguageModules, setEnabledLanguageModule] = useState<string[]>(
    []
  )
  const [defaultResourceModules] = useState<string[]>([])
  const [defaultLanguageModules] = useState<string[]>([])
  const [disabledResourceModules, setDisabledResourceModules] = useState<
    string[]
  >([])
  const [disabledLanguageModules, setDisabledLanguageModules] = useState<
    string[]
  >([])
  const [fixedResourceModules, setFixedResourceModules] = useState<string[]>([])
  const [fixedLanguageModules, setFixedLanguageModules] = useState<string[]>([])
  const [gameVersion, setGameVersion] = useState<number>(9)
  const [enabledMods, setEnabledMods] = useState<string[]>([])
  const [useCompatible, setUseCompatible] = useState<boolean>(false)
  const [forceUseCompatible, setForceUseCompatible] = useState(false)
  const [sfw, setSfw] = useState<number>(2)
  const [submitting, setSubmitting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()

  useEffect(() => {
    setEnabledMods(api.mods)
    setEnabledCollections(['choice_modules_default'])
  }, [api])

  const resourcePredicate = (i: string) => !i.startsWith('lang_')
  const langPredicate = (i: string) => i.startsWith('lang_')
  const undefinedPredicate = <T,>(i: T | undefined) => i !== undefined

  useEffect(() => {
    type ArrayFilterPredicate = (
      value: string,
      index: number,
      array: string[]
    ) => boolean

    const getModulesInCollection = (predicate: ArrayFilterPredicate) => {
      return enabledCollections
        .flatMap((m) =>
          api.je_modules.collection
            .find((c) => c.name === m)
            ?.contains?.filter(predicate)
        )
        .filter(undefinedPredicate) as string[]
    }
    const getIncompatibleModulesInCollection = (
      predicate: ArrayFilterPredicate
    ) => {
      return api.je_modules.resource
        .filter((resourceModules) =>
          enabledCollections
            .flatMap((enabledCollection) =>
              api.je_modules.collection
                .find((collection) => collection.name === enabledCollection)
                ?.contains?.filter(predicate)
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

    switch (gameVersion) {
      case 9:
        versionModules = []
        setForceUseCompatible(false)
        break
      case 8:
        versionModules = ['version_1.18.2']
        setForceUseCompatible(false)
        break
      case 7:
        versionModules = ['version_1.17.1']
        setForceUseCompatible(false)
        break
      case 6:
        versionModules = ['version_1.16.5']
        setForceUseCompatible(false)
        break
      case 5:
      case 4:
        versionModules = ['version_1.12.2-1.15.2']
        setForceUseCompatible(false)
        break
      case 3:
        versionModules = ['version_1.12.2-1.15.2']
        setForceUseCompatible(true)
        break
    }

    setFixedResourceModules([...getModulesInCollection(resourcePredicate)])
    setFixedLanguageModules([
      ...getModulesInCollection(langPredicate),
      ...sfwModules,
    ])
    setDisabledResourceModules([
      ...getIncompatibleModulesInCollection(resourcePredicate),
    ])
    setDisabledLanguageModules([
      ...getIncompatibleModulesInCollection(langPredicate),
    ])
    setFixedCollections([...versionModules])
  }, [enabledCollections, sfw, gameVersion, api])

  const handleSelectChange = <T,>(
    event: SelectChangeEvent<T>,
    setState: Dispatch<SetStateAction<T>>
  ) => {
    const {
      target: { value },
    } = event
    setState(value as unknown as T)
  }

  const calculatedEnabledCollections = useMemo(
    () => [...enabledCollections, ...fixedCollections],
    [enabledCollections, fixedCollections]
  )

  const calculatedEnabledResourceModules = useMemo(
    () => [
      ...enabledResourceModules,
      ...defaultResourceModules,
      ...fixedResourceModules,
    ],
    [enabledResourceModules, defaultResourceModules, fixedResourceModules]
  )

  const calculatedEnabledLanguageModules = useMemo(
    () => [
      ...enabledLanguageModules,
      ...defaultLanguageModules,
      ...fixedLanguageModules,
    ],
    [enabledLanguageModules, defaultLanguageModules, fixedLanguageModules]
  )

  const handleSubmit = () => {
    if (allowTracking)
      window.gtag('event', 'build', {
        eventType: 'be',
      })

    setSubmitting(true)
    interface Data {
      logs: string
      root: string
      filename: string
    }
    fetch('https://meme.wd-api.com/ajax', {
      method: 'POST',
      body: JSON.stringify({
        _be: false,
        type: gameVersion === 3 ? 'legacy' : 'normal',
        compatible: useCompatible || forceUseCompatible,
        format: gameVersion,
        mod: enabledMods,
        modules: {
          resource: [
            ...calculatedEnabledResourceModules,
            ...calculatedEnabledLanguageModules,
          ],
          collection: calculatedEnabledCollections,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 200) {
          res
            .json()
            .then((data: Data) => {
              setSubmitting(false)
              addLog({
                status: 'success',
                platform: 'java',
                log: data.logs,
                downloadUrl: data.root + data.filename,
                time: Date.now(),
              })
              enqueueSnackbar(t('snackbar.buildSuccess'), {
                variant: 'success',
              })
            })
            .catch(catchFetch)
        } else {
          res
            .json()
            .then((data: Data) => {
              setSubmitting(false)
              addLog({
                status: 'error',
                platform: 'java',
                log: data.logs,
                time: Date.now(),
              })
              enqueueSnackbar(t('snackbar.buildError'), { variant: 'error' })
            })
            .catch(catchFetch)
        }
      })
      .catch(catchFetch)
    document.getElementById('build-log')?.scrollIntoView({
      behavior: 'smooth',
    })

    function catchFetch(error: Error) {
      setSubmitting(false)
      addLog({
        status: 'error',
        platform: 'java',
        log: `${error.name}: ${error.message}`,
        time: Date.now(),
      })
      enqueueSnackbar(t('snackbar.buildError'), { variant: 'error' })
    }
  }

  return (
    <Grid
      container
      spacing={{
        xs: 1,
        md: 2,
      }}
      css={css`
        .MuiGrid-item {
          margin-bottom: 8px;
        }
      `}
    >
      <Grid item xs={12} md={6}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Clock sx={{ color: 'action.active', marginTop: '16.5px', mr: 2 }} />
          <FormControl fullWidth>
            <InputLabel>{t('form.version.label')}</InputLabel>
            <Select
              label={t('form.version.label')}
              value={gameVersion}
              css={css`
                .version-caption {
                  display: none;
                }
              `}
              onChange={(e) => {
                setGameVersion(e.target.value as number)
              }}
            >
              {[
                {
                  version: '1.19+',
                  format: 9,
                  caption: `${t('form.version.captions.release')}${t(
                    'metadata.ideographicComma'
                  )}${t('form.version.captions.snapshot')}`,
                },
                { version: '1.18 - 1.18.2', format: 8 },
                { version: '1.17 - 1.17.1', format: 7 },
                { version: '1.16.2 - 1.16.5', format: 6 },
                { version: '1.15 - 1.16.1', format: 5 },
                { version: '1.13 - 1.14.4', format: 4 },
                {
                  version: '1.11 - 1.12.2',
                  format: 3,
                  caption: t('form.version.captions.compatible'),
                },
              ].map((i) => (
                <MenuItem key={i.version} value={i.format}>
                  {i.version}
                  <Typography
                    component="span"
                    className="version-caption"
                    variant="body2"
                    sx={{ color: 'text.secondary', mr: 0, ml: 'auto' }}
                    hidden={!i.caption}
                  >
                    {i.caption}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{t('form.version.helper')}</FormHelperText>
          </FormControl>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <SelectGroup
            sx={{ color: 'action.active', marginTop: '16.5px', mr: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>{t('form.mod.label')}</InputLabel>
            <Select
              label={t('form.mod.label')}
              multiple
              value={enabledMods}
              onChange={(e) => {
                handleSelectChange(e, setEnabledMods)
              }}
            >
              <MenuItem
                disabled={enabledMods.length === 0}
                onClick={() => setEnabledMods([])}
              >
                {t('form.clearSelected')}
              </MenuItem>
              <ListSubheader>
                <Typography component="span" variant="subtitle2">
                  {t('form.mod.header')}
                </Typography>
              </ListSubheader>
              {api.mods.map((m) => (
                <MenuItem value={m} key={m}>
                  {m}
                </MenuItem>
              ))}
              <ListSubheader>
                <Typography component="span" variant="subtitle2">
                  {t('form.mod.enHeader')}
                </Typography>
              </ListSubheader>
              {api.enmods.map((m) => (
                <MenuItem value={m} key={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{t('form.mod.helper')}</FormHelperText>
          </FormControl>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <ResourceSelect
          onChange={(v) => {
            setEnabledResourceModules(v)
          }}
          unselectAll={() => {
            setEnabledCollections([])
          }}
          options={api.je_modules.resource.filter(
            (i) => !i.name.startsWith('lang_') // separate lang modules
          )}
          defaultOptions={defaultResourceModules}
          disabledOptions={disabledResourceModules}
          fixedOptions={fixedResourceModules}
          label={t('form.resource.label')}
          helper={t('form.resource.helper')}
          prependIcon={<Archive />}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <ResourceSelect
          onChange={(v) => {
            setEnabledLanguageModule(v)
          }}
          unselectAll={() => {
            setEnabledCollections([])
          }}
          options={api.je_modules.resource.filter(
            (i) => i.name.startsWith('lang_') // separate lang modules
          )}
          defaultOptions={defaultLanguageModules}
          disabledOptions={disabledLanguageModules}
          fixedOptions={fixedLanguageModules}
          label={t('form.language.label')}
          helper={t('form.language.helper')}
          prependIcon={<Cog />}
        />
      </Grid>
      <Grid item xs={12}>
        <ResourceSelect
          onChange={(v) => {
            setEnabledCollections(v)
          }}
          defaultOptions={[...fixedCollections, ...enabledCollections]}
          disabledOptions={fixedCollections}
          options={api.je_modules.collection}
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
                checked={useCompatible || forceUseCompatible}
                disabled={forceUseCompatible}
                onChange={(e, c) => setUseCompatible(c)}
              />
            }
            label={t('form.compatible.label')}
            sx={{ color: 'text.secondary' }}
          />
          <FormHelperText>
            {t(
              forceUseCompatible
                ? 'form.compatible.disabled'
                : 'form.compatible.helper'
            )}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 0, md: 2 }}
        >
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
              {t('form.child.helpers.' + (sfw - 1).toString())}
            </FormHelperText>
          </Box>
        </Stack>
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
          {new Date(api.je_modified).toLocaleString()}
        </Typography>
      </Grid>
    </Grid>
  )
}
