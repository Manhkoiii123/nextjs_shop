//layout cho main
import * as React from 'react'

import CssBaseline from '@mui/material/CssBaseline'

import Box from '@mui/material/Box'

import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'

import { NextPage } from 'next'

import HorizontalLayout from './HorizontalLayout'
import { useTheme } from '@mui/material'

type TProps = {
  children: React.ReactNode
}
const LayoutNotApp: NextPage<TProps> = ({ children }) => {
  const theme = useTheme()

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <HorizontalLayout open={false} toggleDrawer={() => {}} isHideMenu />

      <Box
        component='main'
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto'
        }}
      >
        <Toolbar />
        <Container
          sx={{
            m: 4,
            padding: '0 !important',
            borderRadius: '15px',
            maxWidth: 'unset !important',
            width: 'calc(100vw - 32px)',
            overflow: 'auto',
            maxHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight} - 32px)`
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  )
}
export default LayoutNotApp
