import { Box, Button, IconButton, Typography, styled, useTheme } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/components/Icon'

type TProps = {
  numRowSelect: number
  onClear: () => void
  tableAction: { label: string; value: string; disable?: boolean }[]
  handleAction: (type: string) => void
}

const StyledTableHeader = styled(Box)(({ theme }) => ({
  borderRadius: '15px',
  border: `1px solid ${theme.palette.primary.main}`,
  padding: '8px 10px',
  width: '100%',
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))
const TableHeader = (props: TProps) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { numRowSelect, onClear, tableAction, handleAction } = props

  return (
    <StyledTableHeader>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Typography>{t('selected')}</Typography>
        <Typography
          sx={{
            backgroundColor: `${theme.palette.primary.main}`,
            height: '20px',
            width: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            color: `${theme.palette.customColors.lightPaperBg}`,
            fontWeight: 600,
            fontSize: '14px !important'
          }}
        >
          <span> {numRowSelect}</span>
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {tableAction.map(item => {
          return (
            <Button
              disabled={item.disable}
              key={item.value}
              variant='contained'
              onClick={() => handleAction(item.value)}
            >
              {item.label}
            </Button>
          )
        })}
        <IconButton onClick={onClear}>
          <IconifyIcon icon='material-symbols-light:close' fontSize={'20px'} />
        </IconButton>
      </Box>
    </StyledTableHeader>
  )
}

export default TableHeader
