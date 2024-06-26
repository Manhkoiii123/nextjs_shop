'use client'

import { Button, Rating } from '@mui/material'
import { Box, Grid, Typography, useTheme } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/components/Icon'
import Spinner from 'src/components/spinner'
import { getDetailsProductPublic } from 'src/services/product'
import spacing from 'src/theme/spacing'
import { TProduct } from 'src/types/product'
import { formatNumberToLocal } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

const DetailProductPage = () => {
  const [loading, setLoading] = useState(false)
  const [dataProduct, setDataProduct] = useState<TProduct>()

  const router = useRouter()
  const productId = router.query.productId as string

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
  useEffect(() => {
    if (productId) {
      fetchDetailProduct(productId)
    }
  }, [productId])

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
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
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
                          {dataProduct.averageRating}
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
                          {t('Review')}
                          <b>{dataProduct.totalReviews}</b>
                        </span>
                      ) : (
                        <span>{t('not_review')}</span>
                      )}
                    </Typography>
                    {dataProduct.sold > 0 && (
                      <Typography variant='body2' color='text.secondary'>
                        {t('Sold_product_count', { count: dataProduct.sold })}
                      </Typography>
                    )}
                  </Box>
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
                      {dataProduct.discount > 0 && (
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
                        {dataProduct.discount > 0
                          ? formatNumberToLocal(dataProduct.price * (1 - dataProduct.discount / 100))
                          : formatNumberToLocal(dataProduct.price)}{' '}
                        đ
                      </Typography>
                    </Box>
                    {dataProduct.discount > 0 && (
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
                <Box
                  sx={{
                    display: 'flex',
                    alignContent: 'center',
                    gap: 6,
                    mt: 8,
                    padding: '0 12px 10px'
                  }}
                >
                  <Button
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
        <Grid
          container
          item
          md={12}
          xs={12}
          sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: 5, px: 4, mt: 6 }}
        >
          <Box sx={{ height: '100%', width: '100%' }}>
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
        </Grid>
      </Grid>
    </>
  )
}

export default DetailProductPage
