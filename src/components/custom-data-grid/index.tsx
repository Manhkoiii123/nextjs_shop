import Box from '@mui/material/Box'
import { DataGrid, DataGridProps, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { styled } from '@mui/material'
import { Ref, forwardRef } from 'react'

const StyleCustomGrid = styled(DataGrid)<DataGridProps>(({ theme }) => ({
  '& .MuiDataGrid-withBorderColor': {
    outline: 'none !important'
  },
  '.MuiDataGrid-selectedRowCount': {
    display: 'none'
  }
}))

const CustomDataGrid = forwardRef((props: DataGridProps, ref: Ref<any>) => {
  return (
    <Box sx={{ height: '100%', width: '100%', overflow: 'auto' }}>
      <StyleCustomGrid {...props} />
    </Box>
  )
})
export default CustomDataGrid
