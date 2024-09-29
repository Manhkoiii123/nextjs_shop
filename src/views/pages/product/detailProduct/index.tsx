'use client'

import { Button, IconButton, Rating } from '@mui/material'
import { Box, Grid, Typography, useTheme } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import CustomCarousel from 'src/components/custom-carousel'
import IconifyIcon from 'src/components/Icon'
import NoData from 'src/components/no-data'
import Spinner from 'src/components/spinner'
import CustomTextField from 'src/components/text-field'
import { OBJECT_TYPE_ERROR_REVIEW } from 'src/configs/error'
import { ROUTE_CONFIG } from 'src/configs/route'
import { getLocalProductCart, setLocalProductToCart } from 'src/helpers/storage'
import { useAuth } from 'src/hooks/useAuth'
import { getAllCommentsPublic } from 'src/services/commentProduct'
import { getDetailsProductPublic, getListRelasedProductBySlug } from 'src/services/product'
import { getAllReviews } from 'src/services/reviewProduct'
import { AppDispatch, RootState } from 'src/stores'
import { updateProductToCard } from 'src/stores/order-product'
import { resetInitialState } from 'src/stores/reviews'
import { TCommentItemProduct } from 'src/types/comment'
import { TProduct } from 'src/types/product'
import { TReviewItem } from 'src/types/reviews'
import { convertUpdateProductToCart, formatFilter, formatNumberToLocal, isExpiry } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import CardProduct from 'src/views/pages/product/components/CardProduct'
import CardRelatedProduct from 'src/views/pages/product/components/CardRelatedProduct'
import CardReview from 'src/views/pages/product/components/CardReview'
import CommentInput from 'src/views/pages/product/components/CommentInput'
import CommentItem from 'src/views/pages/product/components/CommentItem'

