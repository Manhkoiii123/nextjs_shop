import { Box, IconButton, Tooltip, useTheme } from '@mui/material'

import IconifyIcon from 'src/components/Icon'
import { useTranslation } from 'react-i18next'
import CustomModal from 'src/components/custom-modal'

interface TCreateEditRole {
  open: boolean
  onClose: () => void
  idRole?: string
}

const CreateEditRole = (props: TCreateEditRole) => {
  const { t } = useTranslation()
  const { open, onClose, idRole } = props
  const theme = useTheme()

  return (
    <CustomModal open={open} onClose={onClose}>
      <Box sx={{ backgroundColor: theme.palette.background.paper, padding: '20px' }}>
        <div>Hello</div>
      </Box>
    </CustomModal>
  )
}
export default CreateEditRole
