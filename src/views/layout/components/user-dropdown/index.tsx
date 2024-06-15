import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { Fragment, useEffect, useState } from 'react'
import IconifyIcon from '../../../../components/Icon'
import Image from 'next/image'
import { useAuth } from 'src/hooks/useAuth'
import { NextPage } from 'next'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'
import { Typography } from '@mui/material'
import { toFullName } from 'src/utils'
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import { useSelector } from 'react-redux'
import { RootState } from 'src/stores'

type TProps = {}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
}))

const UserDropdown: NextPage = (props: TProps) => {
  const { i18n } = useTranslation()
  const { t } = useTranslation()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const { user, logout, setUser } = useAuth()
  const { userData } = useSelector((state: RootState) => state.auth)
  // cái này để mà vào lần đầu thì lấy cái avt trong user ra
  // sau đó nếu mà chạy cái update => cập nhật lại cái user là ok
  useEffect(() => {
    if (userData) {
      setUser({ ...userData })
    }
  }, [userData])
  const permissionUser = user?.role?.permissions ?? []
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleNavigateProfile = () => {
    router.push(ROUTE_CONFIG.MY_PROFILE)
    handleClose()
  }
  const handleNavigateChangePassword = () => {
    router.push(ROUTE_CONFIG.CHANGE_PASSWORD)
    handleClose()
  }
  const handleNavigateManageSystem = () => {
    router.push(ROUTE_CONFIG.DASHBOARD)
    handleClose()
  }

  return (
    <Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={t('Account')}>
          <IconButton
            onClick={handleClick}
            size='small'
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            <StyledBadge overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant='dot'>
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.avatar ? (
                  <Image
                    src={user?.avatar || ''}
                    alt='avatar'
                    style={{
                      height: '32px',
                      width: '32px',
                      objectFit: 'cover'
                    }}
                    width={0}
                    height={0}
                  ></Image>
                ) : (
                  <IconifyIcon icon='mdi:user-outline'></IconifyIcon>
                )}
              </Avatar>
            </StyledBadge>
          </IconButton>
        </Tooltip>
      </Box>
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mx: 2,
            pb: 2,
            px: 2
          }}
        >
          <StyledBadge overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant='dot'>
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.avatar ? (
                <Image
                  src={user?.avatar || ''}
                  alt='avatar'
                  style={{
                    height: '32px',
                    width: '32px',
                    objectFit: 'cover'
                  }}
                  width={0}
                  height={0}
                ></Image>
              ) : (
                <IconifyIcon icon='mdi:user-outline'></IconifyIcon>
              )}
            </Avatar>
          </StyledBadge>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <Typography component='span'>
              {toFullName(user?.lastName || '', user?.middleName || '', user?.firstName || '', i18n.language) ||
                user?.email}
            </Typography>
            <Typography>{user?.role?.name}</Typography>
          </Box>
        </Box>
        <Divider />
        {permissionUser.length > 0 && (
          <MenuItem onClick={handleNavigateManageSystem}>
            <Avatar>
              <IconifyIcon icon='arcticons:phone-manager' />
            </Avatar>{' '}
            {t('manager_system')}
          </MenuItem>
        )}
        <MenuItem onClick={handleNavigateProfile}>
          <Avatar>
            <IconifyIcon icon='ph:user-thin' />
          </Avatar>{' '}
          {t('my_profile')}
        </MenuItem>
        <MenuItem onClick={handleNavigateChangePassword}>
          <Avatar sx={{ backgroundColor: 'transparent' }}>
            <IconifyIcon icon={'solar:lock-password-linear'}></IconifyIcon>
          </Avatar>
          <ListItemIcon></ListItemIcon>
          {t('change_pass')}
        </MenuItem>
        <MenuItem onClick={logout}>
          <Avatar sx={{ backgroundColor: 'transparent' }}>
            <IconifyIcon icon={'material-symbols-light:logout-sharp'}></IconifyIcon>
          </Avatar>
          <ListItemIcon></ListItemIcon>
          {t('logout')}
        </MenuItem>
      </Menu>
    </Fragment>
  )
}
export default UserDropdown
