import {
  Chip,
  Box,
  TextField,
  Typography,
  Checkbox,
  FormControl,
  InputLabel,
  SvgIconProps,
  Select,
  InputAdornment,
  ListSubheader,
  MenuItem,
  FormHelperText,
  IconButton,
} from '@mui/material'
import { HelpCircle, Magnify } from 'mdi-material-ui'
import { css } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import type { MemeModule } from './types'
import {
  cloneElement,
  ReactElement,
  useState,
  MouseEvent,
  useEffect,
} from 'react'
import Highlighter from 'react-highlight-words'

interface ResourceSelectProps {
  onChange: (value: string[]) => void
  options: MemeModule[]
  label: string
  prependIcon: ReactElement<SvgIconProps>
  helper?: string
  selected?: string[]
  disabledOptions?: string[]
  fixedOptions?: string[]
  unselectAll?: () => never | void
  disabled?: boolean
  helpDoc?: string
}

export default function ResourceSelect(props: ResourceSelectProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const { t } = useTranslation()
  const [searchText, setSearchText] = useState('')
  const [selected, setSelected] = useState<string[]>(props.selected ?? [])
  const [fixedSelected, setFixedSelected] = useState<string[]>([])

  const handleFixedOption = (selected: string[]) => {
    const old = fixedSelected.filter(
      (o) => !(props.fixedOptions ?? []).includes(o)
    ) // old fixed options
    const filtered = selected.filter((v) => !old.includes(v)) // get rid of old fixed options
    return [...new Set([...filtered, ...(props.fixedOptions ?? [])])] // add new fixed options
  }

  useEffect(() => {
    setSelected(handleFixedOption)

    setFixedSelected(props.fixedOptions ?? [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fixedOptions])

  useEffect(() => {
    setSelected(props.selected ?? [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selected])

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
      {cloneElement(props.prependIcon, {
        sx: { color: 'action.active', marginTop: '16.5px', mr: 2 },
      })}
      <FormControl fullWidth>
        <InputLabel>{props.label}</InputLabel>
        <Select
          label={props.label}
          MenuProps={{ autoFocus: false }}
          value={selected}
          multiple
          onClick={handleClick}
          onChange={(event) => {
            setSelected(event.target.value as string[])
            props.onChange(event.target.value as string[])
          }}
          onClose={() => setSearchText('')}
          disabled={props.disabled}
          renderValue={(selected) =>
            selected.map((option) => (
              <Chip
                key={option}
                label={option}
                sx={{ mr: 0.5 }}
                disabled={(props.disabledOptions ?? []).includes(option)}
              />
            ))
          }
        >
          <ListSubheader
            sx={{
              backgroundColor: 'transparent',
            }}
          >
            <TextField
              key="searchTextField"
              size="small"
              placeholder={t('form.search')}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Magnify />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                console.log(e.target.value)
                setSearchText(e.target.value)
              }}
              onKeyDown={(e) => {
                if (e.key !== 'Escape') {
                  e.stopPropagation()
                }
              }}
            />
          </ListSubheader>
          <MenuItem
            disabled={selected.length === 0}
            onClick={() => {
              setSelected(handleFixedOption([]))
              props.onChange([])
            }}
          >
            {t('form.clearSelected')}
          </MenuItem>
          {props.unselectAll && (
            <MenuItem
              onClick={() => {
                props.unselectAll?.()
              }}
            >
              {t('form.clearAll')}
            </MenuItem>
          )}
          {props.options
            .filter((i) => i.name.includes(searchText))
            .map((option, i) => (
              <MenuItem
                key={i}
                value={option.name}
                disabled={
                  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                  props.disabledOptions?.includes(option.name) ||
                  option.incompatible_with?.some(
                    (module) => selected.some((m) => m === module)
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                  ) ||
                  fixedSelected.includes(option.name) ||
                  false
                }
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                  css={css`
                    p {
                      width: 100%;
                    }
                  `}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Checkbox
                      checked={selected.includes(option.name)}
                      sx={{ mr: 1 }}
                    />
                    <Box>
                      <Typography variant="body1">
                        <Highlighter
                          searchWords={[searchText]}
                          autoEscape={true}
                          textToHighlight={option.name}
                        />
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                      >
                        {option.description}
                        {option.contains
                          ? ' · ' +
                            t('form.collections.description_prefix') +
                            option.contains.length.toString() +
                            t('form.collections.resource_suffix')
                          : ''}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'info.main' }}>
                        {
                          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                          option.author && (
                            <>
                              {t('form.author')}
                              {option.author.join(
                                t('metadata.ideographicComma')
                              )}
                            </>
                          )
                        }
                        <Box component="span" sx={{ color: 'error.main' }}>
                          {option.incompatible_with && (
                            <>
                              {' · '}
                              {t('form.incompatible', {
                                i: option.incompatible_with.join(
                                  t('metadata.ideographicComma')
                                ),
                              })}
                            </>
                          )}
                        </Box>
                      </Typography>
                    </Box>
                  </Box>
                  {props.helpDoc && (
                    <Box sx={{ pointerEvents: 'all' }}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                        href={`${props.helpDoc}#${option.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <HelpCircle />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </MenuItem>
            ))}
        </Select>
        <FormHelperText>{props.helper}</FormHelperText>
      </FormControl>
    </Box>
  )
}
