// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** Mui
import { Box, Chip, Grid, Typography, styled, useTheme } from '@mui/material'
import { GridColDef, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'

// ** Components
import GridDelete from 'src/components/grid-delete'
import GridEdit from 'src/components/grid-edit'
import GridCreate from 'src/components/grid-create'
import InputSearch from 'src/components/input-search'
import CustomDataGrid from 'src/components/custom-data-grid'
import Spinner from 'src/components/spinner'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import CustomPagination from 'src/components/custom-pagination'
import TableHeader from 'src/components/table-header'

// ** Others
import toast from 'react-hot-toast'
import { OBJECT_TYPE_ERROR_PRODUCT } from 'src/configs/error'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

// ** Hooks
import { usePermission } from 'src/hooks/usePermission'

// ** Config
import { PAGE_SIZE_OPTIONS } from 'src/configs/gridConfig'

// ** Utils
import { formatDate } from 'src/utils/date'
import { deleteMultipleProductAsync, deleteProductAsync, getAllProductsAsync } from 'src/stores/product/actions'
import CreateEditProduct from 'src/views/pages/manage-product/product/component/CreateEditProduct'
import { resetInitialState } from 'src/stores/product'
import { ChipProps } from '@mui/material'
import CustomSelect from 'src/components/custom-select'
import { OBJECT_STATUS_PRODUCT } from 'src/configs/product'
import { getAllProductTypes } from 'src/services/product-type'
import { formatFilter } from 'src/utils'
import CardProduct from 'src/views/pages/home/components/CardProduct'

type TProps = {}

const HomePage: NextPage<TProps> = () => {
  // ** Translate
  const { t } = useTranslation()

  // State

  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })
  const [openDeleteProduct, setOpenDeleteProduct] = useState({
    open: false,
    id: ''
  })
  const [openDeleteMultipleProduct, setOpenDeleteMultipleProduct] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')

  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [page, setPage] = useState(1)
  const [selectedRow, setSelectedRow] = useState<string[]>([])
  const [imageProduct, setImageProduct] = useState('')
  const [optionTypes, setOptionTypes] = useState<{ label: string; value: string }[]>([])
  const [typeSelected, setTypeSelected] = useState<string[]>([])
  const [statusSelected, setStatusSelected] = useState<string[]>([])
  const [filterBy, setFilterBy] = useState<Record<string, string[] | string>>({})

  // ** theme
  const theme = useTheme()
  const ActiveUserStyled = styled(Chip)<ChipProps>(({ theme }) => ({
    backgroundColor: `rgba(${theme.palette.primary.main},0.08)`,
    color: theme.palette.primary.main,
    fontSize: '14px',
    padding: '8px 4px'
  }))
  const UnactiveUserStyled = styled(Chip)<ChipProps>(({ theme }) => ({
    backgroundColor: `rgba(${theme.palette.error.main},0.08)`,
    color: theme.palette.error.main,
    fontSize: '14px',
    padding: '8px 4px'
  }))

  // fetch api
  const handleGetListProducts = () => {
    const query = {
      params: { limit: pageSize, page: page, search: searchBy, order: sortBy, ...formatFilter(filterBy) }
    }
    // dispatch(getAllProductsAsync(query))
  }

  const handleOnChangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }
  const PaginationComponent = () => {
    // const totalPage = Math.ceil(products.total / pageSize)
    const totalPage = 20

    return (
      <CustomPagination
        onChangePagination={handleOnChangePagination}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        rowLength={10}
        pageSize={pageSize}
        page={page}
        setPage={setPage}
        setPageSize={setPageSize}
        totalPage={totalPage}
      />
    )
  }
  const [loading, setLoading] = useState(false)

  const fetchAllType = async () => {
    setLoading(true)
    await getAllProductTypes({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res.data.productTypes
        if (data) {
          setOptionTypes(data.map((item: { name: string; _id: string }) => ({ label: item.name, value: item._id })))
        }
        setLoading(false)
      })
      .catch(e => setLoading(false))
  }

  useEffect(() => {
    fetchAllType()
  }, [])

  useEffect(() => {
    setFilterBy({ productType: typeSelected, status: statusSelected })
  }, [statusSelected, typeSelected])

  useEffect(() => {
    handleGetListProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchBy, page, pageSize, filterBy])

  return (
    <>
      {loading && <Spinner />}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          padding: '20px',
          height: '100%',
          width: '100%',
          borderRadius: '15px'
        }}
      >
        <CardProduct />
      </Box>
    </>
  )
}

export default HomePage
