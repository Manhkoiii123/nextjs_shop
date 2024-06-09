/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Card, Grid, IconButton, Tooltip, Typography, useTheme } from '@mui/material'
import { NextPage } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useEffect, useMemo, useState } from 'react'
import { GridColDef, GridRowClassNameParams, GridRowId, GridSortModel } from '@mui/x-data-grid'
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
import { deleteMultipleUserAsync, deleteUserAsync, getAllUserAsync } from 'src/stores/user/actions'
import { deleteMultipleUser, getDetailUser } from 'src/services/user'
import CreateEditUser from 'src/views/pages/system/user/components/CreateEditUser'
import TableHeader from 'src/components/table-header'
import { PERMISSIONS } from 'src/configs/permissions'

type TProps = {}
type TSelectedRow = { id: string; role: { name: string; permissions: string[] } }

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
    typeError,
    isSuccessDeleteMultiple,
    isErrorDeleteMultiple,
    messageErrorDeleteMultiple
  } = useSelector((state: RootState) => state.user)
  const [sortBy, setSortBy] = useState('createdAt asc')
  const [searchBy, setSearchBy] = useState('')
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })
  //page Nào cần check chỉ cần dugnf thế này là ok
  const { CREATE, UPDATE, DELETE, VIEW } = usePermission('SYSTEM.USER', ['CREATE', 'VIEW', 'UPDATE', 'DELETE'])

  const [loading, setLoading] = useState(false)
  const [selectedRow, setSelectedRow] = useState<TSelectedRow[]>([])
  const [avatar, setAvatar] = useState('')
  const { t } = useTranslation()
  const theme = useTheme()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [openDeleteUser, setOpenDeleteUser] = useState({
    open: false,
    id: ''
  })
  const [openDeleteUserMultiple, setOpenDeleteUserMultiple] = useState(false)
  //dùng redux
  const dispatch: AppDispatch = useDispatch()

  const handleAction = (action: string) => {
    switch (action) {
      case 'delete':
        setOpenDeleteUserMultiple(true)
        break

      default:
        break
    }
  }
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
      minWidth: 150,
      renderCell: params => {
        const { row } = params
        const fullname = toFullName(row?.lastName || '', row?.middleName || '', row?.firstName || '', i18n.language)

        return <Typography>{fullname}</Typography>
      }
    },
    {
      field: 'email',
      headerName: t('email'),
      maxWidth: 300,
      minWidth: 300,
      renderCell: params => {
        const { row } = params

        return <Typography>{row.email}</Typography>
        // return <Typography>a</Typography>
      }
    },
    {
      field: 'role',
      headerName: t('role'),
      maxWidth: 150,
      minWidth: 150,
      renderCell: params => {
        const { row } = params

        return <Typography>{row.role?.name}</Typography>
      }
    },
    {
      field: 'phoneNumber',
      headerName: t('phoneNumber'),
      maxWidth: 150,
      minWidth: 150,
      renderCell: params => {
        const { row } = params

        return <Typography>{row.phoneNumber}</Typography>
      }
    },
    {
      field: 'city',
      headerName: t('city'),
      maxWidth: 150,
      minWidth: 150,
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
                  setOpenCreateEdit({
                    open: true,
                    id: String(params.id)
                  })
                }}
              />
              <GridDelete disabled={!DELETE} onClick={() => setOpenDeleteUser({ open: true, id: String(params.id) })} />
            </>
          </Box>
        )
      }
    }
  ]
  const handleCloseCreateEdit = () => {
    setOpenCreateEdit({
      open: false,
      id: ''
    })
    setAvatar('')
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
      setAvatar('')
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit) {
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
  const handleDeleteUser = () => {
    dispatch(deleteUserAsync(openDeleteUser.id))
  }
  const handleDeleteUserMultiple = () => {
    dispatch(
      deleteMultipleUserAsync({
        userIds: selectedRow.map(item => item.id)
      })
    )
  }
  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('delete-user-success'))
      handleGetListUser()
      dispatch(resetInitialState())
      setOpenDeleteUser({ open: false, id: '' })
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t('delete-user-error'))
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])
  useEffect(() => {
    if (isSuccessDeleteMultiple) {
      toast.success(t('delete-user-multiple-success'))
      handleGetListUser()
      dispatch(resetInitialState())
      setOpenDeleteUserMultiple(false)
      setSelectedRow([])
    } else if (isErrorDeleteMultiple && messageErrorDeleteMultiple) {
      toast.error(t('delete-user-multiple-error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessDeleteMultiple, isErrorDeleteMultiple, messageErrorDeleteMultiple])

  const memoDisableDeleteUser = useMemo(() => {
    return selectedRow.some(item => item?.role?.permissions?.includes(PERMISSIONS.ADMIN))
  }, [selectedRow])

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
      <ConfirmationDialog
        title={t('title_delete_user_multiple')}
        description={t('confirm_delete_user_multiple')}
        handleConfirm={handleDeleteUserMultiple}
        handleCancel={() => setOpenDeleteUserMultiple(false)}
        open={openDeleteUserMultiple}
        handleClose={() => setOpenDeleteUserMultiple(false)}
      />
      <CreateEditUser
        idUser={openCreateEdit.id}
        open={openCreateEdit.open}
        onClose={handleCloseCreateEdit}
        avatar={avatar}
        setAvatar={setAvatar}
      />
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
          {!selectedRow?.length && (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 4, width: '100%', gap: 4 }}
            >
              <Box sx={{ width: '300px' }}>
                <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)}></InputSearch>
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
              handleAction={handleAction}
              tableAction={[{ label: t('Xóa'), value: 'delete', disable: memoDisableDeleteUser }]}
              numRowSelect={selectedRow?.length}
              onClear={() => setSelectedRow([])}
            />
          )}
          <CustomDataGrid
            sx={{
              '.row-selected': {
                color: `${theme.palette.primary.main} !important`,
                backgroundColor: `${hexToRGBA(theme.palette.primary.main, 0.08)} !important`
              }
            }}
            checkboxSelection
            rows={users.data}
            columns={columns}
            pageSizeOptions={[5]}
            autoHeight
            getRowId={row => row._id} //custom cái id theo _id chứ ko lấy mặc định là id
            disableRowSelectionOnClick
            sortingOrder={['desc', 'asc']}
            sortingMode='server'
            onSortModelChange={handleSort}
            slots={{
              pagination: PaginationComponent
            }}
            disableColumnFilter
            disableColumnMenu
            onRowSelectionModelChange={row => {
              // lấy ra thông ting người dùng ddang được chọn để disable của xóa admin đi

              const formatData: any = row.map(id => {
                const findRow: any = users.data.find((item: any) => item._id === id)
                if (findRow) return { id: findRow._id, role: findRow.role }
              })

              setSelectedRow(formatData)
            }}
            rowSelectionModel={selectedRow?.map(item => item.id)}
          />
        </Grid>
      </Box>
    </>
  )
}
export default UserListPage
