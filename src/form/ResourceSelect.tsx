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
  SvgIcon,
} from '@mui/material'
import {
  Account,
  AccountMultiple,
  Cancel,
  Contain,
  HelpCircle,
  Magnify,
} from 'mdi-material-ui'
import { css } from '@emotion/react'
import { Trans, useTranslation } from 'react-i18next'
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
      (o) => !(props.fixedOptions ?? []).includes(o),
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
          <ListSubheader sx={{ boxShadow: 2 }}>
            <TextField
              key="searchTextField"
              size="small"
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              placeholder={t('form.search')!}
              fullWidth
              sx={{ mt: 1 }}
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
            <MenuItem
              disabled={selected.length === 0}
              onClick={() => {
                setSelected(handleFixedOption([]))
                props.onChange(handleFixedOption([]))
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
          </ListSubheader>
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
                    (module) => selected.some((m) => m === module),
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
                    <Box sx={{ whiteSpace: 'normal' }}>
                      <Typography variant="body1" component="code">
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
                      </Typography>
                      <Typography
                        component="ul"
                        variant="body2"
                        sx={{
                          color: 'info.main',
                          listStyle: 'none',
                          display: 'flex',
                          flexWrap: 'wrap',
                          pl: 0,
                          '& > li': {
                            display: 'inline-block',
                            ':not(:last-child)': {
                              mr: 1,
                            },
                          },
                        }}
                      >
                        {
                          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                          option.author && (
                            <ModuleLabel
                              icon={
                                option.author.length === 1
                                  ? Account
                                  : AccountMultiple
                              }
                              title={t('form.author')}
                              content={option.author.join(
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                t('metadata.ideographicComma')!,
                              )}
                            />
                          )
                        }
                        {option.contains && (
                          <ModuleLabel
                            icon={Contain}
                            color="text.secondary"
                            title={t('form.collections.resource')}
                            content={
                              option.contains.length.toString() +
                              t('form.collections.piece')
                            }
                          />
                        )}
                        {option.incompatible_with && (
                          <ModuleLabel
                            icon={Cancel}
                            color="error.main"
                            title={t('form.incompatible')}
                            content={option.incompatible_with.join(
                              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                              t('metadata.ideographicComma')!,
                            )}
                          />
                        )}
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

function ModuleLabel(props: {
  color?: string
  icon?: typeof SvgIcon
  title: string
  content: string
}) {
  return (
    <Box
      component="li"
      sx={{
        color: props.color,
        '& > *': {
          verticalAlign: 'top',
        },
      }}
    >
      {props.icon && (
        <props.icon
          sx={{ mr: 0.5, fontSize: '1.2rem', verticalAlign: 'middle' }}
        />
      )}
      <Box component="strong" sx={{ mr: 0.5 }}>
        {props.title}
      </Box>
      {props.content}
    </Box>
  )
}
