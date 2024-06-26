import React, { ChangeEvent } from 'react'
import { styled, useTheme } from '@mui/material/styles'

import { Box, BoxProps, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { FILTER_REVIEW_PRODUCT } from 'src/configs/product'
import { FormLabel } from '@mui/material'

interface TFilterProduct {
  handleFilterProduct: (value: string) => void
}

const StyledFilterProduct = styled(Box)<BoxProps>(({ theme }) => ({
  padding: '10px',
  border: `1px solid rgba(${theme.palette.customColors.main},0.3)`,
  borderRadius: '16px'
}))

const FilterProduct = (props: TFilterProduct) => {
  const { handleFilterProduct } = props
  const { t } = useTranslation()
  const theme = useTheme()
  const listReviewProducts = FILTER_REVIEW_PRODUCT()
  const onChangeFilterReview = (e: ChangeEvent<HTMLInputElement>) => {
    handleFilterProduct(e.target.value)
  }

  return (
    <StyledFilterProduct sx={{ width: '100%' }}>
      <FormControl>
        <FormLabel sx={{ color: theme.palette.primary.main, fontWeight: 600 }} id='readio-group-review'>
          {t('Review')}
        </FormLabel>
        <RadioGroup onChange={onChangeFilterReview} aria-labelledby='readio-group-review' name='radio-buttons-group'>
          {listReviewProducts.map(item => (
            <FormControlLabel key={item.value} value={item.value} control={<Radio />} label={item.label} />
          ))}
        </RadioGroup>
      </FormControl>
    </StyledFilterProduct>
  )
}
export default FilterProduct
