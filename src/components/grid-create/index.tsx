import { IconButton, Tooltip, useTheme } from '@mui/material'

import IconifyIcon from 'src/components/Icon'
import { useTranslation } from 'react-i18next'

interface TGridCreate {
  onClick: () => void
  disabled?: boolean
}

const GridCreate = (props: TGridCreate) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { onClick, disabled } = props

  return (
    <Tooltip title={t('create')}>
      <IconButton
        onClick={onClick}
        disabled={disabled}
        sx={{
          backgroundColor: `${theme.palette.primary.main} !important`,
          color: `${theme.palette.common.white} !important`
        }}
      >
        <IconifyIcon icon={'ic:baseline-plus'} />
      </IconButton>
    </Tooltip>
  )
}
export default GridCreate
