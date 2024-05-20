/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid, IconButton, Tooltip, useTheme } from '@mui/material'
import { NextPage } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { getAllRolesAsync } from 'src/stores/role/actions'
import { useEffect, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import CustomDataGrid from 'src/components/custom-data-grid'
import CustomPagination from 'src/components/custom-pagination'
import { PAGE_SIZE_OPTIONS } from 'src/configs/gridConfig'

import GridEdit from 'src/components/grid-edit'
import GridDelete from 'src/components/grid-delete'
import GridCreate from 'src/components/grid-create'
import InputSearch from 'src/components/input-search'
import CreateEditRole from 'src/views/pages/system/role/components/CreateEditRole'

type TProps = {}

const RoleListPage: NextPage<TProps> = () => {
  const { roles } = useSelector((state: RootState) => state.role)
  const [openCreateEdit, setOpeCreateEdit] = useState({
    open: false,
    id: ''
  })
  const { t } = useTranslation()
  const theme = useTheme()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  //dùng redux
  const dispatch: AppDispatch = useDispatch()

  const router = useRouter()
  const handleGetListRoles = () => {
    dispatch(getAllRolesAsync({ params: { limit: -1, page: -1 } }))
  }
  useEffect(() => {
    handleGetListRoles()
  }, [])
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
      renderCell: () => {
        return (
          <Box>
            <GridEdit onClick={() => {}}></GridEdit>
            <GridDelete onClick={() => {}}></GridDelete>
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

  return (
    <>
      <CreateEditRole idRole={openCreateEdit.id} open={openCreateEdit.open} onClose={handleCloseCreateEdit} />
      {/* {isLoading && <FallbackSpinner />} */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          padding: '40px'
        }}
      >
        <Grid container>
          <Grid item md={5} xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ width: '300px' }}>
                <InputSearch></InputSearch>
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
            <CustomDataGrid
              rows={roles.data}
              columns={columns}
              pageSizeOptions={[5]}
              // checkboxSelection
              autoHeight
              getRowId={row => row._id} //custom cái id theo _id chứ ko lấy mặc định là id
              disableRowSelectionOnClick
              slots={{
                // cái này để cutom pagination nó là 1 hàm trả về cái comp này
                // viết hàm PaginationComponent trả về cái customPa của ta
                pagination: PaginationComponent
              }}
              disableColumnFilter
              disableColumnMenu
            />
          </Grid>
          <Grid item md={7} xs={12}>
            List permission
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
export default RoleListPage
