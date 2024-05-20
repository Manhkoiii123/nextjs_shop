import { IconButton, Tooltip } from '@mui/material'

import IconifyIcon from 'src/components/Icon'
import { useTranslation } from 'react-i18next'

interface TGridDelete {
  onClick: () => void
  disabled?: boolean
}

const GridDelete = (props: TGridDelete) => {
  const { t } = useTranslation()

  const { onClick, disabled } = props

  return (
    <Tooltip title={t('delete')}>
      <IconButton disabled={disabled} onClick={onClick}>
        <IconifyIcon icon={'material-symbols:delete-outline'} />
      </IconButton>
    </Tooltip>
  )
}
export default GridDelete
