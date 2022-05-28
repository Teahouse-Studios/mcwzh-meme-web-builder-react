import {
  useState,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
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
  Button,
} from '@mui/material'
import {LoadingButton} from '@mui/lab'
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
import { MemeModule, MemeApi, BuildLog } from './types'

export default function JavaForm({
  api,
  addLog,
}: {
  api: MemeApi
  addLog: (log: BuildLog) => void
}) {
  const [enabledCollections, setEnabledCollections] = useState<MemeModule[]>([])
  const [fixedCollections, setFixedCollections] = useState<MemeModule[]>([])
  const [enabledResourceModules, setEnabledResourceModules] = useState<
    MemeModule[]
  >([])
  const [enabledLanguageModules, setEnabledLanguageModule] = useState<
    MemeModule[]
  >([])
  const [enabledFixedLanguageModules, setFixedLanguageModule] = useState<
    MemeModule[]
  >([])
  const [gameVersion, setGameVersion] = useState<number>(9)
  const [enabledMods, setEnabledMods] = useState<string[]>([])
  const [useCompatible, setUseCompatible] = useState<boolean>(false)
  const [forceUseCompatible, setForceUseCompatible] = useState(false)
  const [sfw, setSfw] = useState<number>(2)
  const [submitting, setSubmitting] = useState(false)
  const { t } = useTranslation()

  const enableFixedModules = (
    collections: string[],
    setState: Dispatch<SetStateAction<MemeModule[]>>,
    arr: MemeModule[]
  ) => {
    setState(arr.filter((m) => collections.includes(m.name))!)
  }

  useEffect(() => {
    setEnabledMods(api?.mods!)
    setEnabledCollections([
      api?.je_modules.collection.find((i) => i.name === 'choice_modules_1')!,
    ])
  }, [api])

  useEffect(() => {
    switch (gameVersion) {
      case 9:
        enableFixedModules([], setFixedCollections, api?.je_modules.collection!)
        setForceUseCompatible(false)
        break
      case 8:
        enableFixedModules(
          ['version_1.18.2'],
          setFixedCollections,
          api?.je_modules.collection!
        )
        setForceUseCompatible(false)
        break
      case 7:
        enableFixedModules(
          ['version_1.17.1'],
          setFixedCollections,
          api?.je_modules.collection!
        )
        setForceUseCompatible(false)
        break
      case 6:
        enableFixedModules(
          ['version_1.16.5'],
          setFixedCollections,
          api?.je_modules.collection!
        )
        setForceUseCompatible(false)
        break
      case 5:
      case 4:
        enableFixedModules(
          ['version_1.12.2-1.15.2'],
          setFixedCollections,
          api?.je_modules.collection!
        )
        setForceUseCompatible(false)
        break
      case 3:
        enableFixedModules(
          ['version_1.12.2-1.15.2'],
          setFixedCollections,
          api?.je_modules.collection!
        )
        setForceUseCompatible(true)
        break
    }
  }, [gameVersion])

  useEffect(() => {
    switch (sfw) {
      case 1:
        enableFixedModules(
          ['lang_sfc', 'lang_sfw'],
          setFixedLanguageModule,
          api?.je_modules.resource!
        )
        break
      case 2:
        enableFixedModules(
          ['lang_sfw'],
          setFixedLanguageModule,
          api?.je_modules.resource!
        )
        break
      case 3:
        enableFixedModules(
          [],
          setFixedLanguageModule,
          api?.je_modules.resource!
        )
        break
    }
  }, [sfw])

  const handleSelectChange = <T,>(
    event: SelectChangeEvent<T>,
    setState: Dispatch<SetStateAction<T>>
  ) => {
    const {
      target: { value },
    } = event
    setState(value as unknown as T)
  }

  const handleSubmit = () => {
    setSubmitting(true)
    fetch('https://meme.wd-api.com/ajax', {
      method: 'POST',
      body: JSON.stringify({
        _be: false,
        type: gameVersion === 3 ? 'legacy' : 'normal',
        compatible: useCompatible,
        format: gameVersion,
        mod: enabledMods,
        modules: {
          collection: [
            ...enabledCollections.map((m) => m.name),
            ...fixedCollections.map((m) => m.name),
          ],
          resource: [
            ...enabledResourceModules.map((m) => m.name),
            ...enabledLanguageModules.map((m) => m.name),
            ...enabledFixedLanguageModules.map((m) => m.name),
          ],
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
              platform: 'java',
              log: data.logs as string,
              downloadUrl: data.root + data.filename,
              time: Date.now(),
            })
          })
        } else {
          res.json().then((data) => {
            setSubmitting(false)
            addLog({
              status: 'error',
              platform: 'java',
              log: data.logs as string,
              time: Date.now(),
            })
          })
        }
      })
      .catch((error) => {
        setSubmitting(false)
        addLog({
          status: 'error',
          platform: 'java',
          log: `${error.name}: ${error.message}`,
          time: Date.now(),
        })
      })
    document.getElementById('build-log')?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <Grid
      container
      spacing={2}
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
                { version: '1.19+', format: 9, caption: '最新快照' },
                {
                  version: '1.18 - 1.18.2',
                  format: 8,
                  caption: '最新正式版',
                },
                { version: '1.17 - 1.17.1', format: 7 },
                { version: '1.16.2 - 1.16.5', format: 6 },
                { version: '1.15 - 1.16.1', format: 5 },
                { version: '1.13 - 1.14.4', format: 4 },
                { version: '1.11 - 1.12.2', format: 3, caption: '兼容版' },
              ].map((i) => (
                <MenuItem key={i.version} value={i.format}>
                  {i.version}
                  <Typography
                    component="span"
                    className="version-caption"
                    variant="body2"
                    sx={{ color: 'GrayText', mr: 0, ml: 'auto' }}
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
              value={api?.mods}
              onChange={(e) => {
                handleSelectChange(e, setEnabledMods)
              }}
            >
              <MenuItem disabled={true}>
                <Typography component="span" variant="subtitle2">
                  {t('form.mod.header')}
                </Typography>
              </MenuItem>
              {api?.mods.map((m) => (
                <MenuItem value={m}>{m}</MenuItem>
              ))}
              <MenuItem disabled={true}>
                <Typography component="span" variant="subtitle2">
                  {t('form.mod.enHeader')}
                </Typography>
              </MenuItem>
              {api?.enmods.map((m) => (
                <MenuItem value={m}>{m}</MenuItem>
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
          options={
            api?.je_modules.resource!.filter(
              (i) => !i.name.startsWith('lang_') // seperate lang modules
            )!
          }
          defaultOptions={
            enabledCollections
              .map((m) =>
                api?.je_modules.resource!.filter(
                  (r) =>
                    m.contains!.includes(r.name) && !r.name.startsWith('lang_') // seperate lang modules
                )
              )
              .flat()
              .filter((i) => i !== undefined) as MemeModule[]
          }
          disabledOptions={
            enabledCollections
              .map((m) =>
                api?.je_modules.resource!.filter(
                  (r) =>
                    m.contains!.includes(r.name) && !r.name.startsWith('lang_') // seperate lang modules
                )
              )
              .flat()
              .filter((i) => i !== undefined) as MemeModule[]
          }
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
          options={
            api?.je_modules.resource!.filter(
              (i) => i.name.startsWith('lang_') // seperate lang modules
            )!
          }
          defaultOptions={[
            ...(enabledCollections
              .map((m) =>
                api?.je_modules.resource!.filter(
                  (r) =>
                    m.contains!.includes(r.name) && r.name.startsWith('lang_') // seperate lang modules
                )
              )
              .flat()
              .filter((i) => i !== undefined) as MemeModule[]),
            ...enabledFixedLanguageModules,
          ]}
          disabledOptions={[
            ...(enabledCollections
              .map((m) =>
                api?.je_modules.resource!.filter(
                  (r) =>
                    m.contains!.includes(r.name) && r.name.startsWith('lang_') // seperate lang modules
                )
              )
              .flat()
              .filter((i) => i !== undefined) as MemeModule[]),
            ...enabledFixedLanguageModules,
          ]}
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
          options={api?.je_modules.collection!}
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
            sx={{ color: 'GrayText' }}
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
                { value: 1, label: t('form.child.ticks.1') },
                { value: 2, label: t('form.child.ticks.2') },
                { value: 3, label: t('form.child.ticks.3') },
              ]}
              min={1}
              max={3}
            />
            <FormHelperText>{t('form.child.helpers.' + sfw)}</FormHelperText>
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
      </Grid>
    </Grid>
  )
}
