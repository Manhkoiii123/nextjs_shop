/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Box, Button, Card, Grid, IconButton, useTheme } from '@mui/material'
import { NextPage } from 'next'
import CustomTextField from 'src/components/text-field'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { EMAIL_REG } from 'src/configs/regex'
import { useEffect, useState } from 'react'
import IconifyIcon from 'src/components/Icon'
import { useTranslation } from 'react-i18next'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import { getAuthMe } from 'src/services/auth'
import { UserDataType } from 'src/contexts/types'
import { convertBase64, seporationFullname, toFullName } from 'src/utils'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import toast from 'react-hot-toast'
import { resetInitialState } from 'src/stores/apps/auth'
import { updateAuthMeAsync } from 'src/stores/apps/auth/actions'
import FallbackSpinner from 'src/components/fall-back'
import Spinner from 'src/components/spinner'

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
  const [user, setUser] = useState<UserDataType | null>(null)
  const [loading, setLoading] = useState(false)
  const [roleId, setRoleId] = useState('')
  const [avatar, setAvatar] = useState('')
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
    fullName: yup.string(),
    city: yup.string(),
    address: yup.string(),
    phoneNumber: yup.string().required(t('required')).min(8, t('min_8')),
    role: yup.string().required(t('required'))
  })
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
  const { i18n } = useTranslation()
  const language = i18n.language
  const fetchGetAuthMe = async () => {
    setLoading(true)
    await getAuthMe()
      .then(async response => {
        setLoading(false)
        setUser({ ...response.data.data })
        const data = response?.data
        if (data) {
          setAvatar(data?.avatar)
          setRoleId(data?.role.id)
          reset({
            role: data?.role.name,
            fullName: toFullName(data?.lastName, data?.middleName, data?.firstName, language),
            email: data?.email,
            address: data?.address,
            city: data?.city,
            phoneNumber: data?.phoneNumber
          })
        }
      })
      .catch(() => {
        setUser(null)
        setLoading(false)
      })
  }
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isErrorUpdate, messageUpdate, isSuccessUpdate } = useSelector((state: RootState) => state.auth)
  const onsubmit = (data: any) => {
    const { firstName, middleName, lastName } = seporationFullname(data?.fullName, language)
    dispatch(
      updateAuthMeAsync({
        email: data.email,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        role: roleId,
        phoneNumber: data.phoneNumber,
        address: data.address,
        // city: data.city,
        avatar
      })
    )
  }
  useEffect(() => {
    if (messageUpdate) {
      if (isErrorUpdate) {
        toast.error(messageUpdate)
      } else if (isSuccessUpdate) {
        toast.success(messageUpdate)
        getAuthMe()
      }
      dispatch(resetInitialState())
    }
  }, [isErrorUpdate, isSuccessUpdate, messageUpdate])
  const handleUploadAvatar = async (file: File) => {
    const base64 = await convertBase64(file)
    setAvatar(base64 as string)
  }

  useEffect(() => {
    fetchGetAuthMe()
  }, [language])

  return (
    <>
      {/* <Spinner></Spinner> */}
      {loading || (isLoading && <Spinner />)}
      <form onSubmit={handleSubmit(onsubmit)} autoComplete='off' noValidate>
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
                    <Box sx={{ position: 'relative' }}>
                      {avatar && (
                        <IconButton
                          sx={{ position: 'absolute', bottom: -4, right: -6, zIndex: 2 }}
                          edge='start'
                          color='inherit'
                          onClick={() => setAvatar('')}
                        >
                          <IconifyIcon icon='material-symbols-light:delete-outline' />
                        </IconButton>
                      )}
                      {avatar ? (
                        <Avatar src={avatar} sx={{ width: 100, height: 100 }}>
                          <IconifyIcon fontSize={50} icon='mdi:user-outline'></IconifyIcon>
                        </Avatar>
                      ) : (
                        <Avatar sx={{ width: 100, height: 100 }}>
                          <IconifyIcon fontSize={50} icon='mdi:user-outline'></IconifyIcon>
                        </Avatar>
                      )}
                    </Box>

                    <WrapperFileUpload
                      uploadFunc={handleUploadAvatar}
                      objectAcceptFile={{
                        'image/jpeg': ['.jpg', '.jpeg'],
                        'image/png': ['.png']
                      }}
                    >
                      <Button
                        variant='outlined'
                        sx={{ mt: 3, mb: 2, width: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <IconifyIcon icon='ph:camera-light' />
                        {avatar ? t('Change_Image') : t('Upload_Image')}
                      </Button>
                    </WrapperFileUpload>
                  </Box>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextField
                        error={Boolean(errors.email)}
                        margin='normal'
                        required
                        disabled
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
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextField
                        error={Boolean(errors.fullName)}
                        margin='normal'
                        fullWidth
                        label={t('fullName')}
                        placeholder={t('enter_fullname')}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                    name='fullName'
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Controller
                    control={control}
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
                      />
                    )}
                    name='address'
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Controller
                    control={control}
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
                      />
                    )}
                    name='city'
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextField
                        error={Boolean(errors.phoneNumber)}
                        margin='normal'
                        fullWidth
                        required
                        label={t('phone_number')}
                        placeholder={t('enter_phone')}
                        onChange={e => {
                          const numValue = e.target.value.replace(/\D/g, '')
                          onChange(numValue)
                        }}
                        inputProps={{
                          inputMode: 'numeric',
                          pattern: '[0-9]*',
                          minLength: 8
                        }}
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

        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'end' }}>
          <Button type='submit' variant='outlined' sx={{ mt: 3, mb: 2 }}>
            {t('Update_user')}
          </Button>
        </Box>
      </form>
    </>
  )
}
export default ProfilePage
