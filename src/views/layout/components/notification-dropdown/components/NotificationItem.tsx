import { MouseEvent, useState } from 'react'
// ** Import

// Mui Imports
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import { Badge, Box, IconButton, Menu, Typography, TypographyProps, styled } from '@mui/material'

// ** Components
import Icon from 'src/components/Icon'

// ** Third party
import { useTranslation } from 'react-i18next'
import { NotificationsType } from 'src/views/layout/components/notification-dropdown'

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)<TypographyProps>({
  fontWeight: 500,
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Typography)<TypographyProps>({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

type TProps = {
  notification: NotificationsType
  handleDropdownClose: () => void
}

const NotificationItem = (props: TProps) => {
  // ** Props
  const { notification, handleDropdownClose } = props

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const optionsOpen = Boolean(anchorEl)

  // ** Hooks
  const { t } = useTranslation()

  // ** Handles
  const handleOptionsClose = () => {
    setAnchorEl(null)
  }

  return (
    <MenuItem disableRipple disableTouchRipple>
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'flex-start' }}>
        <Box sx={{ mr: 4, ml: 2.5, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
          <MenuItemTitle onClick={handleDropdownClose}>{notification.title}</MenuItemTitle>
          <MenuItemSubtitle variant='body2'>{notification.subtitle}</MenuItemSubtitle>
          <Typography variant='body2' sx={{ color: 'text.disabled' }}>
            {notification.meta}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
          <Badge sx={{}} color='error' overlap='circular' variant='dot' />
          <Typography>Unread</Typography>
          <>
            <IconButton onClick={(event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)}>
              <Icon icon='pepicons-pencil:dots-y'></Icon>
            </IconButton>
            <Menu
              keepMounted
              anchorEl={anchorEl}
              open={optionsOpen}
              onClose={handleOptionsClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              <MenuItem sx={{ '& svg': { mr: 2 }, border: 'none !important' }}>
                <Icon icon='gg:read' fontSize={20} />
                {t('Mark read')}
              </MenuItem>
              <MenuItem sx={{ '& svg': { mr: 2 } }}>
                <Icon icon='mdi:delete-outline' fontSize={20} />
                {t('Delete')}
              </MenuItem>
            </Menu>
          </>
        </Box>
      </Box>
    </MenuItem>
  )
}

export default NotificationItem
