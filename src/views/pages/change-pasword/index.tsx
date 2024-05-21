import { Box, Button, CssBaseline, IconButton, InputAdornment, Typography, useTheme } from '@mui/material'
import { NextPage } from 'next'
import CustomTextField from 'src/components/text-field'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { PASSWORD_REG } from 'src/configs/regex'
import { useEffect, useState } from 'react'
import IconifyIcon from 'src/components/Icon'
import Image from 'next/image'
import RegisterDark from '/public/images/register-dark.png'
import RegisterLight from '/public/images/register-light.png'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import toast from 'react-hot-toast'
import FallbackSpinner from 'src/components/fall-back'
import { resetInitialState } from 'src/stores/auth'
import { useRouter } from 'next/navigation'
import { ROUTE_CONFIG } from 'src/configs/route'
import { useTranslation } from 'react-i18next'
import { chagePasswordMeAsync } from 'src/stores/auth/actions'
import { useAuth } from 'src/hooks/useAuth'

type TProps = {}
type TDefaultValue = {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

const ChangePasswordPage: NextPage<TProps> = () => {
  const defaultValues: TDefaultValue = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  }
  const [isShowCurrentPassword, setIsShowCurrentPassword] = useState(false)
  const [isShowConfirmNewPassword, setIsShowConfirmNewPassword] = useState(false)
  const [isShowNewPassword, setIsShowNewPassword] = useState(false)
  const { t } = useTranslation()
  const theme = useTheme()
  const { logout } = useAuth()
  const schema = yup.object().shape({
    currentPassword: yup
      .string()
      .required('The field is required')
      .matches(PASSWORD_REG, 'The password is contain charator,special charactor,number'),
    newPassword: yup
      .string()
      .required('The field is required')
      .matches(PASSWORD_REG, 'The password is contain charator,special charactor,number'),
    confirmNewPassword: yup
      .string()
      .required('The field is required')
      .matches(PASSWORD_REG, 'The password is contain charator,special charactor,number')
      .oneOf([yup.ref('newPassword')], 'The confirm password is must match with password')
  })
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  //dùng redux
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isErrorChangePassword, isSuccessChangePassword, messageChangePassword } = useSelector(
    (state: RootState) => state.auth
  )
  const router = useRouter()
  const onsubmit = (data: { currentPassword: string; newPassword: string }) => {
    if (!Object.keys(errors).length) {
      dispatch(chagePasswordMeAsync({ currentPassword: data.currentPassword, newPassword: data.newPassword }))
    }
  }

  useEffect(() => {
    if (messageChangePassword) {
      if (isErrorChangePassword) {
        toast.error(messageChangePassword)
      } else if (isSuccessChangePassword) {
        toast.success(messageChangePassword)
        setTimeout(() => {
          logout() //logout ra để đưa token vào blacklist
        }, 500)
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessChangePassword, isErrorChangePassword, messageChangePassword, dispatch, router, logout])

  return (
    <>
      {isLoading && <FallbackSpinner />}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          padding: '40px'
        }}
      >
        <Box
          display={{
            md: 'flex',
            sm: 'flex',
            xs: 'none'
          }}
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.customColors.bodyBg,
            borderRadius: '20px',
            height: '100%',
            minWidth: '50vw',
            flex: 1
          }}
        >
          <Image
            src={theme.palette.mode === 'dark' ? RegisterDark : RegisterLight}
            alt='Logo register'
            style={{ width: '50%', height: 'auto' }}
          ></Image>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1
          }}
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography component='h1' variant='h5'>
              {t('change_pass')}
            </Typography>
            <form onSubmit={handleSubmit(onsubmit)} autoComplete='off' noValidate>
              <Box sx={{ mt: 2, width: '300px' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      error={Boolean(errors?.currentPassword)}
                      margin='normal'
                      required
                      fullWidth
                      name='currentPassword'
                      label={t('current_pass')}
                      type={isShowCurrentPassword ? 'text' : 'password'}
                      id='currentPassword'
                      placeholder={t('input_currentPass')}
                      onChange={onChange}
                      onBlur={onBlur}
                      helperText={errors?.currentPassword?.message}
                      value={value}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setIsShowCurrentPassword(!isShowCurrentPassword)}>
                              {isShowCurrentPassword ? (
                                <IconifyIcon icon={'material-symbols:visibility-outline'} />
                              ) : (
                                <IconifyIcon icon={'material-symbols:visibility-off'} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                  name='currentPassword'
                />
              </Box>
              <Box sx={{ mt: 2, width: '300px' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      error={Boolean(errors.newPassword)}
                      margin='normal'
                      required
                      fullWidth
                      name='newPassword'
                      label={t('new_pass')}
                      type={isShowNewPassword ? 'text' : 'password'}
                      id='newPassword'
                      placeholder={t('enter_new_pass')}
                      onChange={onChange}
                      onBlur={onBlur}
                      helperText={errors?.newPassword?.message}
                      value={value}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setIsShowNewPassword(!isShowNewPassword)}>
                              {isShowNewPassword ? (
                                <IconifyIcon icon={'material-symbols:visibility-outline'} />
                              ) : (
                                <IconifyIcon icon={'material-symbols:visibility-off'} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                  name='newPassword'
                />
              </Box>
              <Box sx={{ mt: 2, width: '300px' }}>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      error={Boolean(errors.confirmNewPassword)}
                      margin='normal'
                      required
                      fullWidth
                      name='confirmNewPassword'
                      label={t('confirm_pass')}
                      type={isShowConfirmNewPassword ? 'text' : 'password'}
                      placeholder={t('input_confirm_pass')}
                      onChange={onChange}
                      onBlur={onBlur}
                      helperText={errors?.confirmNewPassword?.message}
                      value={value}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onClick={() => setIsShowConfirmNewPassword(!isShowConfirmNewPassword)}
                            >
                              {isShowConfirmNewPassword ? (
                                <IconifyIcon icon={'material-symbols:visibility-outline'} />
                              ) : (
                                <IconifyIcon icon={'material-symbols:visibility-off'} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                  name='confirmNewPassword'
                />
              </Box>

              <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                {t('update_pasword')}
              </Button>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  )
}
export default ChangePasswordPage
