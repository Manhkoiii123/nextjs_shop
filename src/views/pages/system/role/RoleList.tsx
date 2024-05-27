/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Card, Grid, IconButton, Tooltip, useTheme } from '@mui/material'
import { NextPage } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { deleteRolesAsync, getAllRolesAsync, updateRolesAsync } from 'src/stores/role/actions'
import { useEffect, useState } from 'react'
import { GridColDef, GridRowClassNameParams, GridSortModel } from '@mui/x-data-grid'
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
import { getDetailRoles } from 'src/services/role'
import { PERMISSIONS } from 'src/configs/permissions'
import { getAllValueObject } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

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
  const [selectedRow, setSelectedRow] = useState({
    id: '',
    name: ''
  })
  const [isDisable, setIsDisbale] = useState(false)

  const [loading, setLoading] = useState(false)
  const [permissionSelected, setPermissionSelected] = useState<string[]>([])
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
  const handleGetDetailRole = async (id: string) => {
    setLoading(true)
    await getDetailRoles(id)
      .then(res => {
        if (res?.data) {
          if (res?.data.permissions.includes(PERMISSIONS.ADMIN)) {
            setIsDisbale(true)
            setPermissionSelected(getAllValueObject(PERMISSIONS, [PERMISSIONS.ADMIN, PERMISSIONS.BASIC]))
          } else if (res?.data.permissions.includes(PERMISSIONS.BASIC)) {
            setIsDisbale(true)
            setPermissionSelected(PERMISSIONS.DASHBOARD)
          } else {
            setIsDisbale(false)
            setPermissionSelected(res.data.permissions || [])
          }
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }
  const handleUpdateRole = (id: string, name: string) => {
    dispatch(updateRolesAsync({ name: name, id: id, permissions: permissionSelected }))
  }

  useEffect(() => {
    if (selectedRow.id) {
      //call cái detail của 1 cái quyền ví dụ admin
      handleGetDetailRole(selectedRow.id)
    }
  }, [selectedRow.id])
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
      if (!openCreateEdit.id) {
        toast.success(t('create-role-success'))
      } else {
        toast.success(t('update-role-success'))
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
      {loading && <Spinner />}
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
          height: '100%',
          width: '100%'
        }}
      >
        <Grid container sx={{ height: '100%', width: '100%' }}>
          <Grid item md={4} xs={12} sx={{ maxHeight: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ width: '300px' }}>
                <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)}></InputSearch>
              </Box>
              <GridCreate
                onClick={() => {
                  setOpeCreateEdit({
                    open: true,
                    id: ''
                  })
                }}
              />
            </Box>
            <Box sx={{ maxHeight: '100%' }}>
              <CustomDataGrid
                sx={{
                  '.row-selected': {
                    color: `${theme.palette.primary.main} !important`,
                    backgroundColor: `${hexToRGBA(theme.palette.primary.main, 0.08)} !important`
                  }
                }}
                rows={roles.data}
                columns={columns}
                pageSizeOptions={[5]}
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
                getRowClassName={(row: GridRowClassNameParams) => {
                  console.log('🚀 ~ row:', row)

                  //khi đó cái nào chọn thì có class này
                  return row.id === selectedRow.id ? 'row-selected' : ''
                }}
                disableColumnMenu
                //onclick để xem bấm vào cột nào
                onRowClick={row => {
                  //bấm vào thì cái tablePer phải thay đổi theo cái quyền đó=> state
                  setOpeCreateEdit({
                    open: false,
                    id: row.id as string
                  })
                  setSelectedRow({ id: row.id as string, name: row?.row?.name })
                }}
              />
            </Box>
          </Grid>
          <Grid
            item
            md={8}
            xs={12}
            sx={{ maxHeight: '100%' }}
            paddingLeft={{ md: '40px', xs: 0 }}
            paddingTop={{ md: '0px', xs: '40px' }}
          >
            {selectedRow?.id && (
              <Box sx={{ height: 'calc(100% - 40px)' }}>
                <TablePermission
                  disabled={isDisable}
                  permissionSelected={permissionSelected}
                  setPermissionSelected={setPermissionSelected}
                />
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    disabled={isDisable}
                    type='submit'
                    variant='contained'
                    sx={{ mt: 3, mb: 2 }}
                    onClick={() => handleUpdateRole(selectedRow.id, selectedRow.name)}
                  >
                    {t('edit')}
                  </Button>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
export default RoleListPage
