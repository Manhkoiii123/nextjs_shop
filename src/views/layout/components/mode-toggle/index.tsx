import { IconButton } from '@mui/material'
import { NextPage } from 'next'
import IconifyIcon from 'src/components/Icon'
import { useSettings } from 'src/hooks/useSettings'
import { Mode } from 'src/types/layouts'

type TProps = {}
const ModeToggle: NextPage = (props: TProps) => {
  const { settings, saveSettings } = useSettings()
  const handleModeChange = (mode: Mode) => {
    saveSettings({ ...settings, mode })
  }
  const handleToggleMode = () => {
    if (settings.mode === 'dark') {
      handleModeChange('light')
    } else {
      handleModeChange('dark')
    }
  }

  return (
    <IconButton color='inherit' onClick={handleToggleMode}>
      <IconifyIcon
        icon={
          settings.mode === 'dark' ? 'material-symbols-light:light-mode-outline' : 'material-symbols-light:dark-mode'
        }
      />
    </IconButton>
  )
}
export default ModeToggle
