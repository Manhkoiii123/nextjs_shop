/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Card, Grid, IconButton, Tooltip, Typography, useTheme } from '@mui/material'
import { NextPage } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { GridColDef, GridRowClassNameParams, GridSortModel } from '@mui/x-data-grid'
import CustomDataGrid from 'src/components/custom-data-grid'
import CustomPagination from 'src/components/custom-pagination'
import { PAGE_SIZE_OPTIONS } from 'src/configs/gridConfig'

import GridEdit from 'src/components/grid-edit'
import GridDelete from 'src/components/grid-delete'
import GridCreate from 'src/components/grid-create'
import InputSearch from 'src/components/input-search'

import toast from 'react-hot-toast'
import { resetInitialState } from 'src/stores/role'
import Spinner from 'src/components/spinner'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import { OBJECT_TYPE_ERROR_ROLE } from 'src/configs/role'
import { toFullName } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { usePermission } from 'src/hooks/usePermission'
import { deleteUserAsync, getAllUserAsync } from 'src/stores/user/actions'
import { getDetailUser } from 'src/services/user'

type TProps = {}

const UserListPage: NextPage<TProps> = () => {
  const { i18n } = useTranslation()
  const {
    users,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    isLoading,
    messageErrorCreateEdit,
    isErrorDelete,
    isSuccessDelete,
    messageErrorDelete,
    typeError
  } = useSelector((state: RootState) => state.user)
  console.log('users', users)
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
  //page Nào cần check chỉ cần dugnf thế này là ok
  const { CREATE, UPDATE, DELETE, VIEW } = usePermission('SYSTEM.USER', ['CREATE', 'VIEW', 'UPDATE', 'DELETE'])

  const [loading, setLoading] = useState(false)
  const [permissionSelected, setPermissionSelected] = useState<string[]>([])
  const { t } = useTranslation()
  const theme = useTheme()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [openDeleteUser, setOpenDeleteUser] = useState({
    open: false,
    id: ''
  })
  //dùng redux
  const dispatch: AppDispatch = useDispatch()
  const handleGetDetailUser = async (id: string) => {
    setLoading(true)
    await getDetailUser(id)
      .then(res => {
        if (res?.data) {
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (selectedRow.id) {
      //call cái detail của 1 cái quyền ví dụ admin
      handleGetDetailUser(selectedRow.id)
    }
  }, [selectedRow.id])
  const router = useRouter()
  const handleGetListUser = () => {
    dispatch(getAllUserAsync({ params: { limit: -1, page: -1, search: searchBy, order: sortBy } }))
  }

  const handleOnChangePagination = (page: number, pageSize: number) => {}
  const PaginationComponent = () => {
    return (
      <CustomPagination
        onChangePagination={handleOnChangePagination}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        rowLength={users.total}
        pageSize={pageSize}
        page={page}
      />
    )
  }

  const columns: GridColDef[] = [
    {
      field: 'fullName',
      headerName: t('FullName'),
      flex: 1,
      minWidth: 200,
      renderCell: params => {
        const { row } = params
        const fullname = toFullName(row?.lastName || '', row?.middleName || '', row?.firstName || '', i18n.language)

        return <Typography>{fullname}</Typography>
      }
    },
    {
      field: 'email',
      headerName: t('email'),
      maxWidth: 200,
      minWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row.email}</Typography>
        // return <Typography>a</Typography>
      }
    },
    {
      field: 'role',
      headerName: t('role'),
      maxWidth: 200,
      minWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row.role?.name}</Typography>
      }
    },
    {
      field: 'phoneNumber',
      headerName: t('phoneNumber'),
      maxWidth: 200,
      minWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row.phoneNumber}</Typography>
      }
    },
    {
      field: 'city',
      headerName: t('city'),
      maxWidth: 200,
      minWidth: 200,
      renderCell: params => {
        const { row } = params

        // return <Typography>{row.city}</Typography>
        return <Typography>a</Typography>
      }
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
            <>
              <GridEdit
                disabled={!UPDATE}
                onClick={() => {
                  setOpeCreateEdit({
                    open: true,
                    id: String(params.id)
                  })
                }}
              ></GridEdit>
              <GridDelete disabled={!DELETE} onClick={() => setOpenDeleteUser({ open: true, id: String(params.id) })} />
            </>
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
    handleGetListUser()
  }, [sortBy, searchBy])
  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (!openCreateEdit.id) {
        toast.success(t('create-user-success'))
      } else {
        toast.success(t('update-user-success'))
      }
      handleGetListUser()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit) {
      //config show lỗi ko lấy từ mess nữa
      const errorConfig = OBJECT_TYPE_ERROR_ROLE[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        if (openCreateEdit.id) {
          toast.error(t('update-user-error'))
        } else {
          toast.error(t('create-user-error'))
        }
      }
      dispatch(resetInitialState())
    }
  }, [isErrorCreateEdit, isSuccessCreateEdit, messageErrorCreateEdit])
  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('delete-user-success'))
      handleGetListUser()
      dispatch(resetInitialState())
      setOpenDeleteUser({ open: false, id: '' })
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t(messageErrorDelete))
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])
  const handleDeleteUser = () => {
    dispatch(deleteUserAsync(openDeleteUser.id))
  }

  return (
    <>
      {loading && <Spinner />}
      <ConfirmationDialog
        title={t('title_delete_user')}
        description={t('confirm_delete_user')}
        handleConfirm={handleDeleteUser}
        handleCancel={() => setOpenDeleteUser({ open: false, id: '' })}
        open={openDeleteUser.open}
        handleClose={() => setOpenDeleteUser({ open: false, id: '' })}
      />
      {/* <CreateEditUser idUser={openCreateEdit.id} open={openCreateEdit.open} onClose={handleCloseCreateEdit} /> */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 4, width: '100%', gap: 4 }}>
            <Box sx={{ width: '300px' }}>
              <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)}></InputSearch>
            </Box>
            <GridCreate
              disabled={!CREATE}
              onClick={() => {
                setOpeCreateEdit({
                  open: true,
                  id: ''
                })
              }}
            />
          </Box>
          <CustomDataGrid
            sx={{
              '.row-selected': {
                color: `${theme.palette.primary.main} !important`,
                backgroundColor: `${hexToRGBA(theme.palette.primary.main, 0.08)} !important`
              }
            }}
            rows={users.data}
            columns={columns}
            pageSizeOptions={[5]}
            autoHeight
            getRowId={row => row._id} //custom cái id theo _id chứ ko lấy mặc định là id
            disableRowSelectionOnClick
            // hideFooter
            sortingOrder={['desc', 'asc']}
            sortingMode='server'
            onSortModelChange={handleSort}
            slots={{
              pagination: PaginationComponent
            }}
            disableColumnFilter
            getRowClassName={(row: GridRowClassNameParams) => {
              return row.id === selectedRow.id ? 'row-selected' : ''
            }}
            disableColumnMenu
            onRowClick={row => {
              setOpeCreateEdit({
                open: false,
                id: row.id as string
              })
              setSelectedRow({ id: row.id as string, name: row?.row?.name })
            }}
          />
        </Grid>
      </Box>
    </>
  )
}
export default UserListPage
