import { useTheme } from '@mui/material'
import { Box, Checkbox, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import CustomDataGrid from 'src/components/custom-data-grid'
import Spinner from 'src/components/spinner'
import { LIST_DATA_PERMISSIONS } from 'src/configs/permissions'

interface TTablePermission {}
const TablePermission = (props: TTablePermission) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('name'),
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Typography
            sx={{
              color: row?.isParent ? theme.palette.primary.main : `rgba${theme.palette.customColors.main},0.78`,
              paddingLeft: row?.isParent ? '0' : '40px'
            }}
          >
            {t(row?.name)}
          </Typography>
        )
      }
    },
    {
      field: 'all',
      headerName: t('All'),
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <>{row?.isParent && <Checkbox />}</>
      }
    },
    {
      field: 'view',
      headerName: t('View'),
      minWidth: 100,
      maxWidth: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        // console.log('🚀 ~ TablePermission ~ params:', params) => ra laf thayas
        const { row } = params
        //cl ra thì cái row chính là các cái item bên per định nghĩa kia
        // thấy cái nào ko có cái isHideView mới hiện cái đấy lên để được chỉnh sửa quyền xem hay ko

        return <>{!row?.isHideView && !row?.isParent && <Checkbox value={row?.view} />}</>
      }
    },
    {
      field: 'create',
      headerName: t('Create'),
      minWidth: 100,
      maxWidth: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <>{!row?.isHideCreate && !row?.isParent && <Checkbox value={row?.create} />}</>
      }
    },
    {
      field: 'delete',
      headerName: t('Delete'),
      minWidth: 100,
      maxWidth: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <>{!row?.isHideDelete && !row?.isParent && <Checkbox value={row?.delete} />}</>
      }
    },
    {
      field: 'update',
      headerName: t('Update'),
      minWidth: 120,
      maxWidth: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <>{!row?.isHideUpdate && !row?.isParent && <Checkbox value={row?.update} />}</>
      }
    }
  ]

  return (
    <>
      <CustomDataGrid
        rows={LIST_DATA_PERMISSIONS}
        columns={columns}
        pageSizeOptions={[5]}
        autoHeight
        disableRowSelectionOnClick
        hideFooter
        disableColumnFilter
        disableColumnMenu
      />
    </>
  )
}
export default TablePermission
