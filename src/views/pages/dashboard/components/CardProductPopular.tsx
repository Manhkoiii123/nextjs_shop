import { Box, MenuItem, Typography, useTheme } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { ROUTE_CONFIG } from 'src/configs/route'
import { formatNumberToLocal } from 'src/utils'
import { TProductPopular } from 'src/views/pages/dashboard'

interface TProps {
  data: TProductPopular[]
}

const CardProductPopular = (props: TProps) => {
  const { data } = props

  const theme = useTheme()

  const router = useRouter()

  const { t } = useTranslation()

  const handleNavigateDetail = (slug: string) => {
    router.push(`${ROUTE_CONFIG.PRODUCT}/${slug}`)
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: '20px 0',
        height: '400px',
        width: '100%',
        borderRadius: '15px',
        canvas: {
          width: '100% !important'
        }
      }}
    >
      <Box sx={{ padding: '0 20px' }}>
        <Typography sx={{ fontWeight: '600', fontSize: '20px', mb: 2 }}>{t('Popular_products')}</Typography>
      </Box>
      {data?.map((product: TProductPopular) => {
        return (
          <MenuItem
            key={product._id}
            sx={{ gap: 2, overflow: 'hidden' }}
            onClick={() => handleNavigateDetail(product.slug)}
          >
            <Image height={40} width={40} src={product.image} alt='image' />
            <Box sx={{ width: '80%' }}>
              <Typography
                sx={{
                  fontWeight: '600',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%'
                }}
              >
                {product.name}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography color='secondary'>{product?.type?.name}</Typography>
                <Typography>{formatNumberToLocal(product?.price)}vnd</Typography>
              </Box>
            </Box>
          </MenuItem>
        )
      })}
    </Box>
  )
}

export default CardProductPopular
