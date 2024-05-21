import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'
import IconifyIcon from 'src/components/Icon'
import { useEffect, useState } from 'react'
import { useDebounce } from 'src/hooks/useDebounce'

interface TInputSearch {
  value: string
  onChange: (value: string) => void
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '38px',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.common.white
  },
  marginLeft: '0 !important',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto'
  },
  border: `1px solid ${theme.palette.customColors.borderColor}`
}))
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  height: '100%',
  padding: '0 10px',
  '& .MuiInputBase-input': {
    width: '100%',
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`
  }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const InputSearch = (props: TInputSearch) => {
  const { value, onChange } = props
  const { t } = useTranslation()
  const [search, setSearch] = useState(value)
  const debounceSearch = useDebounce(search, 500)
  useEffect(() => {
    onChange(debounceSearch)
  }, [debounceSearch])

  return (
    <Search>
      <SearchIconWrapper>
        <IconifyIcon icon={'material-symbols-light:search'} />
      </SearchIconWrapper>
      <StyledInputBase
        value={search}
        onChange={e => {
          setSearch(e.target.value)
        }}
        placeholder='Search…'
        inputProps={{ 'aria-label': 'search' }}
      />
    </Search>
  )
}
export default InputSearch
