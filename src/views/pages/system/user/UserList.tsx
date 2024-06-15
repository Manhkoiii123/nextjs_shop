/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Card,
  Chip,
  ChipProps,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  styled,
  useTheme
} from '@mui/material'
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

import Spinner from 'src/components/spinner'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import { OBJECT_TYPE_ERROR_ROLE } from 'src/configs/role'
import { formatFilter, toFullName } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { usePermission } from 'src/hooks/usePermission'
import { deleteMultipleUserAsync, deleteUserAsync, getAllUserAsync } from 'src/stores/user/actions'
import CreateEditUser from 'src/views/pages/system/user/components/CreateEditUser'
import TableHeader from 'src/components/table-header'
import { PERMISSIONS } from 'src/configs/permissions'
import CustomSelect from 'src/components/custom-select'
import { getAllRoles } from 'src/services/role'
import { OBJECT_STATUS_USER } from 'src/configs/user'
import { resetInitialState } from 'src/stores/user'
import { getAllCity } from 'src/services/city'

type TProps = {}
type TSelectedRow = { id: string; role: { name: string; permissions: string[] } }

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
  const CONSTANT_STATUS_USER = OBJECT_STATUS_USER()
  const [optionRoles, setOptionRoles] = useState<{ label: string; value: string }[]>([])
  const [optionCity, setOptionCity] = useState<{ label: string; value: string }[]>([])
  const fetchRoles = async () => {
    setLoading(true)
    await getAllRoles({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res.data.roles
        if (data) {
          setOptionRoles(data.map((item: { name: string; _id: string }) => ({ label: item.name, value: item._id })))
        }
        setLoading(false)
      })
      .catch(e => setLoading(false))
  }
  const fetchAllCity = async () => {
    setLoading(true)
    await getAllCity({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res.data.cities
        if (data) {
          setOptionCity(data.map((item: { name: string; _id: string }) => ({ label: item.name, value: item._id })))
        }
        setLoading(false)
      })
      .catch(e => setLoading(false))
  }

  useEffect(() => {
    fetchRoles()
    fetchAllCity()
  }, [])
  //page Nào cần check chỉ cần dugnf thế này là ok
  const { CREATE, UPDATE, DELETE, VIEW } = usePermission('SYSTEM.USER', ['CREATE', 'VIEW', 'UPDATE', 'DELETE'])

  const [loading, setLoading] = useState(false)
  const [selectedRow, setSelectedRow] = useState<TSelectedRow[]>([])
  const [roleSelected, setRoleSelected] = useState<string>('')
  const [statusSelected, setStatusSelected] = useState<string>('')
  const [citySelected, setCitySelected] = useState<string[]>([])
  const [filterBy, setFilterBy] = useState<Record<string, string[] | string>>({})
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
    const query = {
      params: { limit: pageSize, page: page, search: searchBy, order: sortBy, ...formatFilter(filterBy) }
    }
    dispatch(getAllUserAsync(query))
  }

  const handleOnChangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }
  const PaginationComponent = () => {
    const totalPage = Math.ceil(users.total / pageSize)

    return (
      <CustomPagination
        onChangePagination={handleOnChangePagination}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        rowLength={users.total}
        pageSize={pageSize}
        page={page}
        setPage={setPage}
        setPageSize={setPageSize}
        totalPage={totalPage}
      />
    )
  }

  const columns: GridColDef[] = [
    {
      field: i18n.language === 'vi' ? 'lastName' : 'firstName',
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
      maxWidth: 200,
      minWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row.email}</Typography>
      }
    },
    {
      field: 'role',
      headerName: t('role'),
      maxWidth: 100,
      minWidth: 100,
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

        return <Typography>{row?.city?.name}</Typography>
      }
    },
    {
      field: 'status',
      headerName: t('status'),
      maxWidth: 150,
      minWidth: 150,
      renderCell: params => {
        const { row } = params

        // return <Typography>{row.city}</Typography>
        return <>{row.status ? <ActiveUserStyled label={t('Active')} /> : <UnactiveUserStyled label={t('Block')} />}</>
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
    if (sortOption) {
      setSortBy(`${sortOption.field} ${sortOption.sort}`)
    } else {
      setSortBy('createdAt asc')
    }
  }
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
    handleGetListUser()
  }, [sortBy, searchBy, i18n.language, page, pageSize, filterBy])
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
    setFilterBy({
      roleId: roleSelected,
      status: statusSelected,
      cityId: citySelected
      // cityId: ''
    })
  }, [roleSelected, statusSelected, citySelected])
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
                <CustomSelect
                  fullWidth
                  multiple
                  onChange={e => {
                    setCitySelected(e.target.value as string[])
                  }}
                  options={optionCity}
                  value={citySelected}
                  placeholder={t('city')}
                />
              </Box>
              <Box sx={{ width: '300px' }}>
                <CustomSelect
                  fullWidth
                  onChange={e => setStatusSelected(e.target.value as string)}
                  options={Object.values(CONSTANT_STATUS_USER)}
                  value={statusSelected}
                  placeholder={t('status')}
                />
              </Box>

              <Box sx={{ width: '300px' }}>
                <CustomSelect
                  fullWidth
                  onChange={e => setRoleSelected(e.target.value as string)}
                  options={optionRoles}
                  value={roleSelected}
                  placeholder={t('Search_your_role')}
                />
              </Box>
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
