import { css } from '@emotion/react'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  Switch,
  Typography,
} from '@mui/material'
import {
  AccountChildCircle,
  Archive,
  CloudDownload,
  FolderInformation,
  FolderZip,
  Group,
  Information,
  PackageVariant,
} from '@teahouse-studios/mdi-material-ui'
import {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { SafeParseReturnType } from 'zod'
import ResourceSelectSrc from './ResourceSelect'
import submit from './submit'
import { BuildLog, MemeApi, schema, SchemaType } from './types'

const ResourceSelect = memo(ResourceSelectSrc)

export default function BedrockForm({
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
    if (rawParams.success && rawParams.data.platform === 'bedrock') {
      return rawParams.data
    } else {
      return schema.parse({})
    }
  }, [rawParams])
  const [enabledCollections, setEnabledCollections] = useState<string[]>(
    params.collection,
  )
  const [enabledModules, setEnabledModules] = useState<string[]>(
    params.resource,
  )
  const [beExtType, setBeExtType] = useState<'mcpack' | 'zip'>(params.format)
  const [useCompatible, setUseCompatible] = useState<boolean>(params.compatible)
  const [sfw, setSfw] = useState<number>(shouldCensor ? 1 : params.sfw)
  const [submitting, setSubmitting] = useState(false)
  const { t } = useTranslation()

  const handleSelectChange = <T,>(
    event: SelectChangeEvent<T>,
    setState: Dispatch<SetStateAction<T>>,
  ) => {
    const {
      target: { value },
    } = event
    setState(value as unknown as T)
  }

  const undefinedPredicate = <T,>(i: T | undefined) => i !== undefined

  const getModulesInCollection = useCallback(() => {
    return enabledCollections
      .flatMap(
        (m) => api.be_modules.collection.find((c) => c.name === m)?.contains,
      )
      .filter(undefinedPredicate) as string[]
  }, [api.be_modules.collection, enabledCollections])
  const getIncompatibleModulesInCollection = useCallback(() => {
    return api.be_modules.resource
      .filter((resourceModules) =>
        enabledCollections
          .flatMap(
            (enabledCollection) =>
              api.be_modules.collection.find(
                (collection) => collection.name === enabledCollection,
              )?.contains,
          )
          .filter(undefinedPredicate)
          .includes(resourceModules.name),
      )
      .flatMap((resourceModule) => resourceModule.incompatible_with)
      .filter(undefinedPredicate) as string[]
  }, [api.be_modules.collection, api.be_modules.resource, enabledCollections])

  if (shouldCensor) setSfw(1)

  const sfwModules: string[] = useMemo(() => {
    return {
      1: ['lang_sfc', 'lang_sfw'],
      2: ['lang_sfw'],
      3: [],
    }[sfw] as unknown as string[]
  }, [sfw])

  const fixedModules = useMemo(
    () => [...getModulesInCollection(), ...sfwModules],
    [getModulesInCollection, sfwModules],
  )
  const disabledModules = useMemo(
    () => [...getIncompatibleModulesInCollection()],
    [getIncompatibleModulesInCollection],
  )

  const handleSubmit = useCallback(async () => {
    setSubmitting(true)
    await submit(
      'bedrock',
      {
        extension: beExtType,
        type: useCompatible ? 'compatible' : 'normal',
        modules: {
          resource: [...enabledModules, ...fixedModules],
          collection: enabledCollections,
        },
      },
      addLog,
      {
        v: 1,
        platform: 'bedrock',
        format: beExtType,
        resource: enabledModules,
        collection: enabledCollections,
        compatible: useCompatible,
        sfw,
      },
    )
    setSubmitting(false)
  }, [
    addLog,
    beExtType,
    enabledModules,
    fixedModules,
    enabledCollections,
    useCompatible,
    sfw,
  ])

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
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
          // disabledOptions={disabledCollections}
          options={api.be_modules.collection}
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
          onClick={() => void handleSubmit()}
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
          {new Date(api.be_modified).toLocaleString()}
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
