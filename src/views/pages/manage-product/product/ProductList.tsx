// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useRef, useState } from 'react'
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
import { formatFilter, formatNumberToLocal } from 'src/utils'
import { getCountProductStatus } from 'src/services/report'
import CardCountProduct from 'src/views/pages/manage-product/product/component/CardCountProduct'

type TProps = {}

const ProductList: NextPage<TProps> = () => {
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
  const isRendered = useRef<boolean>(false)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [page, setPage] = useState(1)
  const [selectedRow, setSelectedRow] = useState<string[]>([])
  const [imageProduct, setImageProduct] = useState('')
  const [optionTypes, setOptionTypes] = useState<{ label: string; value: string }[]>([])
  const [typeSelected, setTypeSelected] = useState<string[]>([])
  const [statusSelected, setStatusSelected] = useState<string[]>([])
  const [filterBy, setFilterBy] = useState<Record<string, string[] | string>>({})
  // ** Hooks
  const { VIEW, UPDATE, DELETE, CREATE } = usePermission('MANAGE_PRODUCT.PRODUCT_TYPE', [
    'CREATE',
    'VIEW',
    'UPDATE',
    'DELETE'
  ])

  /// ** redux
  const dispatch: AppDispatch = useDispatch()
  const CONSTANT_STATUS_PRODUCT = OBJECT_STATUS_PRODUCT()
  const {
    products,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    isLoading,
    messageErrorCreateEdit,
    isErrorDelete,
    isSuccessDelete,
    messageErrorDelete,
    typeError,
    isSuccessMultipleDelete,
    isErrorMultipleDelete,
    messageErrorMultipleDelete
  } = useSelector((state: RootState) => state.product)
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
    dispatch(getAllProductsAsync(query))
  }

  // handle
  const handleCloseConfirmDeleteProduct = () => {
    setOpenDeleteProduct({
      open: false,
      id: ''
    })
  }

  const handleCloseConfirmDeleteMultipleProduct = () => {
    setOpenDeleteMultipleProduct(false)
  }

  const handleSort = (sort: GridSortModel) => {
    const sortOption = sort[0]
    if (sortOption) {
      setSortBy(`${sortOption.field} ${sortOption.sort}`)
    } else {
      setSortBy('createdAt desc')
    }
  }

  const handleCloseCreateEdit = () => {
    setOpenCreateEdit({
      open: false,
      id: ''
    })
    setImageProduct('')
  }

  const handleDeleteProduct = () => {
    dispatch(deleteProductAsync(openDeleteProduct.id))
  }

  const handleDeleteMultipleProduct = () => {
    dispatch(
      deleteMultipleProductAsync({
        productIds: selectedRow
      })
    )
  }

  const handleAction = (action: string) => {
    switch (action) {
      case 'delete': {
        setOpenDeleteMultipleProduct(true)
        break
      }
    }
  }

  const handleOnChangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }
  const PaginationComponent = () => {
    const totalPage = Math.ceil(products.total / pageSize)

    return (
      <CustomPagination
        onChangePagination={handleOnChangePagination}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        rowLength={products.total}
        pageSize={pageSize}
        page={page}
        setPage={setPage}
        setPageSize={setPageSize}
        totalPage={totalPage}
      />
    )
  }
  const [loading, setLoading] = useState(false)
  const [countProductStatus, setCountProductStatus] = useState<{
    data: Record<number, number>
    total: number
  }>({} as any)

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
  const fetchAllCountProductStatus = async () => {
    setLoading(true)
    await getCountProductStatus()
      .then(res => {
        const data = res?.data
        setLoading(false)
        setCountProductStatus({
          data: data?.data,
          total: data?.total
        })
      })
      .catch(e => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (isRendered.current) {
      setFilterBy({ productType: typeSelected, status: statusSelected })
    }
  }, [typeSelected, statusSelected])
  useEffect(() => {
    fetchAllType()
    fetchAllCountProductStatus()
    isRendered.current = true
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('product_Name'),
      flex: 1,
      minWidth: 200,
      maxWidth: 200,
      width: 200,
      renderCell: params => {
        const { row } = params

        return (
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%'
            }}
          >
            {row?.name}
          </Typography>
        )
      }
    },
    {
      field: 'type',
      headerName: t('Type'),
      flex: 1,
      minWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.type.name}</Typography>
      }
    },
    {
      field: 'slug',
      headerName: t('Slug'),
      minWidth: 200,
      maxWidth: 200,
      width: 200,
      renderCell: params => {
        const { row } = params

        return (
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%'
            }}
          >
            {row?.slug}
          </Typography>
        )
      }
    },
    {
      field: 'price',
      headerName: t('Price'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{formatNumberToLocal(row?.price)}</Typography>
      }
    },
    {
      field: 'countInStock',
      headerName: t('Count_in_stock'),
      minWidth: 180,
      maxWidth: 180,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.countInStock}</Typography>
      }
    },
    {
      field: 'status',
      headerName: t('status'),
      maxWidth: 150,
      minWidth: 150,
      renderCell: params => {
        const { row } = params

        return (
          <>{row.status ? <ActiveUserStyled label={t('Public')} /> : <UnactiveUserStyled label={t('Private')} />}</>
        )
      }
    },
    {
      field: 'action',
      headerName: t('Actions'),
      minWidth: 150,
      sortable: false,
      align: 'left',
      renderCell: params => {
        const { row } = params

        return (
          <>
            <GridEdit
              disabled={!UPDATE}
              onClick={() =>
                setOpenCreateEdit({
                  open: true,
                  id: String(params.id)
                })
              }
            />
            <GridDelete
              disabled={!DELETE}
              onClick={() =>
                setOpenDeleteProduct({
                  open: true,
                  id: String(params.id)
                })
              }
            />
          </>
        )
      }
    }
  ]

  useEffect(() => {
    if (isRendered.current) {
      handleGetListProducts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchBy, page, pageSize, filterBy])

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (!openCreateEdit.id) {
        toast.success(t('Create_product_success'))
      } else {
        toast.success(t('Update_product_success'))
      }
      handleGetListProducts()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_PRODUCT[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        if (openCreateEdit.id) {
          toast.error(t('Update_product_error'))
        } else {
          toast.error(t('Create_product_error'))
        }
      }
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageErrorCreateEdit, typeError])

  useEffect(() => {
    if (isSuccessMultipleDelete) {
      toast.success(t('Delete_multiple_product_success'))
      handleGetListProducts()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteMultipleProduct()
      setSelectedRow([])
    } else if (isErrorMultipleDelete && messageErrorMultipleDelete) {
      toast.error(t('Delete_multiple_product_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessMultipleDelete, isErrorMultipleDelete, messageErrorMultipleDelete])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('Delete_product_success'))
      handleGetListProducts()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteProduct()
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t('Delete_product_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  const dataListProductStatus = [
    {
      icon: 'la:product-hunt',
      status: '2'
    },
    {
      icon: 'material-symbols-light:public-off',
      status: '0'
    },
    {
      status: '1',
      icon: 'material-symbols-light:public'
    }
  ]

  return (
    <>
      <ConfirmationDialog
        open={openDeleteProduct.open}
        handleClose={handleCloseConfirmDeleteProduct}
        handleCancel={handleCloseConfirmDeleteProduct}
        handleConfirm={handleDeleteProduct}
        title={t('Title_delete_product')}
        description={t('Confirm_delete_product')}
      />
      <ConfirmationDialog
        open={openDeleteMultipleProduct}
        handleClose={handleCloseConfirmDeleteMultipleProduct}
        handleCancel={handleCloseConfirmDeleteMultipleProduct}
        handleConfirm={handleDeleteMultipleProduct}
        title={t('Title_delete_multiple_product')}
        description={t('Confirm_delete_multiple_product')}
      />
      <CreateEditProduct
        imageProduct={imageProduct}
        setImageProduct={setImageProduct}
        open={openCreateEdit.open}
        onClose={handleCloseCreateEdit}
        idProduct={openCreateEdit.id}
        optionTypes={optionTypes}
      />
      {isLoading && <Spinner />}
      <Box sx={{ backgroundColor: 'inherit', width: '100%', mb: 4 }}>
        <Grid container spacing={6} sx={{ height: '100%' }}>
          {dataListProductStatus?.map((item: any, index: number) => {
            return (
              <Grid item xs={12} md={4} sm={6} key={index}>
                <CardCountProduct {...item} countProductStatus={countProductStatus} />
              </Grid>
            )
          })}
        </Grid>
      </Box>
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
        <Grid container sx={{ height: '100%', width: '100%' }}>
          {!selectedRow?.length && (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, mb: 4, width: '100%' }}
            >
              <Box sx={{ width: '300px' }}>
                <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)} />
              </Box>
              <Box sx={{ width: '300px' }}>
                <CustomSelect
                  fullWidth
                  multiple
                  onChange={e => {
                    setTypeSelected(e.target.value as string[])
                  }}
                  options={optionTypes}
                  value={typeSelected}
                  placeholder={t('Type')}
                />
              </Box>
              <Box sx={{ width: '300px' }}>
                <CustomSelect
                  fullWidth
                  onChange={e => setStatusSelected(e.target.value as string[])}
                  options={Object.values(CONSTANT_STATUS_PRODUCT)}
                  value={statusSelected}
                  placeholder={t('status')}
                />
              </Box>
              <GridCreate
                disabled={!CREATE}
                onClick={() => {
                  setOpenCreateEdit({
                    open: true,
                    id: ''
                  })
                }}
              />
            </Box>
          )}
          {selectedRow?.length > 0 && (
            <TableHeader
              numRowSelect={selectedRow?.length}
              onClear={() => setSelectedRow([])}
              handleAction={handleAction}
              tableAction={[{ label: t('Xóa'), value: 'delete', disable: !DELETE }]}
            />
          )}
          <CustomDataGrid
            rows={products.data}
            columns={columns}
            autoHeight
            sx={{
              '.row-selected': {
                backgroundColor: `${hexToRGBA(theme.palette.primary.main, 0.08)} !important`,
                color: `${theme.palette.primary.main} !important`
              }
            }}
            checkboxSelection
            sortingOrder={['desc', 'asc']}
            sortingMode='server'
            onSortModelChange={handleSort}
            getRowId={row => row._id}
            disableRowSelectionOnClick
            slots={{
              pagination: products.data.length > 0 ? PaginationComponent : null
            }}
            rowSelectionModel={selectedRow}
            onRowSelectionModelChange={(row: GridRowSelectionModel) => {
              setSelectedRow(row as string[])
            }}
            disableColumnFilter
          />
        </Grid>
      </Box>
    </>
  )
}

export default ProductList
