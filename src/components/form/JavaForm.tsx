import { css } from '@emotion/react'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Slider,
  Stack,
  Typography,
} from '@mui/material'
import {
  AccountChildCircle,
  CubeUnfolded,
  Clock,
  CloudDownload,
  Cog,
  Group,
  Information,
  SelectGroup,
} from '@teahouse-studios/mdi-material-ui'
import {
  type Dispatch,
  memo,
  type SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import ResourceSelectSrc from './ResourceSelect'
import submit from './submit'
import { type SafeParseReturnType } from 'zod'
import { type BuildLog, type MemeApi, schema, type SchemaType } from './types'
import * as emojis from './emojis'
import M3Switch from './M3Switch'

const ResourceSelect = memo(ResourceSelectSrc)

export default function JavaForm({
  api,
  addLog,
  shouldCensor,
  rawParams,
}: {
  api: MemeApi
  addLog: (log: BuildLog) => void
  shouldCensor: boolean
  rawParams: SafeParseReturnType<unknown, SchemaType>
}) {
  const params = useMemo(() => {
    if (rawParams.success && rawParams.data.platform === 'java') {
      return rawParams.data
    } else {
      return schema.parse({})
    }
  }, [rawParams])
  const [enabledCollections, setEnabledCollections] = useState(
    params.collection,
  )
  const [enabledResourceModules, setEnabledResourceModules] = useState(
    params.resource,
  )
  const [enabledLanguageModules, setEnabledLanguageModule] = useState(
    params.language,
  )
  const [gameVersion, setGameVersion] = useState(params.gameVersion)
  const [enabledMods, setEnabledMods] = useState(
    params.mod.length === 0
      ? api.mods
      : params.mod.length === 1 && params.mod[0] === '!!!EMPTY'
        ? []
        : params.mod,
  )

  const [useCompatible, setUseCompatible] = useState(params.compatible)
  const [sfw, setSfw] = useState(shouldCensor ? 1 : params.sfw)
  const [submitting, setSubmitting] = useState(false)
  const { t } = useTranslation()

  const resourcePredicate = useCallback(
    (i: string) => !i.startsWith('lang_'),
    [],
  )
  const langPredicate = useCallback((i: string) => i.startsWith('lang_'), [])
  const undefinedPredicate = useCallback(
    <T,>(i: T | undefined) => i !== undefined,
    [],
  )

  type ArrayFilterPredicate = (
    value: string,
    index: number,
    array: string[],
  ) => boolean

  if (shouldCensor) setSfw(1)

  const sfwModules: string[] = useMemo(() => {
    return {
      1: ['lang_sfc', 'lang_sfw'],
      2: ['lang_sfw'],
      3: [],
    }[sfw] as unknown as string[]
  }, [sfw])

  const versionModules = useMemo(() => {
    return {
      34: [],
      32: [],
      22: [],
      18: [],
      15: [],
      13: ['version_1.19.4'],
      12: ['version_1.19.3'],
      9: ['version_1.19.2'],
      8: ['version_1.18.2'],
      7: ['version_1.17.1'],
      6: ['version_1.16.5'],
      5: ['version_1.12.2-1.15.2'],
      4: ['version_1.12.2-1.15.2'],
      3: ['version_1.12.2-1.15.2'],
    }[gameVersion] as unknown as string[]
  }, [gameVersion])
  const forceUseCompatible = gameVersion === 3

  const fixedCollections = useMemo(() => [...versionModules], [versionModules])

  const getModulesInCollection = useCallback(
    (predicate: ArrayFilterPredicate) => {
      return [...enabledCollections, ...fixedCollections]
        .flatMap((m) =>
          api.je_modules.collection
            .find((c) => c.name === m)
            ?.contains?.filter(predicate),
        )
        .filter(undefinedPredicate)
    },
    [
      api.je_modules.collection,
      enabledCollections,
      fixedCollections,
      undefinedPredicate,
    ],
  )
  const getIncompatibleModulesInCollection = useCallback(
    (predicate: ArrayFilterPredicate) => {
      return api.je_modules.resource
        .filter((resourceModules) =>
          [...enabledCollections, ...fixedCollections]
            .flatMap((enabledCollection) =>
              api.je_modules.collection
                .find((collection) => collection.name === enabledCollection)
                ?.contains?.filter(predicate),
            )
            .filter(undefinedPredicate)
            .includes(resourceModules.name),
        )
        .flatMap((resourceModule) => resourceModule.incompatible_with)
        .filter(undefinedPredicate)
    },
    [
      api.je_modules.collection,
      api.je_modules.resource,
      enabledCollections,
      fixedCollections,
      undefinedPredicate,
    ],
  )
  const fixedResourceModules = useMemo(
    () => [...new Set([...getModulesInCollection(resourcePredicate)])],
    [getModulesInCollection, resourcePredicate],
  )
  const fixedLanguageModules = useMemo(
    () => [
      ...new Set([...getModulesInCollection(langPredicate), ...sfwModules]),
    ],
    [getModulesInCollection, langPredicate, sfwModules],
  )
  const disabledResourceModules = useMemo(
    () => [
      ...new Set([...getIncompatibleModulesInCollection(resourcePredicate)]),
    ],
    [getIncompatibleModulesInCollection, resourcePredicate],
  )
  const disabledLanguageModules = useMemo(
    () => [...new Set([...getIncompatibleModulesInCollection(langPredicate)])],
    [getIncompatibleModulesInCollection, langPredicate],
  )

  const handleSelectChange = useCallback(
    <T,>(
      event: SelectChangeEvent<T>,
      setState: Dispatch<SetStateAction<T>>,
    ) => {
      const {
        target: { value },
      } = event
      setState(value as unknown as T)
    },
    [],
  )

  const handleSubmit = async () => {
    setSubmitting(true)
    await submit(
      'java',
      {
        type:
          gameVersion === 3
            ? 'legacy'
            : useCompatible
              ? 'compatible'
              : 'normal',
        format: gameVersion,
        mods: enabledMods,
        modules: {
          resource: [enabledResourceModules, enabledLanguageModules].flat(),
          collection: enabledCollections,
        },
      },
      addLog,
      {
        v: 1,
        platform: 'java',
        gameVersion,
        mod: enabledMods,
        resource: enabledResourceModules,
        language: enabledLanguageModules,
        collection: enabledCollections,
        compatible: useCompatible,
        sfw,
      },
    )
    setSubmitting(false)
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
                // {
                //   version: '23w43a+',
                //   format: 20,
                //   caption: t('form.version.captions.snapshot'),
                //   emoji: emojis.bat,
                // },
                {
                  version: '1.21',
                  format: 34,
                  caption: t('form.version.captions.release'),
                  emoji: emojis.oldKey,
                },
                {
                  version: '1.20.5 - 1.20.6',
                  format: 32,
                  emoji: emojis.wolf,
                },
                {
                  version: '1.20.3 - 1.20.4',
                  format: 22,
                  emoji: emojis.bat,
                },
                {
                  version: '1.20.2',
                  format: 18,
                  emoji: emojis.moneyWithWings,
                },
                {
                  version: '1.20 - 1.20.1',
                  format: 15,
                  emoji: emojis.monocleFace,
                },
                {
                  version: '1.19.4',
                  format: 13,
                  emoji: emojis.cherryBlossom,
                },
                {
                  version: '1.19.3',
                  format: 12,
                  emoji: emojis.camel,
                },
                {
                  version: '1.19 - 1.19.2',
                  format: 9,
                  emoji: emojis.zipperMouthFace,
                },
                {
                  version: '1.18 - 1.18.2',
                  format: 8,
                  emoji: emojis.snowCappedMountain,
                },
                { version: '1.17 - 1.17.1', format: 7, emoji: emojis.goat },
                { version: '1.16.2 - 1.16.5', format: 6, emoji: emojis.boar },
                { version: '1.15 - 1.16.1', format: 5, emoji: emojis.bee },
                {
                  version: '1.13 - 1.14.4',
                  format: 4,
                  emoji: emojis.coral,
                  emoji2: emojis.panda,
                },
                {
                  version: '1.11 - 1.12.2',
                  format: 3,
                  caption: t('form.version.captions.compatible'),
                  emoji: emojis.llama,
                  emoji2: emojis.rainbow,
                },
              ].map((i) => (
                <MenuItem key={i.version} value={i.format}>
                  <Box
                    className="version-caption"
                    sx={{
                      color: 'text.secondary',
                      display: 'flex',
                      fontSize: 24,
                      svg: {
                        height: '1em',
                        width: '1em',
                        display: 'block',
                        my: 'auto',
                      },
                      span: {
                        verticalAlign: 'middle',
                      },
                    }}
                  >
                    {
                      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                      i.emoji && (
                        <Box
                          sx={{
                            mr: 1,
                          }}
                        >
                          <span
                            dangerouslySetInnerHTML={{ __html: i.emoji.svg }}
                          />
                        </Box>
                      )
                    }
                    {
                      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                      i.emoji2 && (
                        <Box
                          sx={{
                            mr: 1,
                          }}
                        >
                          <span
                            dangerouslySetInnerHTML={{ __html: i.emoji2.svg }}
                          />
                        </Box>
                      )
                    }
                  </Box>
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
              <Box>
                <MenuItem
                  disabled={enabledMods.length === 0}
                  onClick={() => {
                    setEnabledMods([])
                  }}
                >
                  {t('form.clearSelected')}
                </MenuItem>
              </Box>
              <ListSubheader>
                <Typography component="span" variant="subtitle2">
                  {t('form.mod.header')}
                </Typography>
              </ListSubheader>
              {api.mods.map((m) => (
                <MenuItem value={m} key={m}>
                  <code>{m.replace(/mods\/(.*)\.json/g, '$1')}</code>
                </MenuItem>
              ))}
              <ListSubheader>
                <Typography component="span" variant="subtitle2">
                  {t('form.mod.enHeader')}
                </Typography>
              </ListSubheader>
              {api.enmods.map((m) => (
                <MenuItem value={m} key={m}>
                  <code>{m.replace(/mods\/(.*)\.json/g, '$1')}</code>
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
            (i) => !i.name.startsWith('lang_'), // separate lang modules
          )}
          selected={enabledResourceModules}
          disabledOptions={disabledResourceModules}
          fixedOptions={fixedResourceModules}
          label={t('form.resource.label')}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          helper={t('form.resource.helper')!}
          prependIcon={<CubeUnfolded />}
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
            (i) => i.name.startsWith('lang_'), // separate lang modules
          )}
          selected={enabledLanguageModules}
          disabledOptions={disabledLanguageModules}
          fixedOptions={fixedLanguageModules}
          label={t('form.language.label')}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          helper={t('form.language.helper')!}
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
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          helper={t('form.collections.helper')!}
          prependIcon={<Group />}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <FormControlLabel
            control={
              <M3Switch
                checked={useCompatible || forceUseCompatible}
                disabled={forceUseCompatible}
                onChange={(e, c) => {
                  setUseCompatible(c)
                }}
              />
            }
            label={t('form.compatible.label')}
            sx={{ color: 'text.secondary' }}
          />
          <FormHelperText>
            {t(
              forceUseCompatible
                ? 'form.compatible.disabled'
                : 'form.compatible.helper',
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
          onClick={() => void handleSubmit()}
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
          {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            new Intl.DateTimeFormat(t('metadata.dateLocale')!, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              hourCycle: 'h23',
            }).format(new Date(api.je_modified))
          }
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
