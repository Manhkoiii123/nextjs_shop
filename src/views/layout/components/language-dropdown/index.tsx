import { NextPage } from 'next'
import IconifyIcon from 'src/components/Icon'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { useState } from 'react'
import { Box, BoxProps, styled } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { LAGUAGE_OPTIONS } from 'src/configs/i18n'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

type TProps = {}
interface TStyledItemLanguage extends BoxProps {
  selected: boolean
}
const StyleItemLanguage = styled(Box)<TStyledItemLanguage>(({ theme, selected }) => ({
  cursor: 'pointer',
  '.MuiTypography-root': {
    padding: '8px 12px'
  },
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.light : theme.palette.primary.dark
  }
}))

const LanguageDropdown: NextPage = (props: TProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const { i18n } = useTranslation()
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleChangeLang = (lang: string) => {
    i18n.changeLanguage(lang)
  }
  const open = Boolean(anchorEl)

  return (
    <>
      <IconButton color='inherit' id={'language-dropdown'} onClick={handleOpen}>
        <IconifyIcon icon='material-symbols-light:translate' />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {LAGUAGE_OPTIONS.map(lang => (
          <MenuItem
            selected={lang.value === i18n.language}
            key={lang.value}
            onClick={() => {
              handleChangeLang(lang.value)
            }}
          >
            <Typography>{lang.lang}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
export default LanguageDropdown
