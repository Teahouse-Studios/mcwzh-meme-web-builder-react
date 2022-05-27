import {
  Chip,
  Autocomplete,
  Box,
  TextField,
  Typography,
  Checkbox,
  Popper,
  SvgIconProps,
} from '@mui/material'
import { Archive } from 'mdi-material-ui'
import { css } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import type { MemeModule } from './types'
import { cloneElement, ReactElement, useState } from 'react'

interface ResourceSelectProps {
  onChange: (value: MemeModule[]) => void
  options: MemeModule[]
  label: string
  prependIcon: ReactElement<SvgIconProps>
  helper?: string
  defaultOptions?: MemeModule[]
  disabledOptions?: MemeModule[]
  disabled?: boolean
}

export default function ResourceSelect(props: ResourceSelectProps) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<MemeModule[]>(
    props.defaultOptions || []
  )

  return (
    <Autocomplete
      value={[...new Set(selected.concat(props.defaultOptions || []))]}
      multiple
      onChange={(event, value) => {
        setSelected(value)
        props.onChange(value)
      }}
      options={props.options}
      disabled={props.disabled}
      autoHighlight
      disableCloseOnSelect={true}
      getOptionDisabled={(option) =>
        props.disabledOptions?.includes(option) ||
        option.incompatible_with?.some((module) =>
          selected.some((m) => m.name === module)
        ) ||
        false
      }
      getOptionLabel={(option) => option.name}
      renderOption={(props, option, { selected }) => (
        <Box
          component="li"
          {...props}
          sx={{
            alignItems: 'flex-start',
          }}
          css={css`
            p {
              width: 100%;
            }
          `}
        >
          <Checkbox checked={selected} style={{ marginRight: 8 }} />
          <div>
            <Typography variant="body1">{option.name}</Typography>
            <Typography variant="body2" sx={{ color: 'GrayText' }}>
              {option.description}
              {option.contains
                ? ' · ' +
                  t('form.collections.description_prefix') +
                  option.contains.length +
                  t('form.collections.resource_suffix')
                : ''}
            </Typography>
            <Typography variant="body2" sx={{ color: 'Highlight' }}>
              {t('form.author')}
              {option.author.join(t('metadata.ideographicComma'))}
              {option.incompatible_with ? (
                <>
                  {' '}
                  ·{' '}
                  {t('form.incompatible', {
                    i: option.incompatible_with?.join(
                      t('metadata.ideographicComma')
                    ),
                  })}
                </>
              ) : (
                <></>
              )}
            </Typography>
          </div>
        </Box>
      )}
      renderInput={(params) => (
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          {cloneElement(props.prependIcon, {
            sx: { color: 'action.active', marginTop: '16.5px', mr: 2 },
          })}
          <TextField
            {...params}
            label={props.label}
            helperText={props.helper}
            inputProps={{
              ...params.inputProps,
            }}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <Box
                  sx={{
                    overflowX: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {params.InputProps.startAdornment}
                </Box>
              ),
            }}
            css={css`
              .MuiInputBase-root {
                flex-wrap: nowrap;
              }
            `}
          />
        </Box>
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            label={option.name}
            {...getTagProps({ index })}
            disabled={(props.disabledOptions || []).includes(option)}
          />
        ))
      }
      PopperComponent={(props) => (
        <Popper
          {...props}
          css={css`
            width: fit-content !important;
          `}
          placement="bottom-start"
        />
      )}
    />
  )
}
