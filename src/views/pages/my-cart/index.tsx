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

type TProps = {}

const MyCardPage: NextPage<TProps> = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const router = useRouter()
  const theme = useTheme()
  const dispatch = useDispatch()
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)
  console.log('🚀 ~ orderItems:', orderItems)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [amountProduct, setAmountProduct] = useState<number>(0)
  const memoListAllProductId = useMemo(() => {
    return orderItems.map((item: TItemOrderProduct) => item.product)
  }, [orderItems])

  //tong tien
  const memoItemSelected = useMemo(() => {
    return selectedRows.map(item => {
      const findItem: any = orderItems.find((i: TItemOrderProduct) => i.product === item)
      if (findItem) {
        return {
          ...findItem
        }
      }
    })
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
      setSelectedRows([productSelect])
    }
  }, [router.query])

  const handleChangeAmountCart = (item: TItemOrderProduct, number: number) => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const listOrderItem = convertUpdateProductToCart(orderItems, {
      name: item.name,
      amount: number,
      image: item.image,
      price: item.price,
      discount: item.discount,
      product: item.product,
      slug: item.slug,
      countInStock: item.countInStock
    })
    if (user?._id) {
      dispatch(
        updateProductToCard({
          orderItems: listOrderItem
        })
      )
      setLocalProductToCart({ ...parseData, [user._id]: listOrderItem })
    }
    if (item.amount + number === 0) {
      setSelectedRows(selectedRows.filter((i: string) => i !== item.product))
    }
  }
  const handleDeleteProductCart = (id: string) => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const cloneOrderItem = cloneDeep(orderItems)
    const filteredItem = cloneOrderItem.filter((item: TItemOrderProduct) => item.product !== id)
    if (user?._id) {
      dispatch(
        updateProductToCard({
          orderItems: filteredItem
        })
      )
      setLocalProductToCart({ ...parseData, [user._id]: filteredItem })
    }
    setSelectedRows(selectedRows.filter((i: string) => i !== id))
  }
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
  const handleChangeCheckbox = (value: string) => {
    const isChecked = selectedRows.find((item: string) => item === value)
    if (isChecked) {
      setSelectedRows(selectedRows.filter((item: string) => item !== value))
    } else {
      setSelectedRows([...selectedRows, value])
    }
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
    router.push(
      {
        pathname: ROUTE_CONFIG.CHECKOUT_PRODUCT,
        query: {
          totalPrice: memoTotal,
          product: formatData
        }
      }
      // 'checkout-product'
    )
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
                mt: '10px'
              }}
            >
              {orderItems.map((item: TItemOrderProduct, index: number) => {
                return (
                  <Fragment key={item.product}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Box sx={{ width: 'calc(10% - 100px)' }}>
                        <Checkbox
                          checked={selectedRows.includes(item.product)}
                          value={item.product}
                          onChange={e => {
                            handleChangeCheckbox(e.target.value)
                          }}
                        />
                      </Box>

                      <Avatar variant='square' sx={{ width: '60px', height: '60px' }} src={item.image} />

                      <Typography
                        sx={{
                          marginLeft: '20px',
                          fontSize: '16px',
                          flexBasis: '35%',
                          maxWidth: '100%',
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                          overflow: 'hidden'
                        }}
                      >
                        {item.name}
                      </Typography>

                      <Box
                        sx={{
                          flexBasis: '20%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography
                          variant='h6'
                          mt={2}
                          sx={{
                            color: item.discount > 0 ? theme.palette.error.main : theme.palette.primary.main,
                            fontWeight: 'bold',
                            textDecoration: item.discount > 0 ? 'line-through' : 'none',
                            fontSize: '18px'
                          }}
                        >
                          {formatNumberToLocal(item.price)} VND
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          flexBasis: '20%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          justifyContent: 'center'
                        }}
                      >
                        {item.discount > 0 && (
                          <Typography
                            variant='h4'
                            mt={2}
                            sx={{
                              color: theme.palette.primary.main,
                              fontWeight: 'bold',
                              fontSize: '18px'
                            }}
                          >
                            {formatNumberToLocal((item.price * (100 - item.discount)) / 100)}
                            VND
                          </Typography>
                        )}

                        {item.discount > 0 && (
                          <Box
                            sx={{
                              backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                              width: '40px',
                              height: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '2px',
                              mb: 2
                            }}
                          >
                            <Typography
                              variant='h6'
                              sx={{
                                color: theme.palette.error.main,
                                fontSize: '10px',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              - {item.discount} %
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ flexBasis: '12%', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                          onClick={() => handleChangeAmountCart(item, -1)}
                          sx={{
                            backgroundColor: `${theme.palette.primary.main} !important`,
                            color: `${theme.palette.common.white}`
                          }}
                        >
                          <IconifyIcon icon='ic:sharp-minus' />
                        </IconButton>

                        <CustomTextField
                          // type='number'
                          value={amountProduct || item.amount}
                          inputProps={{
                            inputMode: 'numeric',
                            min: 1,
                            max: item.countInStock
                          }}
                          // onChange={e => {
                          //   setAmountProduct(+e.target.value)
                          //   handleChangeAmountCart(item, +e.target.value)
                          // }}
                          // margin='normal'
                          // sx={{
                          //   '.MuiFormControl-root.MuiFormControl-marginNormal': {
                          //     marginBlock: '0px !important'
                          //   },
                          //   '.MuiInputBase-input.MuiFilledInput-input': {
                          //     width: '20px'
                          //   },
                          //   '.MuiInputBase-root.MuiFilledInput-root': {
                          //     borderRadius: '0px',
                          //     borderTop: 'none',
                          //     borderRight: 'none',
                          //     borderLeft: 'none',
                          //     '&.Mui-focused': {
                          //       backgroundColor: `${theme.palette.background.paper} !important`,
                          //       boxShadow: 'none !important'
                          //     }
                          //   },
                          //   'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                          //     WebkitAppearance: 'none',
                          //     margin: 0
                          //   },
                          //   'input[type=number]': {
                          //     MozAppearance: 'textfield'
                          //   }
                          // }}
                        />
                        <IconButton
                          disabled={item.amount + 1 > item.countInStock}
                          onClick={() => handleChangeAmountCart(item, 1)}
                          sx={{
                            backgroundColor: `${theme.palette.primary.main} !important`,
                            color: `${theme.palette.common.white}`
                          }}
                        >
                          <IconifyIcon icon='ic:round-plus' />
                        </IconButton>
                      </Box>
                      <Box sx={{ flexBasis: '5%', display: 'flex', justifyContent: 'center' }}>
                        <IconButton
                          onClick={() => {
                            handleDeleteProductCart(item.product)
                          }}
                        >
                          <IconifyIcon icon='mdi:delete-outline' />
                        </IconButton>
                      </Box>
                    </Box>
                    {index !== orderItems.length - 1 && <Divider />}
                  </Fragment>
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
          disabled={!selectedRows.length}
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
