import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'
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
import { formatNumberToLocal, toFullName } from 'src/utils'
import { styled, useTheme } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/stores'
import { getLocalProductCart } from 'src/helpers/storage'
import { addProductToCard } from 'src/stores/order-product'
import { TItemOrderProduct } from 'src/types/order-product-type'
import { Button } from '@mui/material'

const StyleMenuItem = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
  minWidth: '400px'
}))

type TProps = {}

const CardProduct: NextPage = (props: TProps) => {
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
  const dispatch = useDispatch()

  useEffect(() => {
    const productCard = getLocalProductCart()
    const parseData = productCard ? JSON.parse(productCard) : []
    if (user?._id) {
      dispatch(
        addProductToCard({
          orderItems: parseData[user?._id] || []
        })
      )
    }
  }, [user?._id])
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
  const theme = useTheme()
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)

  const handleNavigateDetailsProduct = (slug: string) => {
    router.push(`${ROUTE_CONFIG.PRODUCT}/${slug}`)
  }

  return (
    <Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <IconButton
          onClick={handleClick}
          color='inherit'
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          {orderItems.length > 0 ? (
            <Badge color='primary' badgeContent={orderItems.length}>
              <IconifyIcon icon='tdesign:cart' />
            </Badge>
          ) : (
            <Badge color='primary'>
              <IconifyIcon icon='tdesign:cart' />
            </Badge>
          )}
        </IconButton>
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
        {orderItems.map((item: TItemOrderProduct) => (
          <StyleMenuItem key={item.product} onClick={() => handleNavigateDetailsProduct(item.slug)}>
            <Avatar src={item.image} sx={{ height: '60px !important', width: '60px !important' }} />
            <Box style={{ flex: 1 }}>
              <Typography sx={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {item.discount > 0 && (
                    <Typography
                      variant='h6'
                      sx={{
                        color: theme.palette.error.main,
                        fontWeight: 'bold',
                        textDecoration: 'line-through',
                        fontSize: '10px'
                      }}
                    >
                      {formatNumberToLocal(item.price)} VND
                    </Typography>
                  )}
                  <Typography
                    variant='h4'
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}
                  >
                    {item.discount > 0 ? (
                      <>{formatNumberToLocal((item.price * (100 - item.discount)) / 100)}</>
                    ) : (
                      <>{formatNumberToLocal(item.price)}</>
                    )}{' '}
                    VND
                  </Typography>
                </Box>
                <Typography>
                  x <b>{item.amount}</b>
                </Typography>
              </Box>
            </Box>
          </StyleMenuItem>
        ))}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type='submit'
            variant='contained'
            sx={{ mt: 3, mb: 2, mr: 2 }}
            // onClick={handleNavigateMyCart}
          >
            {t('View_cart')}
          </Button>
        </Box>
      </Menu>
    </Fragment>
  )
}
export default CardProduct
