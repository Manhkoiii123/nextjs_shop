/* eslint-disable react-hooks/exhaustive-deps */
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import { NextPage } from 'next'
import { ChangeEvent, Fragment, useEffect, useMemo, useState } from 'react'
import IconifyIcon from 'src/components/Icon'
import { useTranslation } from 'react-i18next'
import { formatNumberToLocal, toFullName } from 'src/utils'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from 'src/components/spinner'
import { TItemOrderProduct } from 'src/types/order-product-type'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { useAuth } from 'src/hooks/useAuth'
import NoData from 'src/components/no-data'
import { useRouter } from 'next/router'
import { getAllPaymentTypes } from 'src/services/payment-type'
import { getAllDeliveryTypes } from 'src/services/delivery-type'
import { createOrderProductAsync } from 'src/stores/order-product/actions'
import { AppDispatch, RootState } from 'src/stores'
import { ROUTE_CONFIG } from 'src/configs/route'
import { resetInitialState } from 'src/stores/order-product'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

type TProps = {}

const CheckoutProductPage: NextPage<TProps> = () => {
  const router = useRouter()
  const memoQueryProduct = useMemo(() => {
    const res = {
      totalPrice: 0,
      product: []
    }
    const data: any = router.query
    if (data) {
      res.totalPrice = data.totalPrice || 0
      res.product = data.product ? JSON.parse(data.product) : []
    }

    return res
  }, [router.query])

  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const dispatch: AppDispatch = useDispatch()
  const [optionsPaymentType, setOptionPaymentType] = useState<{ label: string; value: string }[]>([])
  const [optionsDelivery, setOptionsDelivery] = useState<{ label: string; value: string; price: number }[]>([])
  const [paymentSelected, setPaymentSelected] = useState('')
  const [deliverySelected, setDeliverySelected] = useState('')
  const { isLoading, isErrorCreate, isSuccessCreate, messageErrorCreate, orderItems } = useSelector(
    (state: RootState) => state.orderProduct
  )
  const handleGetAllPaymentType = async () => {
    await getAllPaymentTypes({ params: { limit: -1, page: -1 } }).then(res => {
      const data = res?.data?.paymentTypes
      if (data) {
        setOptionPaymentType(
          data.map((item: { name: string; _id: string }) => ({
            label: item.name,
            value: item._id
          }))
        )
        setPaymentSelected(data[0]?._id)
      }
    })
  }
  const handleGetAllDelivery = async () => {
    await getAllDeliveryTypes({ params: { limit: -1, page: -1 } }).then(res => {
      const data = res?.data?.deliveryTypes
      if (data) {
        setOptionsDelivery(
          data.map((item: { name: string; _id: string; price: number }) => ({
            label: item.name,
            value: item._id,
            price: item.price
          }))
        )
        setDeliverySelected(data[0]?._id)
      }
    })
  }
  useEffect(() => {
    handleGetAllPaymentType()
    handleGetAllDelivery()
  }, [])

  const onChangePaymentType = (value: string) => {
    setPaymentSelected(value)
  }
  const onChangeDeliveryType = (value: string) => {
    setDeliverySelected(value)
  }

  const handleOrderProduct = () => {
    const shippingPrice = optionsDelivery.find(item => item.value === deliverySelected)?.price ?? 0
    const totalPrice = shippingPrice + Number(memoQueryProduct.totalPrice)
    const data = {
      orderItems: memoQueryProduct.product,
      itemsPrice: +memoQueryProduct.totalPrice,
      paymentMethod: paymentSelected,
      deliveryMethod: deliverySelected,
      shippingPrice: shippingPrice,
      totalPrice: totalPrice,
      user: user ? user?._id : '',
      fullName: user ? toFullName(user?.lastName, user?.middleName, user?.firstName, i18n.language) : '',
      address: user?.address ? user.address : '',
      city: user?.city ? user.city : '',
      phone: user?.phoneNumber ? user.phoneNumber : ''
    }
    dispatch(createOrderProductAsync(data))
  }
  useEffect(() => {
    if (isSuccessCreate) {
      Swal.fire({
        title: t('Congraturation!'),
        text: t('Order_product_success'),
        icon: 'success',
        confirmButtonText: t('Confirm'),
        background: theme.palette.background.paper,
        color: `rgba(${theme.palette.customColors.main}, 0.78)`
      }).then(result => {
        if (result.isConfirmed) {
          // router.push(ROUTE_CONFIG.MY_ORDER)
        }
      })
      // handleChangeAmountCart(memoQueryProduct.productsSelected)

      dispatch(resetInitialState())
    } else if (isErrorCreate && messageErrorCreate) {
      toast.error(t('Warning_order_product'))
      Swal.fire({
        title: t('Opps!'),
        text: t('Warning_order_product'),
        icon: 'error',
        confirmButtonText: t('Confirm'),
        background: theme.palette.background.paper,
        color: `rgba(${theme.palette.customColors.main}, 0.78)`
      })
      dispatch(resetInitialState())
    }
  }, [isSuccessCreate, isErrorCreate, messageErrorCreate])

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
        {memoQueryProduct?.product?.length > 0 ? (
          <Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px', mb: '10px' }}>
              <Box sx={{ display: 'flex', maxWidth: '100%', justifyContent: 'center', flexBasis: 'calc(35% + 85px)' }}>
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
              {memoQueryProduct.product.map((item: TItemOrderProduct, index: number) => {
                return (
                  <Fragment key={item.product}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                      <Box
                        sx={{
                          flexBasis: '12%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 2
                        }}
                      >
                        <Typography
                          variant='h6'
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                            fontSize: '16px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.amount}
                        </Typography>
                      </Box>
                    </Box>
                    {index !== memoQueryProduct.product.length - 1 && <Divider />}
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
      </Box>

      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: '40px',
          width: '100%',
          borderRadius: '15px',
          mt: 6
        }}
      >
        <Box>
          <FormControl sx={{ flexDirection: 'row !important', gap: 10 }}>
            <FormLabel sx={{ color: theme.palette.primary.main, fontWeight: 600, width: '260px' }} id='delivery-group'>
              {t('Select_delivery_type')}
            </FormLabel>
            <RadioGroup
              sx={{ position: 'relative', top: '-6px' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeDeliveryType(e.target.value)}
              aria-labelledby='delivery-group'
              name='radio-delivery-group'
            >
              {optionsDelivery.map(delivery => {
                return (
                  <FormControlLabel
                    key={delivery.value}
                    value={delivery.value}
                    control={<Radio checked={deliverySelected === delivery.value} />}
                    label={delivery.label}
                  />
                )
              })}
            </RadioGroup>
          </FormControl>
        </Box>
        <Box sx={{ mt: 4 }}>
          <FormControl sx={{ flexDirection: 'row !important', gap: 10 }}>
            <FormLabel sx={{ color: theme.palette.primary.main, fontWeight: 600, width: '260px' }} id='payment-group'>
              {t('Select_payment_type')}
            </FormLabel>
            <RadioGroup
              sx={{ position: 'relative', top: '-6px' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangePaymentType(e.target.value)}
              aria-labelledby='payment-group'
              name='radio-payment-group'
            >
              {optionsPaymentType.map(payment => {
                return (
                  <FormControlLabel
                    key={payment.value}
                    value={payment.value}
                    control={<Radio checked={paymentSelected === payment.value} />}
                    label={payment.label}
                  />
                )
              })}
            </RadioGroup>
          </FormControl>
        </Box>

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
            {formatNumberToLocal(memoQueryProduct.totalPrice)} VND
          </Typography>
        </Box>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          onClick={handleOrderProduct}
          variant='contained'
          sx={{
            height: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {t('Đặt hàng')}
        </Button>
      </Box>
    </>
  )
}
export default CheckoutProductPage
