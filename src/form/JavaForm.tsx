import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useMemo,
  createElement,
} from 'react'
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
  Chip,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import {
  Archive,
  Clock,
  Cog,
  SelectGroup,
  Group,
  AccountChildCircle,
  CloudDownload,
  Information,
  ImageFilterHdr,
  Wifi,
  Candle,
  Pig,
  HexagonMultiple,
  Fish,
  Panda,
  Looks,
  HomeModern,
} from 'mdi-material-ui'
import { css } from '@emotion/react'
import ResourceSelect from './ResourceSelect'
import { MemeApi, BuildLog } from './types'
import allowTracking from '../tracking'
import endpoint from '../api'

export default function JavaForm({
  api,
  addLog,
  shouldCensor,
}: {
  api: MemeApi
  addLog: (log: BuildLog) => void
  shouldCensor: boolean
}) {
  const [enabledCollections, setEnabledCollections] = useState<string[]>([
    'choice_modules_default',
  ])
  const [fixedCollections, setFixedCollections] = useState<string[]>([])
  const [enabledResourceModules, setEnabledResourceModules] = useState<
    string[]
  >([])
  const [enabledLanguageModules, setEnabledLanguageModule] = useState<string[]>(
    []
  )
  const [disabledResourceModules, setDisabledResourceModules] = useState<
    string[]
  >([])
  const [disabledLanguageModules, setDisabledLanguageModules] = useState<
    string[]
  >([])
  const [fixedResourceModules, setFixedResourceModules] = useState<string[]>([])
  const [fixedLanguageModules, setFixedLanguageModules] = useState<string[]>([])
  const [gameVersion, setGameVersion] = useState<number>(9)
  const [enabledMods, setEnabledMods] = useState<string[]>(api.mods)
  const [useCompatible, setUseCompatible] = useState<boolean>(false)
  const [forceUseCompatible, setForceUseCompatible] = useState(false)
  const [sfw, setSfw] = useState<number>(shouldCensor ? 1 : 2)
  const [submitting, setSubmitting] = useState(false)
  const { t } = useTranslation()

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
      return [...enabledCollections, ...fixedCollections]
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
          [...enabledCollections, ...fixedCollections]
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

    if (shouldCensor) setSfw(1)

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
      case 11:
        versionModules = []
        setForceUseCompatible(false)
        break
      case 9:
        versionModules = ['version_1.19.2']
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
  }, [
    enabledCollections,
    sfw,
    gameVersion,
    api,
    fixedCollections,
    shouldCensor,
  ])

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
    () => [...enabledResourceModules, ...fixedResourceModules],
    [enabledResourceModules, fixedResourceModules]
  )

  const calculatedEnabledLanguageModules = useMemo(
    () => [...enabledLanguageModules, ...fixedLanguageModules],
    [enabledLanguageModules, fixedLanguageModules]
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
    fetch(`${endpoint}/v2/build/java`, {
      method: 'POST',
      body: JSON.stringify({
        type:
          gameVersion === 3
            ? 'legacy'
            : useCompatible
            ? 'compatible'
            : 'normal',
        format: gameVersion,
        mods: enabledMods,
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
                expanded: true,
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
                expanded: true,
              })
            })
            .catch(catchFetch)
        }
      })
      .catch(catchFetch)

    function catchFetch(error: Error) {
      setSubmitting(false)
      addLog({
        status: 'error',
        platform: 'java',
        log: `${error.name}: ${error.message}`,
        time: Date.now(),
        expanded: true,
      })
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
                  version: '1.19.3+',
                  format: 11,
                  caption: t('form.version.captions.snapshot'),
                },
                {
                  version: '1.19 - 1.19.2',
                  format: 9,
                  caption: t('form.version.captions.release'),
                  icon: Wifi,
                },
                { version: '1.18 - 1.18.2', format: 8, icon: ImageFilterHdr },
                { version: '1.17 - 1.17.1', format: 7, icon: Candle },
                { version: '1.16.2 - 1.16.5', format: 6, icon: Pig },
                { version: '1.15 - 1.16.1', format: 5, icon: HexagonMultiple },
                {
                  version: '1.13 - 1.14.4',
                  format: 4,
                  icon: Fish,
                  icon2: Panda,
                },
                {
                  version: '1.11 - 1.12.2',
                  format: 3,
                  caption: t('form.version.captions.compatible'),
                  icon: HomeModern,
                  icon2: Looks,
                },
              ].map((i) => (
                <MenuItem key={i.version} value={i.format}>
                  {
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    i.icon &&
                      createElement(i.icon, {
                        className: 'version-caption',
                        sx: {
                          mr: 1,
                          color: 'text.secondary',
                          textSize: '18px',
                        },
                      })
                  }
                  {i.icon2 &&
                    createElement(i.icon2, {
                      className: 'version-caption',
                      sx: { mr: 1, color: 'text.secondary', textSize: '18px' },
                    })}
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
              <MenuItem disabled={true}>
                {t('form.version.captions.legacy')}
              </MenuItem>
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
              renderValue={(selected) =>
                selected.map((option) => (
                  <Chip
                    key={option}
                    label={option.replace(/mods\/(.*)\.json/g, '$1')}
                    sx={{ mr: 0.5 }}
                  />
                ))
              }
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
                  {m.replace(/mods\/(.*)\.json/g, '$1')}
                </MenuItem>
              ))}
              <ListSubheader>
                <Typography component="span" variant="subtitle2">
                  {t('form.mod.enHeader')}
                </Typography>
              </ListSubheader>
              {api.enmods.map((m) => (
                <MenuItem value={m} key={m}>
                  {m.replace(/mods\/(.*)\.json/g, '$1')}
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
            setEnabledResourceModules([])
            setEnabledCollections([])
          }}
          options={api.je_modules.resource.filter(
            (i) => !i.name.startsWith('lang_') // separate lang modules
          )}
          selected={enabledResourceModules}
          disabledOptions={disabledResourceModules}
          fixedOptions={fixedResourceModules}
          label={t('form.resource.label')}
          helper={t('form.resource.helper')}
          prependIcon={<Archive />}
          helpDoc="https://lakeus.xyz/wiki/%E6%A2%97%E4%BD%93%E4%B8%AD%E6%96%87/%E6%A8%A1%E5%9D%97%E5%88%97%E8%A1%A8"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <ResourceSelect
          onChange={(v) => {
            setEnabledLanguageModule(v)
          }}
          unselectAll={() => {
            setEnabledLanguageModule([])
            setEnabledCollections([])
          }}
          options={api.je_modules.resource.filter(
            (i) => i.name.startsWith('lang_') // separate lang modules
          )}
          selected={enabledLanguageModules}
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
          selected={enabledCollections}
          fixedOptions={fixedCollections}
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
              disabled={shouldCensor}
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
              {shouldCensor
                ? t('form.child.censoredHelper')
                : t('form.child.helpers.' + (sfw - 1).toString())}
            </FormHelperText>
          </Box>
        </Stack>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <LoadingButton
          color="primary"
          variant="contained"
          startIcon={<CloudDownload />}
          loading={submitting}
          onClick={() => handleSubmit()}
          sx={{ mr: '10px', mb: '10px' }}
        >
          {t('form.submit')}
        </LoadingButton>
        <Typography
          variant="body2"
          component="span"
          sx={{
            display: 'inline-block',
            color: 'text.secondary',
            verticalAlign: 'middle',
            mr: '10px',
            mb: '10px',
          }}
        >
          {t('form.modified')}
          {new Date(api.je_modified).toLocaleString()}
        </Typography>
        <Typography
          variant="body2"
          component="span"
          sx={{
            display: 'flex',
            color: 'info.main',
            verticalAlign: 'middle',
            alignItems: 'center',
            mr: '10px',
            mb: '10px',
          }}
        >
          <Information sx={{ fontSize: '22px', mr: 0.75 }} />
          {t('form.idk')}
        </Typography>
      </Grid>
    </Grid>
  )
}
