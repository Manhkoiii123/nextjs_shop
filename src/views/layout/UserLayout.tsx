import * as React from 'react'

import CssBaseline from '@mui/material/CssBaseline'

import Box from '@mui/material/Box'

import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'

import { NextPage } from 'next'
import VerticalLayout from './VerticalLayout'
import HorizontalLayout from './HorizontalLayout'
import { useTheme } from '@mui/material'

type TProps = {
  children: React.ReactNode
}
const UserLayout: NextPage<TProps> = ({ children }) => {
  const theme = useTheme()
  const [open, setOpen] = React.useState(true)
  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <VerticalLayout open={open} toggleDrawer={toggleDrawer}></VerticalLayout>
      <HorizontalLayout open={open} toggleDrawer={toggleDrawer} />

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
            // borderRadius: '15px',
            maxWidth: 'unset !important',
            width: `calc(100% - 32px)`,
            // maxHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - 32px)`,
            // height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - 32px)`
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  )
}
export default UserLayout
