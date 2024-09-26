import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
  useTheme
} from '@mui/material'
import { NextPage } from 'next'
import CustomTextField from 'src/components/text-field'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'
import { useEffect, useRef, useState } from 'react'
import IconifyIcon from 'src/components/Icon'
import Image from 'next/image'
import LoginDark from '/public/images/login-dark.png'
import LoginLight from '/public/images/login-light.png'
import Link from 'next/link'
import { useAuth } from 'src/hooks/useAuth'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { signIn, useSession } from 'next-auth/react'
import {
  clearLocalPreTokenAuthSocial,
  getLocalDeviceToken,
  getLocalPreTokenAuthSocial,
  getLocalRememberLoginAuthSocial,
  setLocalPreTokenAuthSocial
} from 'src/helpers/storage'

type TProps = {}
type TDefaultValue = {
  email: string
  password: string
}

const schema = yup
  .object()
  .shape({
    email: yup.string().required('The field is required').matches(EMAIL_REG, 'The field is must email type'),
    password: yup
      .string()
      .required('The field is required')
      .matches(PASSWORD_REG, 'The password is contain charator,special charactor,number')
  })
  .required()

const LoginPage: NextPage<TProps> = () => {
  const { t } = useTranslation()
  const defaultValues: TDefaultValue = {
    email: '',
    password: ''
  }
  const prevTokenLocal = getLocalPreTokenAuthSocial()
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isRemember, setIsRemenber] = useState(true)
  const theme = useTheme()
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    defaultValues: defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })
  const { data: session } = useSession()

  //** context */
  const { login, loginGoogle, loginFacebook } = useAuth()

  const onsubmit = (data: { email: string; password: string }) => {
    if (!Object.keys(errors).length) {
      login({ ...data, rememberMe: isRemember }, err => {
        if (err?.response?.data?.typeError === 'INVALID') toast.error(t('the_emmail_or_pass_wrong'))
      })
    }
  }
  const handleLoginGoogle = () => {
    signIn('google')
    clearLocalPreTokenAuthSocial()
  }
  const handleLoginFacebook = () => {
    signIn('facebook')
    clearLocalPreTokenAuthSocial()
  }
  useEffect(() => {
    if ((session as any)?.accessToken && (session as any)?.accessToken !== prevTokenLocal) {
      const rememberLocal = getLocalRememberLoginAuthSocial()
      const deviceToken = getLocalDeviceToken()
      if ((session as any)?.provider === 'facebook') {
        loginFacebook(
          {
            idToken: (session as any)?.accessToken,
            rememberMe: rememberLocal ? rememberLocal === 'true' : true
            // deviceToken: deviceToken ? deviceToken : ''
          },
          err => {
            if (err?.response?.data?.typeError === 'INVALID') toast.error(t('The_email_or_password_wrong'))
          }
        )
      } else {
        loginGoogle(
          {
            idToken: (session as any)?.accessToken,
            rememberMe: rememberLocal ? rememberLocal === 'true' : true
            // deviceToken: deviceToken ? deviceToken : ''
          },
          err => {
            if (err?.response?.data?.typeError === 'INVALID') toast.error(t('The_email_or_password_wrong'))
          }
        )
      }
      setLocalPreTokenAuthSocial((session as any)?.accessToken)
    }
  }, [(session as any)?.accessToken])

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
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
          src={theme.palette.mode === 'dark' ? LoginDark : LoginLight}
          alt='Logo login'
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
            {t('Sign_in')}
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
                    error={Boolean(errors.email)}
                    margin='normal'
                    required
                    fullWidth
                    id='email'
                    label='Email'
                    name='email'
                    placeholder='Input email'
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    helperText={errors?.email?.message}
                  />
                )}
                name='email'
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
                    error={Boolean(errors.password)}
                    margin='normal'
                    required
                    fullWidth
                    name='password'
                    label='Password'
                    type={isShowPassword ? 'text' : 'password'}
                    id='password'
                    placeholder='Input password'
                    onChange={onChange}
                    onBlur={onBlur}
                    helperText={errors?.password?.message}
                    value={value}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton edge='end' onClick={() => setIsShowPassword(!isShowPassword)}>
                            {isShowPassword ? (
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
                name='password'
              />
            </Box>

            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    value='remember'
                    color='primary'
                    checked={isRemember}
                    onChange={e => setIsRemenber(e.target.checked)}
                  />
                }
                label='Remember me'
              />
              <Typography>Forgot password?</Typography>
            </Box>
            <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4
              }}
            >
              <Typography>Don't have an account?</Typography>

              <Link
                href='/register'
                style={{
                  color: theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white
                }}
              >
                {'Sign Up'}
              </Link>
            </Box>
            <Divider>
              <Typography sx={{ textAlign: 'center', mb: 2, mt: 2 }}> Or </Typography>
            </Divider>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5
              }}
            >
              <IconButton sx={{ color: theme.palette.error.main }} onClick={handleLoginGoogle}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  role='img'
                  fontSize='1.375rem'
                  className='iconify iconify--mdi'
                  width='1em'
                  height='1em'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='currentColor'
                    d='M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z'
                  ></path>
                </svg>
              </IconButton>
              <IconButton sx={{ color: '#497ce2' }} onClick={handleLoginFacebook}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  role='img'
                  fontSize='1.375rem'
                  className='iconify iconify--mdi'
                  width='1em'
                  height='1em'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='currentColor'
                    d='M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z'
                  ></path>
                </svg>
              </IconButton>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  )
}
export default LoginPage
