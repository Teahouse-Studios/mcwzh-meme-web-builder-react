import {
  Chip,
  Autocomplete,
  Box,
  TextField,
  Typography,
  Checkbox,
  Popper,
  FormControl,
  InputLabel,
  SvgIconProps,
  Select,
  InputAdornment,
  ListSubheader,
  MenuItem,
  FormHelperText,
} from '@mui/material'
import { Magnify } from 'mdi-material-ui'
import { css } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import type { MemeModule } from './types'
import { cloneElement, ReactElement, useState, MouseEvent } from 'react'

interface ResourceSelectProps {
  onChange: (value: string[]) => void
  options: MemeModule[]
  label: string
  prependIcon: ReactElement<SvgIconProps>
  helper?: string
  defaultOptions?: string[]
  disabledOptions?: string[]
  disabled?: boolean
}

export default function ResourceSelect(props: ResourceSelectProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const open = Boolean(anchorEl)

  const { t } = useTranslation()
  const [searchText, setSearchText] = useState('')
  const [selected, setSelected] = useState<string[]>(props.defaultOptions || [])

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
      {cloneElement(props.prependIcon, {
        sx: { color: 'action.active', marginTop: '16.5px', mr: 2 },
      })}
      <FormControl fullWidth>
        <InputLabel>{props.label}</InputLabel>
        <Select
          value={[...new Set(selected.concat(props.defaultOptions || []))]}
          multiple
          onClick={handleClick}
          onChange={(event) => {
            setSelected(event.target.value as string[])
            props.onChange(event.target.value as string[])
          }}
          onClose={() => setSearchText('')}
          disabled={props.disabled}
          renderValue={(selected) =>
            selected.map((option, index) => (
              <Chip
                label={option}
                disabled={(props.disabledOptions || []).includes(option)}
              />
            ))
          }
        >
          <ListSubheader>
            <TextField
              size="small"
              placeholder="Type to search..."
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Magnify />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== 'Escape') {
                  e.stopPropagation()
                }
              }}
            />
          </ListSubheader>
          {props.options.map((option, i) => (
            <MenuItem
              key={i}
              value={option.name}
              disabled={
                props.disabledOptions?.includes(option.name) ||
                option.incompatible_with?.some((module) =>
                  selected.some((m) => m === module)
                ) ||
                false
              }
            >
              <Box
                component="li"
                sx={{
                  alignItems: 'flex-start',
                }}
                css={css`
                  p {
                    width: 100%;
                  }
                `}
              >
                <Checkbox
                  checked={selected.includes(option.name)}
                  sx={{ mr: 1 }}
                />
                <div>
                  <Typography variant="body1">{option.name}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {option.description}
                    {option.contains
                      ? ' · ' +
                        t('form.collections.description_prefix') +
                        option.contains.length +
                        t('form.collections.resource_suffix')
                      : ''}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'info.main' }}>
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
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{props.helper}</FormHelperText>
      </FormControl>
    </Box>
  )
}
