/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Box, Button, Checkbox, Divider, IconButton, Tooltip, Typography, useTheme } from '@mui/material'
import { NextPage } from 'next'
import CustomTextField from 'src/components/text-field'
import { Fragment, useEffect, useMemo, useState } from 'react'
import IconifyIcon from 'src/components/Icon'
import { useTranslation } from 'react-i18next'
import { cloneDeep, convertUpdateProductToCart, formatNumberToLocal } from 'src/utils'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/stores'
import Spinner from 'src/components/spinner'
import { TItemOrderProduct } from 'src/types/order-product-type'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { getLocalProductCart, setLocalProductToCart } from 'src/helpers/storage'
import { updateProductToCard } from 'src/stores/order-product'
import { useAuth } from 'src/hooks/useAuth'
import NoData from 'src/components/no-data'
import { current } from '@reduxjs/toolkit'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'
import ItemProductCard from 'src/views/pages/my-cart/components/ItemProductCard'

type TProps = {}

const MyCardPage: NextPage<TProps> = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const router = useRouter()
  const theme = useTheme()
  const dispatch = useDispatch()
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const handleSetSelectedRows = (value: string[]) => {
    setSelectedRows(value)
  }
  const memoListAllProductId = useMemo(() => {
    return orderItems.map((item: TItemOrderProduct) => item.product)
  }, [orderItems])

  //tong tien
  const memoItemSelected = useMemo(() => {
    const res: TItemOrderProduct[] = []

    selectedRows.map(item => {
      const findItem: any = orderItems.find((i: TItemOrderProduct) => i.product === item)
      if (findItem) {
        res.push(findItem)
      }
    })

    return res
  }, [selectedRows, orderItems])

  const memoTotal = useMemo(() => {
    const total = memoItemSelected?.reduce((res, item: TItemOrderProduct) => {
      const currentPrice = item?.discount > 0 ? (item?.price * (100 - item?.discount)) / 100 : item?.price

      return res + currentPrice * item?.amount
    }, 0)

    return memoItemSelected.length !== 0 ? total : 0
  }, [memoItemSelected])

  useEffect(() => {
    const productSelect = router.query.selected as string
    if (productSelect) {
      if (typeof productSelect === 'string') {
        setSelectedRows([productSelect])
      } else {
        setSelectedRows([...productSelect])
      }
    }
  }, [router.query])

  const handleDeleteMany = () => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const cloneOrderItem = cloneDeep(orderItems)
    const filteredItem = cloneOrderItem.filter((item: TItemOrderProduct) => !selectedRows.includes(item.product))
    if (user?._id) {
      dispatch(
        updateProductToCard({
          orderItems: filteredItem
        })
      )
      setLocalProductToCart({ ...parseData, [user._id]: filteredItem })
    }
    setSelectedRows([])
  }

  const handleChangeCheckAll = () => {
    if (memoListAllProductId.every(id => selectedRows.includes(id))) {
      setSelectedRows([])
    } else {
      setSelectedRows(memoListAllProductId)
    }
  }
  const handleNavigateCheckout = () => {
    const formatData = JSON.stringify(
      memoItemSelected.map(item => ({
        product: item.product,
        amount: item.amount
      }))
    )
    router.push({
      pathname: ROUTE_CONFIG.CHECKOUT_PRODUCT,
      query: {
        totalPrice: memoTotal,
        product: formatData
      }
    })
  }

  return (
    <>
      {loading || (loading && <Spinner />)}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: '40px',
          width: '100%',
          borderRadius: '15px'
        }}
      >
        {orderItems.length > 0 ? (
          <Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px', mb: '10px' }}>
              <Box sx={{ width: 'calc(10% - 100px)' }}>
                <Tooltip title={t('Select_all')}>
                  <Checkbox
                    onChange={handleChangeCheckAll}
                    checked={memoListAllProductId.every((id: string) => selectedRows.includes(id))}
                  />
                </Tooltip>
              </Box>
              <Box sx={{ display: 'flex', maxWidth: '100%', justifyContent: 'center', flexBasis: 'calc(35% + 60px)' }}>
                <Typography sx={{ fontWeight: 600 }}>{t('Name_product')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', maxWidth: '100%', justifyContent: 'center', flexBasis: '20%' }}>
                <Typography sx={{ fontWeight: 600 }}>{t('Price_original')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', maxWidth: '100%', justifyContent: 'center', flexBasis: '20%' }}>
                <Typography sx={{ fontWeight: 600 }}>{t('Price_discount')}</Typography>
              </Box>

              <Box sx={{ display: 'flex', maxWidth: '100%', justifyContent: 'center', flexBasis: '12%' }}>
                <Typography sx={{ fontWeight: 600 }}>{t('Count')}</Typography>
              </Box>
              <Box sx={{ flexBasis: '5%', display: 'flex', justifyContent: 'center' }}>
                <Tooltip title={t('Delete_all')}>
                  <IconButton disabled={!selectedRows.length} onClick={handleDeleteMany}>
                    <IconifyIcon icon='mdi:delete-outline' />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Divider orientation='horizontal' />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: '8px',
                mt: '10px',
                mb: '10px'
              }}
            >
              {orderItems.map((item: TItemOrderProduct, index: number) => {
                return (
                  <ItemProductCard
                    handleSetSelectedRows={handleSetSelectedRows}
                    selectedRows={selectedRows}
                    index={index}
                    item={item}
                    key={item.product}
                  />
                )
              })}
            </Box>
          </Fragment>
        ) : (
          <Box
            sx={{
              height: '100%',
              width: '100%'
            }}
          >
            <NoData />
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 5,
            gap: 3
          }}
        >
          <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>{t('Sum_money')} : </Typography>
          <Typography sx={{ fontSize: '20px', fontWeight: 600, color: theme.palette.primary.main }}>
            {formatNumberToLocal(memoTotal)} VND
          </Typography>
        </Box>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          onClick={handleNavigateCheckout}
          disabled={!selectedRows.length || !memoItemSelected.length}
          variant='contained'
          sx={{
            height: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <IconifyIcon icon='icon-park-outline:buy' fontSize={20} style={{ position: 'relative', top: '-2px' }} />
          {t('Buy_now')}
        </Button>
      </Box>
    </>
  )
}
export default MyCardPage
