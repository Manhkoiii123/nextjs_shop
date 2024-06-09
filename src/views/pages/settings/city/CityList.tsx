// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** Mui
import { Box, Grid, Typography, useTheme } from '@mui/material'
import { GridColDef, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { deleteCityAsync, deleteMultipleCityAsync, getAllCityAsync } from 'src/stores/city/actions'
import { resetInitialState } from 'src/stores/city'

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

// ** Hooks
import { usePermission } from 'src/hooks/usePermission'

// ** Utils
// import { formatDate } from 'src/utils/date'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { PAGE_SIZE_OPTIONS } from 'src/configs/gridConfig'
import CreateEditCity from 'src/views/pages/settings/city/components/CreateEditCity'
import { OBJECT_TYPE_ERROR_CITY } from 'src/configs/error'
import { formatDate } from 'src/utils/date'

type TProps = {}

const CityListPage: NextPage<TProps> = () => {
  // ** Translate
  const { t } = useTranslation()

  // State

  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })
  const [openDeleteCity, setOpenDeleteCity] = useState({
    open: false,
    id: ''
  })
  const [openDeleteMultipleCity, setOpenDeleteMultipleCity] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')

  const [loading, setLoading] = useState(false)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [page, setPage] = useState(1)
  const [selectedRow, setSelectedRow] = useState<string[]>([])

  // ** Hooks
  const { VIEW, UPDATE, DELETE, CREATE } = usePermission('SETTING.CITY', ['CREATE', 'VIEW', 'UPDATE', 'DELETE'])

  /// ** redux
  const dispatch: AppDispatch = useDispatch()
  const {
    Citys,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    isLoading,
    messageErrorCreateEdit,
    isErrorDelete,
    isSuccessDelete,
    messageErrorDelete,
    typeError,
    isSuccessDeleteMultiple,
    isErrorDeleteMultiple,
    messageErrorDeleteMultiple
  } = useSelector((state: RootState) => state.city)

  // ** theme
  const theme = useTheme()

  // fetch api
  const handleGetListCities = () => {
    const query = { params: { limit: pageSize, page: page, search: searchBy, order: sortBy } }
    dispatch(getAllCityAsync(query))
  }

  // handle
  const handleCloseConfirmDeleteCity = () => {
    setOpenDeleteCity({
      open: false,
      id: ''
    })
  }
  const handleCloseConfirmDeleteMultipleCity = () => {
    setOpenDeleteMultipleCity(false)
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
  }

  const handleDeleteCity = () => {
    dispatch(deleteCityAsync(openDeleteCity.id))
  }

  const handleDeleteMultipleCity = () => {
    dispatch(
      deleteMultipleCityAsync({
        cityIds: selectedRow
      })
    )
  }

  const handleAction = (action: string) => {
    switch (action) {
      case 'delete': {
        setOpenDeleteMultipleCity(true)
        break
      }
    }
  }

  const handleOnChangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('Name'),
      flex: 1,
      minWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.name}</Typography>
      }
    },
    {
      field: 'createdAt',
      headerName: t('Created_date'),
      minWidth: 400,
      maxWidth: 400,
      renderCell: params => {
        const { row } = params

        return <Typography>{formatDate(row?.createdAt, { dateStyle: 'short' })}</Typography>
      }
    },
    {
      field: 'action',
      headerName: t('actions'),
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
                setOpenDeleteCity({
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
  const PaginationComponent = () => {
    const totalPage = Math.ceil(Citys.total / pageSize)

    return (
      <CustomPagination
        onChangePagination={handleOnChangePagination}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        rowLength={Citys.total}
        pageSize={pageSize}
        page={page}
        setPage={setPage}
        setPageSize={setPageSize}
        totalPage={totalPage}
      />
    )
  }

  useEffect(() => {
    handleGetListCities()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchBy, page, pageSize])

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (!openCreateEdit.id) {
        toast.success(t('Create_city_success'))
      } else {
        toast.success(t('Update_city_success'))
      }
      handleGetListCities()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_CITY[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        if (openCreateEdit.id) {
          toast.error(t('Update_city_error'))
        } else {
          toast.error(t('Create_city_error'))
        }
      }
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageErrorCreateEdit, typeError])

  useEffect(() => {
    if (isSuccessDeleteMultiple) {
      toast.success(t('Delete_multiple_city_success'))
      handleGetListCities()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteMultipleCity()
      setSelectedRow([])
    } else if (isErrorDeleteMultiple && messageErrorDeleteMultiple) {
      toast.error(t('Delete_multiple_city_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessDeleteMultiple, isErrorDeleteMultiple, messageErrorDeleteMultiple])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('Delete_city_success'))
      handleGetListCities()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteCity()
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t('Delete_city_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  return (
    <>
      {loading && <Spinner />}
      <ConfirmationDialog
        open={openDeleteCity.open}
        handleClose={handleCloseConfirmDeleteCity}
        handleCancel={handleCloseConfirmDeleteCity}
        handleConfirm={handleDeleteCity}
        title={t('Title_delete_city')}
        description={t('Confirm_delete_city')}
      />
      <ConfirmationDialog
        open={openDeleteMultipleCity}
        handleClose={handleCloseConfirmDeleteMultipleCity}
        handleCancel={handleCloseConfirmDeleteMultipleCity}
        handleConfirm={handleDeleteMultipleCity}
        title={t('Title_delete_multiple_city')}
        description={t('Confirm_delete_multiple_city')}
      />
      <CreateEditCity open={openCreateEdit.open} onClose={handleCloseCreateEdit} idCity={openCreateEdit.id} />
      {isLoading && <Spinner />}
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
              <Box sx={{ width: '200px' }}>
                <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)} />
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
            rows={Citys.data}
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
              pagination: PaginationComponent
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

export default CityListPage
