import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
  styled,
  useTheme
} from '@mui/material'
import { DialogTitle } from '@mui/material'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/components/Icon'

interface TConfirmationDialog {
  open: boolean
  handleClose: () => void
  title: string
  description: string
  handleConfirm: () => {}
  handleCancel: () => void
}
const CustomStyleContent = styled(DialogContentText)(() => ({
  padding: '10px 20px'
}))

const ConfirmationDialog = (props: TConfirmationDialog) => {
  const { open, handleClose, title, description, handleConfirm, handleCancel } = props
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant='h4' sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </DialogTitle>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <IconifyIcon icon='ep:warning' fontSize={60} color={theme.palette.warning.main} />
      </Box>
      <CustomStyleContent>
        <DialogContentText sx={{ textAlign: 'center' }}>{description}</DialogContentText>
      </CustomStyleContent>
      <DialogActions>
        <Button variant='contained' onClick={handleConfirm}>
          {t('confirm')}
        </Button>
        <Button color='error' variant='outlined' onClick={handleCancel}>
          {t('cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default ConfirmationDialog
