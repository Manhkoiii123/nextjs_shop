import React, { ChangeEvent } from 'react'
import { styled, useTheme } from '@mui/material/styles'

import { Box, BoxProps, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { FILTER_REVIEW_PRODUCT } from 'src/configs/product'
import { FormLabel } from '@mui/material'
import { IconButton } from '@mui/material'
import IconifyIcon from 'src/components/Icon'

interface TFilterProduct {
  handleFilterProduct: (value: string, type: string) => void
  optionCities: { label: string; value: string }[]
  locationSelected: string
  reviewSelected: string
  handleReset: () => void
}

const StyledFilterProduct = styled(Box)<BoxProps>(({ theme }) => ({
  padding: '10px',
  border: `1px solid rgba(${theme.palette.customColors.main},0.3)`,
  borderRadius: '16px'
}))

const FilterProduct = (props: TFilterProduct) => {
  const { handleFilterProduct, optionCities, reviewSelected, locationSelected, handleReset } = props
  const { t } = useTranslation()
  const theme = useTheme()
  const listReviewProducts = FILTER_REVIEW_PRODUCT()
  const onChangeFilter = (value: string, type: string) => {
    handleFilterProduct(value, type)
  }
  const handleResetFilter = () => {
    handleReset()
  }

  return (
    <StyledFilterProduct sx={{ width: '100%', padding: 4 }}>
      {Boolean(reviewSelected || locationSelected) && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <IconButton onClick={handleResetFilter}>
            <IconifyIcon icon='mdi:delete-outline' />
          </IconButton>
        </Box>
      )}
      <Box>
        <FormControl>
          <FormLabel sx={{ color: theme.palette.primary.main, fontWeight: 600 }} id='readio-group-review'>
            {t('Review')}
          </FormLabel>
          <RadioGroup
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeFilter(e.target.value, 'review')}
            aria-labelledby='readio-group-review'
            name='radio-reviews-group'
          >
            {listReviewProducts.map(item => (
              <FormControlLabel
                key={item.value}
                value={item.value}
                control={<Radio checked={reviewSelected === item.value} />}
                label={item.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
      <Box sx={{ mt: 2 }}>
        <FormControl>
          <FormLabel sx={{ color: theme.palette.primary.main, fontWeight: 600 }} id='readio-group-location'>
            {t('Location')}
          </FormLabel>
          <RadioGroup
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeFilter(e.target.value, 'location')}
            aria-labelledby='readio-group-location'
            name='radio-locations-group'
          >
            {optionCities.map(item => (
              <FormControlLabel
                key={item.value}
                value={item.value}
                control={<Radio checked={locationSelected === item.value} />}
                label={item.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
    </StyledFilterProduct>
  )
}
export default FilterProduct
