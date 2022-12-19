import { css } from '@emotion/react'
import {
  Box,
  Checkbox,
  Chip as ChipSrc,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  SvgIcon,
  SvgIconProps,
  TextField,
  Typography,
} from '@mui/material'
import {
  Account,
  AccountMultiple,
  Cancel,
  Contain,
  HelpCircle,
  Magnify,
} from 'mdi-material-ui'
import {
  cloneElement,
  forwardRef,
  memo,
  MouseEvent,
  ReactElement,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react'
import Highlighter from 'react-highlight-words'
import { useTranslation } from 'react-i18next'
import type { MemeModule } from './types'

const Chip = memo(ChipSrc)

interface ResourceSelectProps {
  onChange: (value: string[]) => void
  options: MemeModule[]
  label: string
  prependIcon: ReactElement<SvgIconProps>
  helper?: string
  selected: string[]
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

  const { onChange, selected } = props
  const { t } = useTranslation()
  const [searchText, setSearchText] = useState('')
  const [fixedSelected, setFixedSelected] = useState<string[]>([])
  const disabledOptions = useMemo(
    () => [
      ...(props.disabledOptions ?? []),
      ...fixedSelected,
      ...props.options
        .filter((i) => props.selected.includes(i.name))
        .map((i) => i.incompatible_with)
        .flat(),
    ],
    [fixedSelected, props.disabledOptions, props.options, props.selected],
  )
  const selectedRef = useRef(selected)

  const handleFixedOption = (selected: string[]) => {
    const old = fixedSelected.filter(
      (o) => !(props.fixedOptions ?? []).includes(o),
    ) // old fixed options
    const filtered = selected.filter((v) => !old.includes(v)) // get rid of old fixed options
    return [...new Set([...filtered, ...(props.fixedOptions ?? [])])] // add new fixed options
  }

  useEffect(() => {
    selectedRef.current = props.selected
  }, [props.selected])

  useEffect(() => {
    onChange(handleFixedOption(selectedRef.current))

    setFixedSelected(props.fixedOptions ?? [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fixedOptions])

  const selectHandler = useMemo(
    () => (option: MemeModule, itemSelected: boolean) => {
      const newValue = !itemSelected
        ? selectedRef.current.filter((v) => v !== option.name)
        : [...selectedRef.current, option.name]
      onChange(newValue)
      selectedRef.current = newValue
    },
    [],
  )

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
          onClose={() => setSearchText('')}
          disabled={props.disabled}
          renderValue={(selected) =>
            selected
              .slice(0, 5)
              .map((option) => (
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
                setSearchText(e.target.value)
              }}
              onKeyDown={(e) => {
                if (e.key !== 'Escape') {
                  e.stopPropagation()
                }
              }}
            />
            <Box>
              <MenuItem
                disabled={selected.length === 0}
                onClick={() => {
                  onChange(handleFixedOption([]))
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
            </Box>
          </ListSubheader>
          {props.options
            .filter((i) => i.name.includes(searchText))
            .map((option) => (
              <ResourceSelectItem
                option={option}
                key={option.name}
                selected={selected.includes(option.name)}
                disabled={disabledOptions.includes(option.name)}
                searchWords={searchText}
                helpDoc={props.helpDoc}
                onSelect={selectHandler}
              />
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

const ResourceSelectItemSrc = forwardRef<
  HTMLLIElement,
  {
    option: MemeModule
    disabled: boolean
    selected: boolean
    searchWords: string
    helpDoc?: string
    onSelect: (option: MemeModule, selected: boolean) => void
  }
>(({ option, disabled, selected, searchWords, helpDoc, onSelect }, ref) => {
  const { t } = useTranslation()
  return (
    <MenuItem
      value={option.name}
      selected={selected}
      disabled={disabled}
      ref={ref}
      onClick={() => {
        onSelect(option, !selected)
      }}
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <Checkbox
            checked={selected}
            sx={{
              mr: 1,
            }}
          />
          <Box
            sx={{
              whiteSpace: 'normal',
            }}
          >
            <Typography variant="body1" component="code">
              <Highlighter
                searchWords={[searchWords]}
                autoEscape={true}
                textToHighlight={option.name}
              />
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
              }}
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
                      option.author.length === 1 ? Account : AccountMultiple
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
        {helpDoc && (
          <Box
            sx={{
              pointerEvents: 'all',
            }}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
              }}
              href={`${helpDoc}#${option.name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <HelpCircle />
            </IconButton>
          </Box>
        )}
      </Box>
    </MenuItem>
  )
})

ResourceSelectItemSrc.displayName = 'ResourceSelectItem'

const ResourceSelectItem = memo(ResourceSelectItemSrc)
