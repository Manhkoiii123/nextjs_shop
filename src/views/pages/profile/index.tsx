/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Box, Button, Card, FormHelperText, Grid, IconButton, InputLabel, useTheme } from '@mui/material'
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
import { convertBase64, seporationFullname, toFullName } from 'src/utils'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import toast from 'react-hot-toast'
import { resetInitialState, updateUserredux } from 'src/stores/auth'
import { updateAuthMeAsync } from 'src/stores/auth/actions'
import Spinner from 'src/components/spinner'
import CustomSelect from 'src/components/custom-select'
import { getAllRoles } from 'src/services/role'
import { getAllCity } from 'src/services/city'

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
  const [loading, setLoading] = useState(false)
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
  const [isDisableRole, setIsDisableRole] = useState(false)
  const schema = yup.object().shape({
    email: yup.string().required(t('required')).matches(EMAIL_REG, t('email_type')),
    fullName: yup.string(),
    city: yup.string(),
    address: yup.string(),
    phoneNumber: yup.string().required(t('required')).min(8, t('min_8')),
    role: !isDisableRole ? yup.string().required(t('required')) : yup.string().notRequired()
  })
  const theme = useTheme()
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setValue,
    getValues
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
        const data = response?.data
        if (data) {
          setAvatar(data?.avatar)
          setIsDisableRole(!data?.role?.permissions.length)
          reset({
            email: data?.email,
            role: data?.role?._id,
            fullName: toFullName(data?.lastName, data?.middleName, data?.firstName, language),
            address: data?.address,
            city: data?.city,
            phoneNumber: data?.phoneNumber
          })
        }
      })
      .catch(() => {
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
        role: data.role,
        phoneNumber: data.phoneNumber,
        address: data.address,
        city: data.city,
        avatar
      })
    )
  }
  const fetchAuthMe = async () => {
    const tmp = await getAuthMe()

    dispatch(updateUserredux(tmp.data))
  }
  const [optionsRole, setOptionRole] = useState<{ label: string; value: string }[]>([])
  const fetchRoles = async () => {
    setLoading(true)
    await getAllRoles({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res.data.roles
        if (data) {
          setOptionRole(data.map((item: { name: string; _id: string }) => ({ label: item.name, value: item._id })))
        }
        setLoading(false)
      })
      .catch(e => setLoading(false))
  }
  const [optionCities, setOptionCities] = useState<{ label: string; value: string }[]>([])
  const fetchAllCity = async () => {
    setLoading(true)
    await getAllCity({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res.data.cities
        if (data) {
          setOptionCities(data.map((item: { name: string; _id: string }) => ({ label: item.name, value: item._id })))
        }
        setLoading(false)
      })
      .catch(e => setLoading(false))
  }
  useEffect(() => {
    fetchRoles()
    fetchAllCity()
  }, [])
  useEffect(() => {
    if (messageUpdate) {
      if (isErrorUpdate) {
        toast.error(messageUpdate)
      } else if (isSuccessUpdate) {
        toast.success(messageUpdate)
        fetchAuthMe()
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
                  {!isDisableRole && (
                    <Controller
                      control={control}
                      rules={{
                        required: true
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <div style={{ paddingTop: '12px' }}>
                          <label
                            style={{
                              fontSize: '13px',
                              marginBottom: '4px',
                              display: 'block',
                              color: errors?.role
                                ? theme.palette.error.main
                                : `rgba(${theme.palette.customColors.main}, 0.42)`
                            }}
                          >
                            {t('Role')} <span style={{ color: theme.palette.error.main }}>*</span>
                          </label>
                          <CustomSelect
                            fullWidth
                            onChange={onChange}
                            options={optionsRole}
                            error={Boolean(errors?.role)}
                            onBlur={onBlur}
                            value={value}
                            placeholder={t('Enter_your_role')}
                          />
                          {errors?.role?.message && (
                            <FormHelperText
                              sx={{
                                color: errors?.role
                                  ? theme.palette.error.main
                                  : `rgba(${theme.palette.customColors.main}, 0.42)`
                              }}
                            >
                              {errors?.role?.message}
                            </FormHelperText>
                          )}
                        </div>
                      )}
                      name='role'
                    />
                  )}
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
                    render={({ field: { onChange, onBlur, value } }) => {
                      return (
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
                      )
                    }}
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
                    rules={{
                      required: true
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <div style={{ paddingTop: '12px' }}>
                        <label
                          style={{
                            fontSize: '13px',
                            marginBottom: '4px',
                            display: 'block',
                            color: errors?.city
                              ? theme.palette.error.main
                              : `rgba(${theme.palette.customColors.main}, 0.42)`
                          }}
                        >
                          {t('city')} <span style={{ color: theme.palette.error.main }}>*</span>
                        </label>
                        <CustomSelect
                          fullWidth
                          onChange={onChange}
                          // options={[]}
                          options={optionCities}
                          error={Boolean(errors?.city)}
                          onBlur={onBlur}
                          value={value}
                          placeholder={t('city_enter')}
                        />
                        {errors?.city?.message && (
                          <FormHelperText
                            sx={{
                              color: errors?.city
                                ? theme.palette.error.main
                                : `rgba(${theme.palette.customColors.main}, 0.42)`
                            }}
                          >
                            {errors?.city?.message}
                          </FormHelperText>
                        )}
                      </div>
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
