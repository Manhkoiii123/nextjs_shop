import IconifyIcon from 'src/components/Icon'

import IconButton from '@mui/material/IconButton'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LAGUAGE_OPTIONS } from 'src/configs/i18n'
import { Menu, MenuItem } from '@mui/material'

type TProps = {}

const LanguageDropdown = (props: TProps) => {
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
      <IconButton color='inherit' id='language-dropdown' onClick={handleOpen}>
        <IconifyIcon icon='material-symbols-light:translate' />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id='language-dropdown'
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
            {lang.lang}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
export default LanguageDropdown
