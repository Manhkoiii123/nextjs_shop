import { Avatar, Box, Button, Card, Grid, useTheme } from '@mui/material'
import { NextPage } from 'next'
import CustomTextField from 'src/components/text-field'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'
import { useEffect, useState } from 'react'
import IconifyIcon from 'src/components/Icon'
import { useTranslation } from 'react-i18next'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import { useAuth } from 'src/hooks/useAuth'

type TProps = {}
type TDefaultValue = {
  email: string
  address: string
  city: string
  fullName: string
  role: string
  phoneNumber: string
}

const ProfilePage: NextPage<TProps> = () => {
  const { t } = useTranslation()
  const defaultValues: TDefaultValue = {
    email: '',
    address: '',
    city: '',
    fullName: '',
    role: '',
    phoneNumber: ''
  }
  const schema = yup.object().shape({
    email: yup.string().required(t('required')).matches(EMAIL_REG, t('email_type')),
    fullName: yup.string().required(t('required')),
    city: yup.string(),
    address: yup.string(),
    phoneNumber: yup.string(),
    role: yup.string()
  })
  const { user } = useAuth()
  console.log('🚀 ~ user:', user)
  const theme = useTheme()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })
  const onsubmit = (data: any) => {
    // console.log({ data })
  }
  const handleUploadAvatar = (file: File) => {}

  useEffect(() => {
    if (user) {
      reset({
        role: user?.role.name,
        fullName: user?.fullName,
        email: user?.email
        // address: user?.addresses?.[0],
        // city: user?.city,
        // phoneNumber: user?.phoneNumber
      })
    }
  }, [user])

  return (
    <form onSubmit={handleSubmit(onsubmit)} autoComplete='off' noValidate>
      {/* <Card sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', p: 4 }}> */}
      <Grid container>
        <Grid
          container
          item
          md={6}
          xs={12}
          sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: 5, px: 4 }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%'
            }}
          >
            <Grid container spacing={4}>
              <Grid item md={12} xs={12}>
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  <Avatar sx={{ width: 100, height: 100 }}>
                    {/* {user?.avatar ? (
                  <Image
                    src={user?.avatar || ''}
                    alt='avatar'
                    style={{
                      height: 'auto',
                      width: 'auto'
                    }}
                  ></Image>
                ) : ( */}
                    <IconifyIcon fontSize={50} icon='mdi:user-outline'></IconifyIcon>
                    {/* )} */}
                  </Avatar>
                  <WrapperFileUpload
                    uploadFunc={handleUploadAvatar}
                    objectAcceptFile={{
                      'image/jpeg': ['.jpg', '.jpeg'],
                      'image/png': ['.png']
                    }}
                  >
                    <Button
                      type='submit'
                      variant='outlined'
                      sx={{ mt: 3, mb: 2, width: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <IconifyIcon icon='ph:camera-light' />
                      {t('Upload_Image')}
                    </Button>
                  </WrapperFileUpload>
                </Box>
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      error={Boolean(errors.email)}
                      margin='normal'
                      required
                      fullWidth
                      id='email'
                      label='Email'
                      name='email'
                      placeholder={t('Enter_email')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      helperText={errors?.email?.message}
                    />
                  )}
                  name='email'
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      error={Boolean(errors.role)}
                      margin='normal'
                      required
                      disabled
                      fullWidth
                      label={t('Role')}
                      name='role'
                      placeholder={t('Enter_role')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      helperText={errors?.role?.message}
                    />
                  )}
                  name='role'
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid container item md={6} xs={12} mt={{ md: 0, xs: 5 }}>
          <Box
            sx={{
              height: '100%',
              width: '100%',
              marginLeft: { md: 5, xs: 0 },
              backgroundColor: theme.palette.background.paper,
              borderRadius: '15px',
              py: 5,
              px: 4
            }}
          >
            <Grid container spacing={4}>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      error={Boolean(errors.fullName)}
                      margin='normal'
                      required
                      fullWidth
                      label={t('fullName')}
                      placeholder={t('enter_fullname')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      helperText={errors?.fullName?.message}
                    />
                  )}
                  name='fullName'
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      error={Boolean(errors.address)}
                      margin='normal'
                      fullWidth
                      label={t('address')}
                      placeholder={t('address_enter')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      helperText={errors?.address?.message}
                    />
                  )}
                  name='address'
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      error={Boolean(errors.city)}
                      margin='normal'
                      fullWidth
                      label={t('city')}
                      placeholder={t('city_enter')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      helperText={errors?.city?.message}
                    />
                  )}
                  name='city'
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      error={Boolean(errors.phoneNumber)}
                      margin='normal'
                      fullWidth
                      label={t('phone_number')}
                      placeholder={t('enter_phone')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      helperText={errors?.phoneNumber?.message}
                    />
                  )}
                  name='phoneNumber'
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      {/* </Card> */}

      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'end' }}>
        <Button type='submit' variant='outlined' sx={{ mt: 3, mb: 2 }}>
          {t('Update_user')}
        </Button>
      </Box>
    </form>
  )
}
export default ProfilePage
