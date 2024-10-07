import { useState, SyntheticEvent, Fragment, useEffect, useRef } from 'react'

import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled, Theme, useTheme } from '@mui/material/styles'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { Chip } from '@mui/material'

import Icon from 'src/components/Icon'

import { useTranslation } from 'react-i18next'
import NotificationItem from 'src/views/layout/components/notification-dropdown/components/NotificationItem'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { getAllNotificationsAsync, markReadAllNotificationAsync } from 'src/stores/notification/actions'
import toast from 'react-hot-toast'
import { resetInitialState } from 'src/stores/notification'

export type NotificationsType = {
  _id: string
  createdAt: string
  title: string
  context: string
  body: string
  isRead: boolean
  referenceId: string
  user: {
    _id: string
    avatar: string
  }
}

interface Props {}

const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4.25),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0,
    '& .MuiMenuItem-root': {
      margin: 0,
      borderRadius: 0,
      padding: theme.spacing(4, 6),
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      }
    }
  }
}))

const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const NotificationDropdown = (props: Props) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const wrapperListNotiRef = useRef<HTMLDivElement>(null)

  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)
  const {
    notifications,
    isSuccessDelete,
    isSuccessRead,
    isErrorDelete,
    isErrorRead,
    messageErrorRead,
    messageErrorDelete,
    isSuccessReadAll,
    isErrorReadAll,
    messageErrorReadAll
  } = useSelector((state: RootState) => state.notification)
  const [limit, setLimit] = useState(10)
  const dispatch: AppDispatch = useDispatch()
  const handleGetListNotification = () => {
    dispatch(getAllNotificationsAsync({ params: { limit: limit, page: 1 } }))
  }
  useEffect(() => {
    handleGetListNotification()
  }, [limit])
  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleScrollListNoti = () => {
    const wrapperContent = wrapperListNotiRef.current
    if (!wrapperContent) {
      return
    }
    const heightList = wrapperContent.clientHeight // chiều cao hiển thị
    const scrollHeight = wrapperContent.scrollHeight // tất cả các phần tử nếu ko có scroll
    const maxScroll = scrollHeight - heightList
    const currentScroll = wrapperContent.scrollTop
    if (currentScroll >= maxScroll) {
      if (notifications.totalCount > limit) {
        setLimit(prev => prev + 10)
      }
    }
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }
  const handleMarkReadAll = () => {
    dispatch(markReadAllNotificationAsync())
  }
  useEffect(() => {
    if (isSuccessRead && !isErrorRead) {
      toast.success(t('Marked_notification_success'))
      dispatch(resetInitialState())
      handleGetListNotification()
    } else if (isErrorRead && messageErrorRead) {
      toast.error(t('Marked_notification_failed'))
      dispatch(resetInitialState())
    }
  }, [isSuccessRead, isErrorRead, messageErrorRead])

  useEffect(() => {
    if (isSuccessDelete && !isErrorDelete) {
      toast.success(t('Delete_notification_success'))
      dispatch(resetInitialState())
      handleGetListNotification()
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t('Delete_notification_failed'))
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])
  useEffect(() => {
    if (isSuccessReadAll && !isErrorReadAll) {
      toast.success(t('Marked_all_notification_success'))
      dispatch(resetInitialState())
      handleGetListNotification()
    } else if (isErrorReadAll && messageErrorReadAll) {
      toast.error(t('Marked_all_notification_failed'))
      dispatch(resetInitialState())
    }
  }, [isSuccessReadAll, isSuccessReadAll, messageErrorReadAll])

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <Badge
          color='error'
          badgeContent={notifications.totalNew}
          invisible={!notifications.totalNew}
          sx={{
            '& .MuiBadge-badge': { top: 4, right: 4, boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}` }
          }}
        >
          <Icon fontSize='1.625rem' icon='tabler:bell' />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{ cursor: 'default', userSelect: 'auto', backgroundColor: 'transparent !important' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography variant='h5' sx={{ cursor: 'text' }}>
              Notifications
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Chip size='small' color='primary' label={`${notifications.totalNew} New`} />
              <Icon icon='line-md:email-opened'></Icon>
            </Box>
          </Box>
        </MenuItem>
        <Box
          sx={{
            maxHeight: 349,
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
          ref={wrapperListNotiRef}
          onScroll={handleScrollListNoti}
        >
          {notifications.data.map((notification: NotificationsType, index: number) => (
            <NotificationItem key={index} notification={notification} handleDropdownClose={handleDropdownClose} />
          ))}
        </Box>
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{
            borderBottom: 0,
            cursor: 'default',
            userSelect: 'auto',
            backgroundColor: `${theme.palette.background.paper} !important`,
            borderTop: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Button fullWidth variant='contained' onClick={handleMarkReadAll}>
            {t('Mark read all notifications')}
          </Button>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default NotificationDropdown
