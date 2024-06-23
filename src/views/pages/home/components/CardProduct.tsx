import React, { useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import IconifyIcon from 'src/components/Icon'
import { Box, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface TCardProduct {}

const Styledcard = styled(Card)(({ theme }) => ({
  position: 'relative'
}))

const CardProduct = (props: TCardProduct) => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Styledcard sx={{ maxWidth: 400 }}>
      <IconButton sx={{ position: 'absolute', top: '6px', right: '6px' }}>
        <IconifyIcon icon={'mdi:heart'} />
      </IconButton>
      <CardMedia component='img' height='194' image='/static/images/cards/paella.jpg' alt='Paella dish' />
      <CardContent sx={{ padding: '8px 24px' }}>
        <Typography
          variant='h5'
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'bold'
          }}
        >
          Tên sản phẩm Tên sản phẩm
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant='h3'
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              fontSize: '18px'
            }}
          >
            500.000 đ
          </Typography>
          <Typography
            variant='h4'
            sx={{
              color: theme.palette.error.main,
              fontWeight: 'bold',
              textDecoration: 'line-through',
              fontSize: '14px'
            }}
          >
            500.000 đ
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='body2' color='text.secondary'>
            Còn <b>7</b> sản phẩm trong kho
          </Typography>
          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <b>5</b>
            <IconifyIcon icon='emojione:star' fontSize={16} style={{ position: 'relative', top: '-1px' }} />
          </Typography>
        </Box>
      </CardContent>

      <Button
        type='submit'
        fullWidth
        variant='contained'
        sx={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          fontWeight: 'bold'
        }}
      >
        <IconifyIcon icon='mdi:cart-outline' style={{ position: 'relative', top: '-2px' }} />
        {t('Add_to_cart')}
      </Button>
    </Styledcard>
  )
}
export default CardProduct
