import React, { Dispatch, Ref, SetStateAction } from 'react'
import Box from '@mui/material/Box'
import { MenuItem, Pagination, PaginationProps, Select, styled } from '@mui/material'
import { useTranslation } from 'react-i18next'

const StylePagination = styled(Pagination)<PaginationProps>(({ theme }) => ({}))

type TProps = {
  page: number // ** current page
  pageSize: number // ** current size row
  rowLength: number
  pageSizeOptions: number[]
  setPage?: Dispatch<SetStateAction<number>>
  setPageSize?: Dispatch<SetStateAction<number>>
  onChangePagination: (page: number, pageSize: number) => void
  totalPage?: number
  isHideShow?: boolean
  isDisplayLines?: boolean
}

const CustomPagination = React.forwardRef((props: TProps, ref: Ref<any>) => {
  const {
    pageSize,
    page,
    rowLength,
    pageSizeOptions,
    totalPage,
    setPage,
    setPageSize,
    onChangePagination,
    isHideShow,
    isDisplayLines = true,
    ...rests
  } = props

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    if (setPage) {
      setPage(value)
    }
  }

  const { t } = useTranslation()

  return (
    <Box
      justifyContent={{
        xs: 'center',
        md: 'space-between'
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isHideShow ? 'center' : 'space-between',
        width: '100%',
        paddingLeft: '4px'
      }}
    >
      {!isHideShow ? (
        <Box>
          {' '}
          <span>{t('Đang hiển thị')} </span>
          <span style={{ fontWeight: 'bold' }}>
            {(page - 1) * pageSize + 1}
            {' - '}
          </span>
          <span style={{ fontWeight: 'bold' }}>{page * pageSize <= rowLength ? page * pageSize : rowLength} </span>
          <span>{t('trên')} </span>
          <span style={{ fontWeight: 'bold' }}>{rowLength}</span>
        </Box>
      ) : (
        <Box></Box>
      )}

      <Box
        flexDirection={{
          xs: 'column',
          md: 'row'
        }}
        sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}
      >
        {isDisplayLines && (
          <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <span>{t('Số dòng hiển thị')}</span>
            <Select
              size='small'
              sx={{
                width: '80px',
                padding: 0,
                '& .MuiSelect-select.MuiSelect-select.MuiSelect-outlined.MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputSizeSmall':
                  { minWidth: 'unset !important', padding: '8.5px 12px 8.5px 24px !important' }
              }}
              value={pageSize}
              onChange={e => onChangePagination(1, +e.target.value)}
            >
              {pageSizeOptions.map(opt => {
                return (
                  <MenuItem value={opt} key={opt}>
                    {opt}
                  </MenuItem>
                )
              })}
            </Select>
          </Box>
        )}
        <StylePagination
          color='primary'
          {...rests}
          count={totalPage}
          onChange={(e, page: number) => {
            onChangePagination(page, pageSize)
          }}
          page={page}
        />
      </Box>
    </Box>
  )
})

export default CustomPagination
