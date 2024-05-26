import { Button, Card, useTheme } from '@mui/material'
import { Box, Checkbox, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CustomDataGrid from 'src/components/custom-data-grid'
import { LIST_DATA_PERMISSIONS, PERMISSIONS } from 'src/configs/permissions'

interface TTablePermission {
  setPermissionSelected: Dispatch<SetStateAction<string[]>>
  permissionSelected: string[]
}
const TablePermission = (props: TTablePermission) => {
  const { permissionSelected, setPermissionSelected } = props
  const theme = useTheme()
  const { t } = useTranslation()
  const handleGetValuePermission = (parentValue: string, value: string, mode: string) => {
    try {
      return PERMISSIONS[parentValue][value][mode] //tương tự PẺ.pare.value.mode (mode là cái create edit view....)
    } catch (error) {
      return ''
    }
  }
  const handleOnChangeCheckBox = (value: string) => {
    const isChecked = permissionSelected.find(item => item === value)
    if (isChecked) {
      const filtered = permissionSelected.filter(item => item !== value)
      setPermissionSelected(filtered)
    } else {
      setPermissionSelected([...permissionSelected, value])
    }
  }
  const columns: GridColDef[] = [
    {
      field: 'all',
      headerName: t('All'),
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <>
            {' '}
            <Checkbox />
          </>
        )
      }
    },
    {
      field: 'name',
      headerName: t('name'),
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        //parent thì dựa vào cái isPa = true
        // nếu mà là parent thì phải lấy được hết các cái crud của các cái con của nó để khi mà check all ở cái parent thì check all các cái con của nó => ok
        //khi đó bên cái LIST_DATA_PERMISSIONS các cái cha sẽ có thêm cái value nữa để xem ấn vào cái nào

        return (
          <Typography
            sx={{
              color: row?.isParent ? theme.palette.primary.main : `rgba${theme.palette.customColors.main},0.78`,
              paddingLeft: row?.isParent ? '0' : '40px',
              textTransform: row?.isParent ? 'uppercase' : ''
            }}
          >
            {t(row?.name)}
          </Typography>
        )
      }
    },

    {
      field: 'view',
      headerName: t('view'),
      minWidth: 100,
      maxWidth: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        // console.log('🚀 ~ TablePermission ~ params:', params) => ra laf thayas
        const { row } = params
        const value = handleGetValuePermission(row.parentValue, row.value, 'VIEW')
        // console.log('🚀 ~ TablePermission ~ row:', {
        //   row,
        //   PERMISSIONS,
        //   value: PERMISSIONS[row.parentValue]?.[row.value] lấy được cái create edit delete view cái nào ko có thì là undefind
        // })

        //cl ra thì cái row chính là các cái item bên per định nghĩa kia
        // thấy cái nào ko có cái isHideView mới hiện cái đấy lên để được chỉnh sửa quyền xem hay ko

        return (
          <>
            {!row?.isHideView && !row?.isParent && (
              <Checkbox
                value={value}
                checked={permissionSelected.includes(value)}
                onChange={e => handleOnChangeCheckBox(e.target.value)}
              />
            )}
          </>
        )
      }
    },
    {
      field: 'create',
      headerName: t('create'),
      minWidth: 100,
      maxWidth: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        const value = handleGetValuePermission(row.parentValue, row.value, 'CREATE')

        return (
          <>
            {!row?.isHideCreate && !row?.isParent && (
              <Checkbox
                value={value}
                onChange={e => handleOnChangeCheckBox(e.target.value)}
                checked={permissionSelected.includes(value)}
              />
            )}
          </>
        )
      }
    },
    {
      field: 'delete',
      headerName: t('delete'),
      minWidth: 100,
      maxWidth: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        const value = handleGetValuePermission(row.parentValue, row.value, 'DELETE')

        return (
          <>
            {!row?.isHideDelete && !row?.isParent && (
              <Checkbox
                value={value}
                onChange={e => handleOnChangeCheckBox(e.target.value)}
                checked={permissionSelected.includes(value)}
              />
            )}
          </>
        )
      }
    },
    {
      field: 'update',
      headerName: t('edit'),
      minWidth: 120,
      maxWidth: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        const value = handleGetValuePermission(row.parentValue, row.value, 'UPDATE')

        return (
          <>
            {!row?.isHideUpdate && !row?.isParent && (
              <Checkbox
                value={value}
                onChange={e => handleOnChangeCheckBox(e.target.value)}
                checked={permissionSelected.includes(value)}
              />
            )}
          </>
        )
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
