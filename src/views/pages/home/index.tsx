// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** Mui
import { Box, Grid, Tab, TabProps, Tabs, Typography, styled, useTheme } from '@mui/material'

import Spinner from 'src/components/spinner'
import CustomPagination from 'src/components/custom-pagination'

// ** Config
import { PAGE_SIZE_OPTIONS } from 'src/configs/gridConfig'
import { formatFilter } from 'src/utils'
import CardProduct from 'src/views/pages/product/components/CardProduct'
import { getAllProductsPublic } from 'src/services/product'
import { TProduct } from 'src/types/product'
import { getAllProductTypes } from 'src/services/product-type'
import InputSearch from 'src/components/input-search'
import FilterProduct from 'src/views/pages/product/components/FilterProduct'

type TProps = {}
const StyledTabs = styled(Tabs)(({ theme }) => ({
  '&.MuiTabs-root': {
    borderBottom: 'none'
  }
}))
const HomePage: NextPage<TProps> = () => {
  // ** Translate
  const { t } = useTranslation()

  // State

  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')
  const [productPublic, setProductPublic] = useState({
    data: [],
    totalPage: 0,
    totalCount: 0
  })
  const [pageSize, setPageSize] = useState(3)
  const [page, setPage] = useState(1)
  const theme = useTheme()
  const [optionTypes, setOptionTypes] = useState<{ label: string; value: string }[]>([])
  const [filterBy, setFilterBy] = useState<Record<string, string[] | string>>({})
  const [productTypeSelected, setProductTypeSelected] = useState('')
  const [productReviewSelected, setProductReviewSelected] = useState('')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setProductTypeSelected(newValue)
  }
  const handleFilterProduct = (review: string) => {
    setProductReviewSelected(review)
  }

  // fetch api
  const handleGetListProducts = async () => {
    setLoading(true)
    const query = {
      params: { limit: pageSize, page: page, search: searchBy, order: sortBy, ...formatFilter(filterBy) }
    }
    await getAllProductsPublic(query).then(res => {
      if (res.data) {
        setLoading(false)
        setProductPublic({
          data: res.data.products,
          totalPage: res.data.totalPage,
          totalCount: res.data.totalCount
        })
      }
    })
  }
  const fetchAllType = async () => {
    setLoading(true)
    await getAllProductTypes({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res.data.productTypes
        if (data) {
          setOptionTypes(data.map((item: { name: string; _id: string }) => ({ label: item.name, value: item._id })))
          //   setProductTypeSelected(data[0]?._id)
        }
        setLoading(false)
      })
      .catch(e => setLoading(false))
  }

  useEffect(() => {
    fetchAllType()
  }, [])

  const handleOnChangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFilterBy({ productType: productTypeSelected, minStar: productReviewSelected })
  }, [productTypeSelected, productReviewSelected])

  useEffect(() => {
    handleGetListProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchBy, page, pageSize, filterBy])

  return (
    <>
      {loading && <Spinner />}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          height: '100%',
          width: '100%',
          borderRadius: '15px',
          gap: '24px'
        }}
      >
        <StyledTabs value={productTypeSelected} onChange={handleChange} aria-label='wrapped label tabs example'>
          {optionTypes.map(item => {
            return <Tab key={item.value} value={item.value} label={item.label} />
          })}
        </StyledTabs>
        <Box
          justifyContent={{
            md: 'flex-end',
            xs: 'center'
          }}
          sx={{ display: 'flex', alignContent: 'center', mt: 4 }}
        >
          <Box sx={{ width: '300px' }}>
            <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)} />
          </Box>
        </Box>
        <Grid container spacing={8}>
          <Grid item md={3} display={{ md: 'flex', xs: 'none' }}>
            <Box sx={{ width: '100%' }}>
              <FilterProduct handleFilterProduct={handleFilterProduct} />
            </Box>
          </Grid>
          <Grid item md={9} xs={12}>
            <Grid container spacing={8}>
              {productPublic?.data.length > 0 ? (
                <>
                  {productPublic.data.map((item: TProduct, index) => {
                    return (
                      <Grid item key={item._id} md={4} sm={6} xs={12}>
                        <CardProduct data={item} />
                      </Grid>
                    )
                  })}
                </>
              ) : (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <Typography>Không có dữ liệu</Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Grid>

        {productPublic?.data.length > 0 && (
          <CustomPagination
            onChangePagination={handleOnChangePagination}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            rowLength={productPublic?.totalCount}
            pageSize={pageSize}
            page={page}
            setPage={setPage}
            setPageSize={setPageSize}
            totalPage={productPublic?.totalPage}
            isHideShow={true}
          />
        )}
      </Box>
    </>
  )
}

export default HomePage
