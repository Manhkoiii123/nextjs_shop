import Modal, { ModalProps } from '@mui/material/Modal'
import { styled } from '@mui/material'
import { Box } from '@mui/material'

interface TCustomModal extends ModalProps {
  onClose: () => void
}

const StyleModal = styled(Modal)<ModalProps>(({ theme }) => ({
  zIndex: 1200,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}))

const CustomModal = (props: TCustomModal) => {
  const { children, onClose, open } = props

  return (
    <StyleModal
      open={open}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box
        sx={{
          height: '100%',
          width: '100vw'
        }}
      >
        <Box sx={{ maxHeight: '100vh', overflow: 'auto' }}>
          <Box
            sx={{
              height: '100%',
              width: '100%',
              minHeight: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Box
              sx={{
                margin: '40px 0'
              }}
            >
              {children}
            </Box>
          </Box>
        </Box>
      </Box>
    </StyleModal>
  )
}
export default CustomModal