const DetailProductPage = () => {
  const [loading, setLoading] = useState(false)
  const [dataProduct, setDataProduct] = useState<TProduct>()
  const [listRelatedProduct, setListRelatedProduct] = useState<TProduct[]>([])
  const [listReviews, setListReview] = useState<TReviewItem[]>([])
  const [listComment, setListComment] = useState<TCommentItemProduct[]>([])
  const router = useRouter()
  const productId = router.query.productId as string
  const { user } = useAuth()
  const dispatch: AppDispatch = useDispatch()
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)
  const {
    isSuccessEdit,
    isErrorEdit,
    isLoading,
    messageErrorEdit,
    isErrorDelete,
    isSuccessDelete,
    messageErrorDelete,
    typeError
  } = useSelector((state: RootState) => state.reviews)

  const [amountProduct, setAmountProduct] = useState(1)

  const { t } = useTranslation()
  const theme = useTheme()
  const fetchDetailProduct = async (slug: string) => {
    setLoading(true)
    await getDetailsProductPublic(slug)
      .then(res => {
        setLoading(false)
        const data = res.data
        if (data) {
          setDataProduct(data)
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }
  const fetchListRelasedProduct = async (slug: string) => {
    setLoading(true)
    await getListRelasedProductBySlug({ params: { slug: slug } })
      .then(res => {
        setLoading(false)
        const data = res.data
        if (data) {
          setListRelatedProduct(data.products)
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }
  const fetchListCommentProduct = async () => {
    setLoading(true)
    await getAllCommentsPublic({ params: { limit: -1, page: -1, order: 'createdAt desc' } })
      .then(res => {
        setLoading(false)
        const data = res.data
        setListComment(data.comments)
      })
      .catch(() => {
        setLoading(false)
      })
  }
  useEffect(() => {
    if (productId) {
      fetchDetailProduct(productId)
      fetchListRelasedProduct(productId)
      fetchListCommentProduct()
    }
  }, [productId])

  const fetchGetAllListReviewByProduct = async (id: string) => {
    setLoading(true)
    await getAllReviews({
      params: {
        limit: -1,
        page: -1,
        order: 'createdAt desc',
        isPublic: true,
        ...formatFilter({ productId: id })
      }
    })
      .then(async response => {
        setLoading(false)
        const data = response?.data?.reviews
        if (data) {
          setListReview(data)
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (dataProduct?._id) {
      fetchGetAllListReviewByProduct(dataProduct._id)
    }
  }, [dataProduct?._id])
  useEffect(() => {
    if (isSuccessEdit && dataProduct?._id) {
      toast.success(t('Update_review_success'))
      fetchGetAllListReviewByProduct(dataProduct._id)
      dispatch(resetInitialState())
    } else if (isErrorEdit && messageErrorEdit && typeError && dataProduct?._id) {
      const errorConfig = OBJECT_TYPE_ERROR_REVIEW[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        toast.error(t('Update_review_error'))
      }
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessEdit, isErrorEdit, messageErrorEdit, typeError])
  useEffect(() => {
    if (isSuccessDelete && dataProduct?._id) {
      toast.success(t('Delete_review_success'))
      fetchGetAllListReviewByProduct(dataProduct._id)
      dispatch(resetInitialState())
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t('Delete_review_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete, dataProduct?._id])

  const handleBuyProduct = (item: TProduct) => {
    handleAddToCard(item)
    router.push(
      {
        pathname: ROUTE_CONFIG.MY_CART,
        query: {
          selected: item._id
        }
      },
      ROUTE_CONFIG.MY_CART // custom cái url mặc dù truyền lên cái selectedId đấy nhưng mà nó ko hiện lên url
    )
  }

  const memo = useMemo(() => {
    return dataProduct && isExpiry(dataProduct.discountStartDate, dataProduct.discountEndDate)
  }, [dataProduct])
  const handleAddToCard = (item: TProduct) => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const discountItem =
      dataProduct && isExpiry(dataProduct.discountStartDate, dataProduct.discountEndDate) ? item.discount : 0
    const listOrderItem = convertUpdateProductToCart(orderItems, {
      name: item.name,
      amount: amountProduct,
      image: item.image,
      price: item.price,
      discount: discountItem,
      product: item._id,
      slug: item.slug
      // countInStock: item.countInStock
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

  const handleCancelComment = () => {}

  const handleComment = (comment: string) => {}

  if (!dataProduct) return null

  return (
    <>
      {loading && <Spinner />}
      <Grid container>
        <Grid
          container
          item
          md={12}
          xs={12}
          sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: 5, px: 4 }}
        >
          <Box sx={{ height: '100%', width: '100%' }}>
            <Grid container spacing={8}>
              <Grid item md={5} xs={12}>
                <Image
                  src={dataProduct.image}
                  alt='image product'
                  width={0}
                  height={0}
                  style={{
                    height: '100%',
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    borderRadius: '15px'
                  }}
                />
              </Grid>
              <Grid item md={7} xs={12}>
                <Box>
                  <Typography
                    variant='h5'
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      cursor: 'pointer',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                      overflow: 'hidden'
                    }}
                  >
                    {dataProduct?.name}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                      marginTop: '8px',
                      height: '40px'
                    }}
                  >
                    {dataProduct.countInStock > 0 ? (
                      <>
                        <Typography variant='body2' color='text.secondary'>
                          {t('Count_in_stock_product', { count: dataProduct.countInStock })}
                        </Typography>
                      </>
                    ) : (
                      <Box
                        sx={{
                          backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                          width: '100px',
                          padding: '8px 0',
                          // height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px',
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
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    {dataProduct.averageRating > 0 && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2
                        }}
                      >
                        <Typography
                          variant='h5'
                          sx={{
                            fontSize: '16px',
                            color: theme.palette.primary.main,
                            fontWeight: 'bold',
                            textDecoration: 'underline'
                          }}
                        >
                          {dataProduct.averageRating.toFixed(2)}
                        </Typography>
                        <Rating
                          name='read-only'
                          sx={{ fontSize: '16px' }}
                          precision={0.1}
                          defaultValue={dataProduct.averageRating}
                          readOnly
                        />
                      </Box>
                    )}
                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      {!!dataProduct.totalReviews ? (
                        <span>
                          <b>{dataProduct.totalReviews}</b> {t('reviews')}
                        </span>
                      ) : (
                        <span>{t('not_review')}</span>
                      )}
                    </Typography>

                    {dataProduct.sold > 0 && (
                      <>
                        {'  |  '}
                        <Typography variant='body2' color='text.secondary'>
                          {t('Sold_product_count', { count: dataProduct.sold })}
                        </Typography>
                      </>
                    )}
                  </Box>
                  {dataProduct.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 4 }}>
                      <IconifyIcon icon={'akar-icons:location'} />

                      <Typography
                        variant='h6'
                        sx={{
                          color: theme.palette.primary.main,
                          fontSize: '14px',
                          whiteSpace: 'nowrap',
                          mt: '1px'
                        }}
                      >
                        {dataProduct.location.name}
                      </Typography>
                    </Box>
                  )}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                      marginBottom: '8px',
                      mt: 4,
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: theme.palette.customColors.bodyBg
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {dataProduct.discount > 0 && memo && (
                        <Typography
                          variant='h4'
                          sx={{
                            color: theme.palette.error.main,
                            fontWeight: 'bold',
                            textDecoration: 'line-through',
                            fontSize: '18px'
                          }}
                        >
                          {formatNumberToLocal(dataProduct.price)} đ
                        </Typography>
                      )}
                      <Typography
                        variant='h3'
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 'bold',
                          fontSize: '24px'
                        }}
                      >
                        {dataProduct.discount > 0 && memo
                          ? formatNumberToLocal(dataProduct.price * (1 - dataProduct.discount / 100))
                          : formatNumberToLocal(dataProduct.price)}{' '}
                        đ
                      </Typography>
                    </Box>
                    {dataProduct.discount > 0 && memo && (
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
                          - {dataProduct.discount}%
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', mt: 8, alignItems: 'center', gap: 2, maxWidth: '200px' }}>
                  <IconButton
                    onClick={() => {
                      if (amountProduct > 1) setAmountProduct(prev => prev - 1)
                    }}
                    sx={{
                      backgroundColor: `${theme.palette.primary.main} !important`,
                      color: `${theme.palette.common.white}`
                    }}
                  >
                    <IconifyIcon icon='ic:sharp-minus' />
                  </IconButton>

                  <CustomTextField
                    type='number'
                    value={amountProduct}
                    onChange={e => {
                      setAmountProduct(+e.target.value)
                    }}
                    inputProps={{
                      inputMode: 'numeric',
                      min: 1,
                      max: dataProduct.countInStock
                    }}
                    sx={{
                      '.MuiInputBase-input.MuiFilledInput-input': {
                        width: '20px'
                      },
                      '.MuiInputBase-root.MuiFilledInput-root': {
                        borderRadius: '0px',
                        borderTop: 'none',
                        borderRight: 'none',
                        borderLeft: 'none',
                        '&.Mui-focused': {
                          backgroundColor: `${theme.palette.background.paper} !important`,
                          boxShadow: 'none !important'
                        }
                      },
                      'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0
                      },
                      'input[type=number]': {
                        MozAppearance: 'textfield'
                      }
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      if (amountProduct < dataProduct.countInStock) setAmountProduct(prev => prev + 1)
                    }}
                    sx={{
                      backgroundColor: `${theme.palette.primary.main} !important`,
                      color: `${theme.palette.common.white}`
                    }}
                  >
                    <IconifyIcon icon='ic:round-plus' />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignContent: 'center',
                    gap: 6,
                    mt: 8,
                    paddingBottom: '10px'
                  }}
                >
                  <Button
                    disabled={dataProduct.countInStock === 0}
                    onClick={() => handleAddToCard(dataProduct)}
                    type='button'
                    variant='contained'
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
                    onClick={() => handleBuyProduct(dataProduct)}
                    disabled={dataProduct.countInStock === 0}
                    type='button'
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
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid container mt={6}>
          <Grid item md={8.5} xs={12}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              {/* desc */}
              <Box sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: 5, px: 4 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    marginBottom: '8px',
                    mt: 4,
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: theme.palette.customColors.bodyBg
                  }}
                >
                  <Typography
                    variant='h4'
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '18px',
                      color: `rgba(${theme.palette.customColors.main}, 0.68)`
                    }}
                  >
                    {t('Description_product')}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mt: 4,
                    color: `rgba(${theme.palette.customColors.main}, 0.42)`,
                    fontSize: '14px',
                    backgroundColor: theme.palette.customColors.bodyBg,
                    padding: 4,
                    borderRadius: '10px'
                  }}
                  dangerouslySetInnerHTML={{ __html: dataProduct.description }}
                />
              </Box>
              {/* reviews */}
              <Box
                display={{ md: 'block', xs: 'none' }}
                sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: 5, px: 4 }}
              >
                <Typography
                  variant='h6'
                  sx={{
                    color: `rgba(${theme.palette.customColors.main}, 0.68)`,
                    fontWeight: 'bold',
                    fontSize: '18px',
                    marginBottom: '20px'
                  }}
                >
                  {t('Review_product')} <b style={{ color: theme.palette.primary.main }}>{listReviews.length}</b>{' '}
                  {t('ratings')}
                </Typography>
                <Box sx={{ width: '100%' }}>
                  <CustomCarousel
                    arrows
                    showDots={true}
                    ssr={true}
                    responsive={{
                      superLargeDesktop: {
                        breakpoint: { max: 4000, min: 3000 },
                        items: 4
                      },
                      desktop: {
                        breakpoint: { max: 3000, min: 1024 },
                        items: 3
                      },
                      tablet: {
                        breakpoint: { max: 1024, min: 464 },
                        items: 2
                      },
                      mobile: {
                        breakpoint: { max: 464, min: 0 },
                        items: 1
                      }
                    }}
                  >
                    {listReviews.map((review: TReviewItem) => {
                      return (
                        <Box key={review._id} sx={{ margin: '0 10px' }}>
                          <CardReview item={review} />
                        </Box>
                      )
                    })}
                  </CustomCarousel>
                </Box>
              </Box>
              {/* comment */}
              <Box sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: 5, px: 4 }}>
                <Typography
                  variant='h6'
                  sx={{
                    color: `rgba(${theme.palette.customColors.main}, 0.68)`,
                    fontWeight: 'bold',
                    fontSize: '18px',
                    marginBottom: '20px'
                  }}
                >
                  {t('Comment')} <b style={{ color: theme.palette.primary.main }}>{listComment.length || 0}</b>{' '}
                </Typography>
                <Box sx={{ width: '100%' }}>
                  <CommentInput onCancel={handleCancelComment} onApply={handleComment} />
                  <Box
                    mt={8}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px'
                    }}
                  >
                    {listComment.map(c => {
                      return <CommentItem key={c._id} item={c} />
                    })}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item md={3.5} xs={12} mt={{ md: 0, xs: 5 }}>
            <Box
              sx={{
                marginLeft: { md: 5, xs: 0 },
                backgroundColor: theme.palette.background.paper,
                borderRadius: '15px',
                py: 5,
                px: 4
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  marginBottom: '8px',
                  mt: 4,
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: theme.palette.customColors.bodyBg
                }}
              >
                <Typography
                  variant='h4'
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '18px',
                    color: `rgba(${theme.palette.customColors.main}, 0.68)`
                  }}
                >
                  {t('Product_same')}
                </Typography>
              </Box>
              <Box
                sx={{
                  mt: 4
                }}
              >
                {listRelatedProduct?.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {listRelatedProduct.map(item => {
                      return <CardRelatedProduct key={item._id} item={item} />
                    })}
                  </Box>
                ) : (
                  <Box sx={{ width: '100%', mt: 10 }}>
                    <NoData />
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
          <Box
            display={{ md: 'none', xs: 'block' }}
            sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: 5, px: 4, width: '100%' }}
            marginTop={{ md: 5, xs: 4 }}
          >
            <Typography
              variant='h6'
              sx={{
                color: `rgba(${theme.palette.customColors.main}, 0.68)`,
                fontWeight: 'bold',
                fontSize: '18px'
              }}
            >
              {t('Review_product')} <b style={{ color: theme.palette.primary.main }}>{listReviews?.length}</b>{' '}
              {t('ratings')}
            </Typography>
            <Box sx={{ width: '100%' }}>
              <CustomCarousel
                arrows
                showDots={true}
                ssr={true}
                responsive={{
                  superLargeDesktop: {
                    breakpoint: { max: 4000, min: 3000 },
                    items: 4
                  },
                  desktop: {
                    breakpoint: { max: 3000, min: 1024 },
                    items: 3
                  },
                  tablet: {
                    breakpoint: { max: 1024, min: 464 },
                    items: 2
                  },
                  mobile: {
                    breakpoint: { max: 464, min: 0 },
                    items: 1
                  }
                }}
              >
                {listReviews.map((review: TReviewItem) => {
                  return (
                    <Box key={review._id} sx={{ margin: '0 10px' }}>
                      <CardReview item={review} />
                    </Box>
                  )
                })}
              </CustomCarousel>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default DetailProductPage
