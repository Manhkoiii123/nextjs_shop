import { useTheme } from '@mui/material'
import { Checkbox, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CustomDataGrid from 'src/components/custom-data-grid'
import { LIST_DATA_PERMISSIONS, PERMISSIONS } from 'src/configs/permissions'
import { getAllValueObject } from 'src/utils'

interface TTablePermission {
  setPermissionSelected: Dispatch<SetStateAction<string[]>>
  permissionSelected: string[]
}
const TablePermission = (props: TTablePermission) => {
  const { permissionSelected, setPermissionSelected } = props

  const theme = useTheme()
  const { t } = useTranslation()

  const handleGetValuePermission = (value: string, mode: string, parentValue?: string) => {
    try {
      //case 2 là sử lí trường hợp dashboard nó ko đúng định dạng
      return parentValue ? PERMISSIONS[parentValue][value][mode] : PERMISSIONS[value] //tương tự PẺ.pare.value.mode (mode là cái create edit view....)
    } catch (error) {
      return ''
    }
  }

  // hàm để check xem đã check all chưa
  const handleIsCheck = (value: string, parentValue?: string) => {
    const allValue = parentValue
      ? getAllValueObject(PERMISSIONS[parentValue][value])
      : getAllValueObject(PERMISSIONS[value])

    //khi vào truowgf hợp cái dash thì cái permiss[value ]= dash mà nó ko là obj

    // ví dụ cái cha là settig có 2 con là a và b (mỗi cái có crud)
    // khi check all cái a thì chạy cái handlecheckAllCheckBoxChildren => set được cái perSel
    // khi check all cái b thì utowng tự
    // => khi đó cái ischeck chạy lại => cái isCheckAll của Setting cũng là true
    // khi đó cái check all của setting cũng được check
    const isCheckAll = allValue.every(item => permissionSelected.includes(item))

    return { isCheckAll, allValue }
  }
  //case xử lí check all của cái con
  // cái parentValue là ?: là vì có case DASHBOARD nữa
  const handlecheckAllCheckBoxChildren = (value: string, parentValue?: string) => {
    const ans = handleIsCheck(value, parentValue)
    const { isCheckAll, allValue } = ans
    if (isCheckAll) {
      // nếu đã có check rồi => bỏ nó đi
      const filtered = permissionSelected.filter(item => !allValue.includes(item))
      setPermissionSelected(filtered)
    } else {
      //chưa check
      setPermissionSelected([...new Set([...permissionSelected, ...allValue])])
    }
  }

  //check all cái setting chứa cái a và b
  const handleCheckAllGroup = (value: string) => {
    const ans = handleIsCheck(value)
    const { isCheckAll, allValue } = ans
    if (isCheckAll) {
      // nếu đã có check rồi => bỏ nó đi
      const filtered = permissionSelected.filter(item => !allValue.includes(item))
      setPermissionSelected(filtered)
    } else {
      //chưa check
      setPermissionSelected([...new Set([...permissionSelected, ...allValue])])
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
      headerName: '',
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        //case ấn check hết các ô trong con thì cái ô all của cái đó sẽ được check
        const ans = handleIsCheck(row.value, row.parentValue)
        const { isCheckAll } = ans

        return (
          <>
            {' '}
            <Checkbox
              checked={isCheckAll}
              value={row?.value}
              onChange={e => {
                if (row.isParent) {
                  handleCheckAllGroup(e.target.value)
                } else {
                  handlecheckAllCheckBoxChildren(e.target.value, row.parentValue)
                }
              }}
            />
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
        const value = handleGetValuePermission(row.value, 'VIEW', row.parentValue)
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
        const value = handleGetValuePermission(row.value, 'CREATE', row.parentValue)

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
        const value = handleGetValuePermission(row.value, 'DELETE', row.parentValue)

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
        const value = handleGetValuePermission(row.value, 'UPDATE', row.parentValue)

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

// xử lí cái check all của từng hàng 1
// ví dụ nếu ấn vào cái check all của parent(ví dụ settting) thì sẽ check all các cái children cả create edit... của nó
// => case này thì dựa vào cái isP =true
// nếu ấn cái check all của cái conn (con của setting là cái City )=> thì sẽ check all cái crud của city => handlecheckAllCheckBoxChildren()
