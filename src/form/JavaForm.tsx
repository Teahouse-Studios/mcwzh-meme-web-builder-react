import { useState, useContext } from 'react'
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
} from '@mui/material'
import {
  Archive,
  Clock,
  Cog,
  SelectGroup,
  Group,
  AccountChildCircle,
} from 'mdi-material-ui'
import { css } from '@emotion/react'
import { ApiContext } from './Form'
import ResourceSelect from './ResourceSelect'
import { MemeModule } from './types'

export default function JavaForm() {
  const api = useContext(ApiContext)
  const [enabledCollections, setEnabledCollections] = useState<MemeModule[]>([])
  const [enabledResourceModules, setEnabledResourceModules] = useState<
    MemeModule[]
  >([])
  const [enabledLanguageModules, setEnabledLanguageModule] = useState<
    MemeModule[]
  >([])
  const [gameVersion, setGameVersion] = useState<number>(9)
  const [enabledMods, setEnabledMods] = useState<MemeModule[]>([])
  const [useCompatible, setUseCompatible] = useState<boolean>(false)
  const [sfw, setSfw] = useState<number>(2)
  const { t } = useTranslation()

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
              onChange={(e) => {
                setGameVersion(e.target.value as number)
              }}
            >
              <VersionMenuItems
                items={[
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
                ]}
              />
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
              onChange={(e) => {
                setEnabledMods(enabledMods.push(e.target.value))
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
          defaultOptions={
            enabledCollections
              .map((m) =>
                api?.je_modules.resource!.filter(
                  (r) =>
                    m.contains!.includes(r.name) && r.name.startsWith('lang_') // seperate lang modules
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
                    m.contains!.includes(r.name) && r.name.startsWith('lang_') // seperate lang modules
                )
              )
              .flat()
              .filter((i) => i !== undefined) as MemeModule[]
          }
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
          options={api?.je_modules.collection!}
          label={t('form.collections.label')}
          helper={t('form.collections.helper')}
          prependIcon={<Group />}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label={t('form.compatible.label')}
            sx={{ color: 'GrayText' }}
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
                setSfw(v)
              }}
              sx={{ mx: 1 }}
              defaultValue={sfw}
              step={1}
              marks={[
                { value: 1, label: t('form.child.ticks.1') },
                { value: 2, label: t('form.child.ticks.2') },
                { value: 3, label: t('form.child.ticks.3') },
              ]}
              min={1}
              max={3}
            />
            <FormHelperText>{t('form.child.helpers.1')}</FormHelperText>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  )
}

function VersionMenuItems({
  items,
}: {
  items: { format: number; version: string; caption?: string }[]
}) {
  return (
    <>
      {items.map((i) => (
        <MenuItem value={i.format}>
          {i.version}
          <Typography
            component="span"
            variant="body2"
            sx={{ color: 'GrayText', mr: 0, ml: 'auto' }}
          >
            {i.caption}
          </Typography>
        </MenuItem>
      ))}
    </>
  )
}
