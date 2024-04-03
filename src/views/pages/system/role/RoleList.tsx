import { Box, Grid, useTheme } from '@mui/material'
import { NextPage } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { getAllRoleAsync } from 'src/stores/role/actions'
import { useEffect } from 'react'

type TProps = {}

const RoleListPage: NextPage<TProps> = () => {
  const { roles } = useSelector((state: RootState) => state.role)
  const { t } = useTranslation()
  const theme = useTheme()

  //dùng redux
  const dispatch: AppDispatch = useDispatch()

  const router = useRouter()
  const handleGetListRoles = () => {
    dispatch(getAllRoleAsync({ params: { limit: -1, page: -1 } }))
  }
  useEffect(() => {
    handleGetListRoles()
  }, [])

  return (
    <>
      {/* {isLoading && <FallbackSpinner />} */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          padding: '40px'
        }}
      >
        <Grid container>
          <Grid item md={5} xs={12}></Grid>
          <Grid item md={7} xs={12}>
            List permission
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
export default RoleListPage
