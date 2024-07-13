import React, { useMemo, useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import IconifyIcon from 'src/components/Icon'
import { Box, Button, Rating } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { TProduct } from 'src/types/product'
import Image from 'next/image'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'
import { convertUpdateProductToCart, formatNumberToLocal, isExpiry } from 'src/utils'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { updateProductToCard } from 'src/stores/order-product'
import { getLocalProductCart, setLocalProductToCart } from 'src/helpers/storage'
import { useAuth } from 'src/hooks/useAuth'

interface TCardProduct {
  data: TProduct
}

const Styledcard = styled(Card)(({ theme }) => ({
  position: 'relative',
  boxShadow: theme.shadows[4],
  '.MuiCardMedia-root.MuiCardMedia-media': {
    objectFit: 'contain'
  }
}))

const CardProduct = (props: TCardProduct) => {
  const { data } = props
  const router = useRouter()
  const { t } = useTranslation()
  const handleNavigateDetail = (slug: string) => {
    router.push(`${ROUTE_CONFIG.PRODUCT}/${slug}`)
  }
  const { user } = useAuth()
  const dispatch: AppDispatch = useDispatch()
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)

  const theme = useTheme()
  const handleAddToCard = (item: TProduct) => {
    const productCart = getLocalProductCart()
    const discountItem = isExpiry(data.discountStartDate, data.discountEndDate) ? item.discount : 0
    const parseData = productCart ? JSON.parse(productCart) : {}
    const listOrderItem = convertUpdateProductToCart(orderItems, {
      name: item.name,
      amount: 1,
      image: item.image,
      price: item.price,
      discount: discountItem,
      product: item._id,
      slug: item.slug
    })

    if (user?._id) {
      dispatch(
        updateProductToCard({
          orderItems: listOrderItem
        })
      )
      setLocalProductToCart({ ...parseData, [user._id]: listOrderItem })
    } else {
      router.replace({
        pathname: '/login',
        query: { returnUrl: router.asPath }
      })
    }
  }

  const memo = useMemo(() => {
    return isExpiry(data.discountStartDate, data.discountEndDate)
  }, [data.discountStartDate, data.discountEndDate])

  return (
    <Styledcard sx={{ minHeight: 350 }}>
      <Box>
        <CardMedia component='img' height='200' image={data.image} alt='Paella dish' />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <CardContent sx={{ padding: '8px 24px' }}>
            <Typography
              onClick={() => handleNavigateDetail(data.slug)}
              variant='h5'
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
                marginBottom: '8px',
                cursor: 'pointer',
                minHeight: '49px'
              }}
            >
              {data.name}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                marginBottom: '8px'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {data.discount > 0 && memo && (
                  <Typography
                    variant='h4'
                    sx={{
                      color: theme.palette.error.main,
                      fontWeight: 'bold',
                      textDecoration: 'line-through',
                      fontSize: '14px'
                    }}
                  >
                    {formatNumberToLocal(data.price)} đ
                  </Typography>
                )}
                <Typography
                  variant='h3'
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                    fontSize: '18px'
                  }}
                >
                  {data.discount > 0 && memo
                    ? formatNumberToLocal(data.price * (1 - data.discount / 100))
                    : formatNumberToLocal(data.price)}{' '}
                  đ
                </Typography>
              </Box>
              {data.discount > 0 && memo && (
                <Box
                  sx={{
                    backgroundColor: hexToRGBA(theme.palette.error.main, 0.4),
                    width: '50px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px'
                  }}
                >
                  <Typography
                    variant='h6'
                    sx={{
                      color: theme.palette.error.main,
                      fontSize: '14px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    - {data.discount}%
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
                marginTop: '8px'
              }}
            >
              {data.countInStock > 0 ? (
                <>
                  <Typography variant='body2' color='text.secondary'>
                    {t('Count_in_stock_product', { count: data.countInStock })}
                  </Typography>
                </>
              ) : (
                <Box
                  sx={{
                    backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                    width: '86px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '2px',
                    my: 1
                  }}
                >
                  <Typography
                    variant='h6'
                    sx={{
                      color: theme.palette.error.main,
                      fontSize: '14px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {t('Hết hàng')}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box>
              {data.sold > 0 && (
                <Typography variant='body2' color='text.secondary'>
                  {t('Sold_product_count', { count: data.sold })}
                </Typography>
              )}
              {data.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconifyIcon icon={'akar-icons:location'} />

                  <Typography
                    variant='h6'
                    sx={{
                      color: theme.palette.primary.main,
                      fontSize: '14px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {data.location.name}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {!!data.averageRating ? (
                  <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating
                      name='read-only'
                      sx={{ fontSize: '16px' }}
                      defaultValue={data?.averageRating}
                      precision={0.5}
                      readOnly
                    />
                  </Typography>
                ) : (
                  <Rating name='read-only' sx={{ fontSize: '16px' }} defaultValue={0} precision={0.5} readOnly />
                )}
                <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                  {!!data.totalReviews ? <b>{data.totalReviews}</b> : <span>{t('not_review')}</span>}
                </Typography>
              </Box>
              <IconButton
              // onClick={() => handleToggleLikeProduct(data._id, Boolean(user && data?.likedBy?.includes(user._id)))}
              >
                {/* {user && data?.likedBy?.includes(user._id) ? ( */}
                <IconifyIcon icon='mdi:heart' style={{ color: theme.palette.primary.main }} />
                {/* ) : ( */}
                {/* <Icon icon='tabler:heart' style={{ color: theme.palette.primary.main }} /> */}
                {/* )} */}
              </IconButton>
            </Box>
          </CardContent>
        </Box>
        <Box sx={{ display: 'flex', alignContent: 'center', flexDirection: 'column', gap: 2, padding: '0 12px 10px' }}>
          <Button
            type='button'
            fullWidth
            variant='contained'
            onClick={() => handleAddToCard(data)}
            sx={{
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 'bold'
            }}
          >
            <IconifyIcon icon='mdi:cart-outline' style={{ position: 'relative', top: '-2px' }} />
            {t('Add_to_cart')}
          </Button>
          <Button
            type='button'
            fullWidth
            variant='outlined'
            sx={{
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 'bold'
            }}
          >
            <IconifyIcon icon='icon-park-outline:buy' style={{ position: 'relative', top: '-2px' }} />
            {t('Buy_now')}
          </Button>
        </Box>
      </Box>
    </Styledcard>
  )
}
export default CardProduct
