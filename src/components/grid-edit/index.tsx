import { IconButton, Tooltip } from '@mui/material'

import IconifyIcon from 'src/components/Icon'
import { useTranslation } from 'react-i18next'

interface TGridEdit {
  onClick: () => void
  disabled?: boolean
}

const GridEdit = (props: TGridEdit) => {
  const { t } = useTranslation()

  const { onClick, disabled } = props

  return (
    <Tooltip title={t('edit')}>
      <IconButton disabled={disabled} onClick={onClick}>
        <IconifyIcon icon={'tabler:edit'} />
      </IconButton>
    </Tooltip>
  )
}
export default GridEdit
