import {
  List,
  Autocomplete,
  Box,
  TextField,
  Typography,
  Checkbox,
} from '@mui/material'
import { css, jsx } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import { CheckboxMarked, CheckboxBlankOutline } from 'mdi-material-ui'
import type { MemeModule } from './types'

interface ResourceSelectProps {
  onChange: (value: MemeModule[]) => void
  options: MemeModule[]
  label: string
  helper?: string
  disabledOptions?: MemeModule[]
  disabled?: boolean
}

export default function ResourceSelect(props: ResourceSelectProps) {
  const { t } = useTranslation()

  return (
    <Autocomplete
      multiple
      onChange={(event, value) => props.onChange(value)}
      options={props.options}
      disabled={props.disabled}
      autoHighlight
      getOptionDisabled={(option) =>
        props.disabledOptions?.includes(option) || false
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
                  t('form.collections.description_suffix') +
                  option.contains.length +
                  t('form.collections.resource_suffix')
                : ''}
            </Typography>
            <Typography variant="body2" sx={{ color: 'Highlight' }}>
              {t('form.author')}
              {option.author.join(t('metadata.ideographicComma'))}
            </Typography>
          </div>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label}
          helperText={props.helper}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />
      )}
    />
  )
}
