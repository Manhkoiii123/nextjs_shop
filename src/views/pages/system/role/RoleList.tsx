/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Card, Grid, IconButton, Tooltip, useTheme } from '@mui/material'
import { NextPage } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { deleteRolesAsync, getAllRolesAsync } from 'src/stores/role/actions'
import { useEffect, useState } from 'react'
import { GridColDef, GridSortModel } from '@mui/x-data-grid'
import CustomDataGrid from 'src/components/custom-data-grid'
import CustomPagination from 'src/components/custom-pagination'
import { PAGE_SIZE_OPTIONS } from 'src/configs/gridConfig'

import GridEdit from 'src/components/grid-edit'
import GridDelete from 'src/components/grid-delete'
import GridCreate from 'src/components/grid-create'
import InputSearch from 'src/components/input-search'
import CreateEditRole from 'src/views/pages/system/role/components/CreateEditRole'

import toast from 'react-hot-toast'
import { resetInitialState } from 'src/stores/role'
import Spinner from 'src/components/spinner'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import { OBJECT_TYPE_ERROR_ROLE } from 'src/configs/role'
import TablePermission from 'src/views/pages/system/role/components/TablePermission'

type TProps = {}

const RoleListPage: NextPage<TProps> = () => {
  const {
    roles,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    isLoading,
    messageErrorCreateEdit,
    isErrorDelete,
    isSuccessDelete,
    messageErrorDelete,
    typeError
  } = useSelector((state: RootState) => state.role)
  const [sortBy, setSortBy] = useState('created asc')
  const [searchBy, setSearchBy] = useState('')
  const [openCreateEdit, setOpeCreateEdit] = useState({
    open: false,
    id: ''
  })
  const { t } = useTranslation()
  const theme = useTheme()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [openDeleteRole, setOpenDeleteRole] = useState({
    open: false,
    id: ''
  })
  //dùng redux
  const dispatch: AppDispatch = useDispatch()

  const router = useRouter()
  const handleGetListRoles = () => {
    dispatch(getAllRolesAsync({ params: { limit: -1, page: -1, search: searchBy, order: sortBy } }))
  }

  const handleOnChangePagination = (page: number, pageSize: number) => {}
  const PaginationComponent = () => {
    return (
      <CustomPagination
        onChangePagination={handleOnChangePagination}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        rowLength={roles.total}
        pageSize={pageSize}
        page={page}
      />
    )
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('name'),
      flex: 1
    },
    {
      field: 'actions',
      headerName: t('actions'),
      minWidth: 150,
      sortable: false,
      align: 'left',
      renderCell: params => {
        const { row } = params

        return (
          <Box>
            {!row.permissions.some((per: string) => ['ADMIN.GRANTED', 'BASIC.PUBLIC'].includes(per)) && (
              <>
                {' '}
                <GridEdit
                  onClick={() => {
                    setOpeCreateEdit({
                      open: true,
                      id: String(params.id)
                      // id: 'yyyy'
                    })
                  }}
                ></GridEdit>
                <GridDelete onClick={() => setOpenDeleteRole({ open: true, id: String(params.id) })} />
              </>
            )}
          </Box>
        )
      }
    }
  ]
  const handleCloseCreateEdit = () => {
    setOpeCreateEdit({
      open: false,
      id: ''
    })
  }

  const handleSort = (sort: GridSortModel) => {
    const sortOption = sort[0]
    setSortBy(`${sortOption.field} ${sortOption.sort}`)
  }

  useEffect(() => {
    handleGetListRoles()
  }, [sortBy, searchBy])
  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (openCreateEdit.id) {
        toast.success(t('update-role-success'))
      } else {
        toast.success(t('create-role-success'))
      }
      handleGetListRoles()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit) {
      //config show lỗi ko lấy từ mess nữa
      const errorConfig = OBJECT_TYPE_ERROR_ROLE[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        if (openCreateEdit.id) {
          toast.error(t('update-role-error'))
        } else {
          toast.error(t('create-role-error'))
        }
      }
      dispatch(resetInitialState())
    }
  }, [isErrorCreateEdit, isSuccessCreateEdit, messageErrorCreateEdit])
  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('delete-role-success'))
      handleGetListRoles()
      dispatch(resetInitialState())
      setOpenDeleteRole({ open: false, id: '' })
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t(messageErrorDelete))
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])
  const handleDeleteRole = () => {
    dispatch(deleteRolesAsync(openDeleteRole.id))
  }

  return (
    <>
      <ConfirmationDialog
        title={t('title_delete_role')}
        description={t('confirm_delete_role')}
        handleConfirm={handleDeleteRole}
        handleCancel={() => setOpenDeleteRole({ open: false, id: '' })}
        open={openDeleteRole.open}
        handleClose={() => setOpenDeleteRole({ open: false, id: '' })}
      />
      <CreateEditRole idRole={openCreateEdit.id} open={openCreateEdit.open} onClose={handleCloseCreateEdit} />
      {isLoading && <Spinner />}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          padding: '20px',
          height: '100%'
        }}
      >
        <Grid spacing={10} container sx={{ height: '100%', width: '100%' }}>
          <Grid item md={4} xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ width: '300px' }}>
                <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)}></InputSearch>
              </Box>
              <GridCreate
                onClick={() =>
                  setOpeCreateEdit({
                    open: true,
                    id: ''
                  })
                }
              />
            </Box>
            <Box sx={{ maxHeight: '100%' }}>
              <CustomDataGrid
                rows={roles.data}
                columns={columns}
                pageSizeOptions={[5]}
                // checkboxSelection
                autoHeight
                getRowId={row => row._id} //custom cái id theo _id chứ ko lấy mặc định là id
                disableRowSelectionOnClick
                hideFooter
                //sorting trong MUI
                sortingOrder={['desc', 'asc']}
                sortingMode='server'
                onSortModelChange={handleSort}
                slots={{
                  // cái này để cutom pagination nó là 1 hàm trả về cái comp này
                  // viết hàm PaginationComponent trả về cái customPa của ta
                  pagination: PaginationComponent
                }}
                disableColumnFilter
                disableColumnMenu
              />
            </Box>
          </Grid>
          <Grid item md={8} xs={12} sx={{ maxHeight: '100%' }}>
            <TablePermission />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
export default RoleListPage
