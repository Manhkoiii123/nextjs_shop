import * as React from 'react'
import { styled, useTheme } from '@mui/material/styles'

import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'

import { NextPage } from 'next'
import IconifyIcon from 'src/components/Icon'
import UserDropdown from 'src/views/layout/components/user-dropdown'
import ModeToggle from './components/mode-toggle'
import LanguageDropdown from './components/language-dropdown'
import { useAuth } from 'src/hooks/useAuth'
import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'

const drawerWidth: number = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  color: theme.palette.text.primary,
  // color: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.primary.contrastText,
  backgroundColor:
    theme.palette.mode === 'light' ? theme.palette.customColors.lightPaperBg : theme.palette.customColors.darkPaperBg,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

type TProps = {
  open: boolean
  toggleDrawer: () => void
  isHideMenu?: boolean
}
const HorizontalLayout: NextPage<TProps> = ({ open, toggleDrawer, isHideMenu }) => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <AppBar position='absolute' open={open}>
      <Toolbar
        sx={{
          pr: '30px',
          margin: '0 20px'
        }}
      >
        {!isHideMenu && (
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' })
            }}
          >
            <IconifyIcon icon='ic:baseline-menu' />
          </IconButton>
        )}
        <Typography component='h1' variant='h6' color='inherit' noWrap sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        <LanguageDropdown></LanguageDropdown>
        <ModeToggle />
        {user ? (
          <UserDropdown />
        ) : (
          <Button
            onClick={() => {
              router.push(`/${ROUTE_CONFIG.LOGIN}`)
            }}
            type='submit'
            variant='contained'
            sx={{ width: 'auto', ml: 2 }}
          >
            {t('Sign_In')}
          </Button>
        )}

        {/* <IconButton color='inherit'>
          <Badge badgeContent={4} color='primary'>
            <IconifyIcon icon='iconamoon:notification-bold' />
          </Badge>
        </IconButton> */}
      </Toolbar>
    </AppBar>
  )
}
export default HorizontalLayout
