import { Box, Button, Divider, Icon, IconButton, Tooltip, Typography, useTheme } from '@mui/material'

import IconifyIcon from 'src/components/Icon'
import { useTranslation } from 'react-i18next'
import CustomModal from 'src/components/custom-modal'
import CustomTextField from 'src/components/text-field'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import { createRolesAsync, updateRolesAsync } from 'src/stores/role/actions'
import { useEffect, useState } from 'react'
import { getDetailRoles, updateRoles } from 'src/services/role'
import Spinner from 'src/components/spinner'
import { PERMISSIONS } from 'src/configs/permissions'

interface TCreateEditRole {
  open: boolean
  onClose: () => void
  idRole?: string
}
type TDefaultValue = {
  name: string
}
const CreateEditRole = (props: TCreateEditRole) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const { open, onClose, idRole } = props
  const theme = useTheme()
  const defaultValues: TDefaultValue = {
    name: ''
  }
  const schema = yup.object().shape({
    name: yup.string().required(t('required'))
  })
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValues,
    mode: 'onSubmit',
    resolver: yupResolver(schema)
  })
  const dispatch: AppDispatch = useDispatch()
  const onsubmit = (data: { name: string }) => {
    if (!Object.keys(errors).length) {
      if (idRole) {
        //update
        dispatch(updateRolesAsync({ name: data.name, id: idRole }))
      } else {
        // create
        dispatch(createRolesAsync({ name: data.name, permissions: [PERMISSIONS.DASHBOARD] }))
      }
    }
  }
  //fetch APi detail
  const fetchApiDetailRole = async (id: string) => {
    setLoading(true)
    await getDetailRoles(id)
      .then(res => {
        const data = res.data
        if (data) {
          reset({
            name: data.name
          })
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }
  useEffect(() => {
    if (!open) {
      reset({
        name: ''
      })
    } else {
      if (idRole) {
        fetchApiDetailRole(idRole)
      }
    }
  }, [open, idRole])

  return (
    <>
      {loading && <Spinner />}
      <CustomModal open={open} onClose={onClose}>
        <Box
          sx={{ backgroundColor: theme.palette.background.paper, padding: '20px', borderRadius: '15px' }}
          minWidth={{ md: '400px', xs: '80vw' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant='h4' sx={{ fontWeight: 600 }}>
              {idRole ? t('edit_role') : t('create_role')}
            </Typography>
            <IconButton onClick={onClose}>
              <IconifyIcon icon='material-symbols-light:close' />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit(onsubmit)} autoComplete='off' noValidate>
            {/* <Box sx={{ mt: 2, width: '300px' }}> */}
            <Controller
              control={control}
              rules={{
                required: true
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomTextField
                  error={Boolean(errors?.name)}
                  margin='normal'
                  required
                  fullWidth
                  name='name'
                  label={t('Name_role')}
                  placeholder={t('enter_name')}
                  onChange={onChange}
                  onBlur={onBlur}
                  helperText={errors?.name?.message}
                  value={value}
                />
              )}
              name='name'
            />
            {/* </Box> */}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                {idRole ? t('edit') : t('create')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}
export default CreateEditRole
