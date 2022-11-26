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
  Link,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { css } from '@emotion/react'
import {
  Archive,
  Group,
  AccountChildCircle,
  CloudDownload,
  FolderInformation,
  Information,
  PackageVariant,
  FolderZip,
} from 'mdi-material-ui'
import ResourceSelect from './ResourceSelect'
import { MemeApi, BuildLog } from './types'
import allowTracking from '../tracking'
import endpoint from '../api'

export default function BedrockForm({
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
  const [disabledCollections, setDisabledCollections] = useState<string[]>([])
  const [enabledModules, setEnabledModules] = useState<string[]>([])
  const [disabledModules, setDisabledModules] = useState<string[]>([])
  const [fixedModules, setFixedModules] = useState<string[]>([])
  const [beExtType, setBeExtType] = useState<'mcpack' | 'zip'>('mcpack')
  const [useCompatible, setUseCompatible] = useState<boolean>(false)
  const [sfw, setSfw] = useState<number>(shouldCensor ? 1 : 2)
  const [submitting, setSubmitting] = useState(false)
  const { t } = useTranslation()

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
          (m) => api.be_modules.collection.find((c) => c.name === m)?.contains
        )
        .filter(undefinedPredicate) as string[]
    }
    const getIncompatibleModulesInCollection = () => {
      return api.be_modules.resource
        .filter((resourceModules) =>
          enabledCollections
            .flatMap(
              (enabledCollection) =>
                api.be_modules.collection.find(
                  (collection) => collection.name === enabledCollection
                )?.contains
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

    setFixedModules([...getModulesInCollection(), ...sfwModules])
    setDisabledModules([...getIncompatibleModulesInCollection()])
  }, [enabledCollections, sfw, api, shouldCensor])

  const calculatedEnabledModules = useMemo(
    () => [...enabledModules, ...fixedModules],
    [enabledModules, fixedModules]
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
    fetch(`${endpoint}/v2/build/bedrock`, {
      method: 'POST',
      body: JSON.stringify({
        extension: beExtType,
        type: useCompatible ? 'compatible' : 'normal',
        modules: {
          resource: calculatedEnabledModules,
          collection: enabledCollections,
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
                platform: 'bedrock',
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
                platform: 'bedrock',
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
        platform: 'bedrock',
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
              css={css`
                .version-caption {
                  display: none;
                }
              `}
            >
              <MenuItem value="mcpack">
                <PackageVariant
                  className="version-caption"
                  sx={{ mr: 1, color: 'text.secondary', textSize: '18px' }}
                />
                .mcpack
              </MenuItem>
              <MenuItem value="zip">
                <FolderZip
                  className="version-caption"
                  sx={{ mr: 1, color: 'text.secondary', textSize: '18px' }}
                />
                .zip
              </MenuItem>
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
          unselectAll={() => {
            setEnabledModules([])
            setEnabledCollections([])
          }}
          options={api.be_modules.resource}
          selected={enabledModules}
          disabledOptions={disabledModules}
          fixedOptions={fixedModules}
          label={t('form.resource.label')}
          helper={t('form.resource.helper')!}
          prependIcon={<Archive />}
          helpDoc="https://lakeus.xyz/wiki/%E6%A2%97%E4%BD%93%E4%B8%AD%E6%96%87/%E6%A8%A1%E5%9D%97%E5%88%97%E8%A1%A8"
        />
      </Grid>
      <Grid item xs={12}>
        <ResourceSelect
          onChange={(v) => {
            setEnabledCollections(v)
          }}
          selected={enabledCollections}
          disabledOptions={disabledCollections}
          options={api.be_modules.collection}
          label={t('form.collections.label')}
          helper={t('form.collections.helper')!}
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
          <FormHelperText>{t('form.compatible.helper')}</FormHelperText>
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
              disabled={shouldCensor}
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
      <Grid item xs={12}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('form.bedrockHint.text')}
          <Link
            href="https://github.com/Teahouse-Studios/mcwzh-meme-resourcepack-bedrock"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t('form.bedrockHint.readme')}
          </Link>
          {t('form.bedrockHint.end')}
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
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
            display: 'inline-block',
            color: 'text.secondary',
            verticalAlign: 'middle',
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
          }}
        >
          <Information sx={{ fontSize: '22px', mr: 0.75 }} />
          {t('form.idk')}
        </Typography>
      </Grid>
    </Grid>
  )
}
