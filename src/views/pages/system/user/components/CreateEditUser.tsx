import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  InputLabel,
  Switch,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'

import IconifyIcon from 'src/components/Icon'
import { useTranslation } from 'react-i18next'
import CustomModal from 'src/components/custom-modal'
import CustomTextField from 'src/components/text-field'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import { createUserAsync, updateUserAsync } from 'src/stores/user/actions'
import { Dispatch, memo, SetStateAction, useEffect, useState } from 'react'
import { getDetailUser, updateUser } from 'src/services/user'
import Spinner from 'src/components/spinner'
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import { convertBase64, seporationFullname, toFullName } from 'src/utils'
import CustomSelect from 'src/components/custom-select'
import { FormHelperText } from '@mui/material'
import { getAllRoles } from 'src/services/role'
import { getAllCity } from 'src/services/city'

interface TCreateEditUser {
  open: boolean
  onClose: () => void
  idUser?: string
  avatar: string
  setAvatar: Dispatch<SetStateAction<string>>
  optionRoles: { label: string; value: string }[]
  optionCities: { label: string; value: string }[]
}
type TDefaultValue = {
  password?: string
  fullName: string
  email: string
  role: string
  phoneNumber: string
  address?: string
  status?: number
  city?: string
}
const CreateEditUser = (props: TCreateEditUser) => {
  const { t, i18n } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { open, onClose, idUser, avatar, setAvatar, optionCities, optionRoles } = props
  const theme = useTheme()
  const defaultValues: TDefaultValue = {
    password: '',
    fullName: '',
    email: '',
    role: '',
    phoneNumber: '',
    address: '',
    status: 1,
    city: ''
  }
  const schema = yup.object().shape({
    email: yup.string().required(t('Required_field')).matches(EMAIL_REG, t('Rules_email')),
    password: idUser
      ? yup.string().nonNullable()
      : yup.string().required(t('Required_field')).matches(PASSWORD_REG, t('Rules_password')),
    fullName: yup.string().required(t('Required_field')),
    phoneNumber: yup.string().required(t('Required_field')).min(9, t('The phone number is min 9 number')),
    role: yup.string().required(t('Required_field')),
    city: yup.string().nonNullable(),
    address: yup.string().nonNullable(),
    status: yup.number().nonNullable()
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
  const onsubmit = (data: TDefaultValue) => {
    if (!Object.keys(errors).length) {
      const { firstName, middleName, lastName } = seporationFullname(data?.fullName, i18n.language)
      if (idUser) {
        // console.log(data)
        // update
        dispatch(
          updateUserAsync({
            id: idUser,
            firstName,
            lastName,
            middleName,
            phoneNumber: data.phoneNumber,
            role: data?.role,
            email: data.email,
            city: data.city,
            address: data?.address,
            avatar: avatar,
            status: data.status
          })
        )
      } else {
        // create
        dispatch(
          createUserAsync({
            firstName,
            lastName,
            middleName,
            password: data?.password ? data?.password : '',
            phoneNumber: data.phoneNumber,
            role: data?.role,
            email: data.email,
            city: data.city,
            address: data?.address,
            avatar: avatar
          })
        )
      }
    }
  }

  const handleUploadAvatar = async (file: File) => {
    const base64 = await convertBase64(file)
    setAvatar(base64 as string)
  }
  //fetch APi detail
  const fetchApiDetailUser = async (id: string) => {
    setLoading(true)
    await getDetailUser(id)
      .then(res => {
        const data = res.data
        if (data) {
          reset({
            fullName: toFullName(data?.lastName, data?.middleName, data?.firstName, i18n.language),
            password: data.password,
            phoneNumber: data.phoneNumber,
            role: data?.role?._id,
            email: data.email,
            city: data.city,
            address: data?.address,
            status: data?.status
          })
          setAvatar(data.avatar)
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
        ...defaultValues
      })
      setAvatar('')
      setShowPassword(false)
    } else {
      if (idUser) {
        fetchApiDetailUser(idUser)
      }
    }
  }, [open, idUser])

  return (
    <>
      {loading && <Spinner />}
      <CustomModal open={open} onClose={onClose}>
        <Box
          sx={{
            padding: '20px',
            borderRadius: '15px',
            backgroundColor: theme.palette.customColors.bodyBg
          }}
          minWidth={{ md: '800px', xs: '80vw' }}
          maxWidth={{ md: '80vw', xs: '80vw' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', paddingBottom: '20px' }}>
            <Typography variant='h4' sx={{ fontWeight: 600 }}>
              {' '}
              {idUser ? t('edit_user') : t('create_user')}
            </Typography>
            <IconButton sx={{ position: 'absolute', top: '-4px', right: '-10px' }} onClick={onClose}>
              <IconifyIcon icon='material-symbols-light:close' fontSize={'30px'} />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit(onsubmit)} autoComplete='off' noValidate>
            <Box sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: 5, px: 4 }}>
              <Grid container spacing={5}>
                <Grid container item md={6} xs={12}>
                  <Box sx={{ height: '100%', width: '100%' }}>
                    <Grid container spacing={4}>
                      <Grid item md={12} xs={12}>
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2
                          }}
                        >
                          <Box sx={{ position: 'relative' }}>
                            {avatar && (
                              <IconButton
                                sx={{
                                  position: 'absolute',
                                  bottom: -4,
                                  right: -6,
                                  zIndex: 2,
                                  color: theme.palette.error.main
                                }}
                                edge='start'
                                color='inherit'
                                onClick={() => setAvatar('')}
                              >
                                <IconifyIcon icon='material-symbols-light:delete-outline' />
                              </IconButton>
                            )}
                            {avatar ? (
                              <Avatar src={avatar} sx={{ width: 100, height: 100 }}>
                                <IconifyIcon icon='ph:user-thin' fontSize={70} />
                              </Avatar>
                            ) : (
                              <Avatar sx={{ width: 100, height: 100 }}>
                                <IconifyIcon icon='ph:user-thin' fontSize={70} />
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
                              sx={{ width: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}
                            >
                              <IconifyIcon icon='ph:camera-thin'></IconifyIcon>
                              {avatar ? t('Change_Image') : t('Upload_Image')}
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
                              required
                              fullWidth
                              label={t('Email')}
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                              placeholder={t('Enter_email')}
                              error={Boolean(errors?.email)}
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
                            <div>
                              <label
                                style={{
                                  fontSize: '13px',
                                  // marginBottom: '4px',
                                  display: 'block',
                                  color: errors?.role
                                    ? theme.palette.error.main
                                    : `rgba(${theme.palette.customColors.main}, 0.42)`
                                }}
                              >
                                {t('Role')}{' '}
                                <span
                                  style={{
                                    color: errors?.role
                                      ? theme.palette.error.main
                                      : `rgba(${theme.palette.customColors.main}, 0.42)`
                                  }}
                                >
                                  *
                                </span>
                              </label>
                              <CustomSelect
                                fullWidth
                                onChange={onChange}
                                options={optionRoles}
                                error={Boolean(errors?.role)}
                                onBlur={onBlur}
                                value={value}
                                placeholder={t('Enter_your_role')}
                              />
                              {errors?.role && (
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
                      </Grid>
                      {!idUser && (
                        <Grid item md={6} xs={12}>
                          <Controller
                            control={control}
                            rules={{
                              required: true
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                              <CustomTextField
                                required
                                fullWidth
                                label={t('Password')}
                                onChange={onChange}
                                onBlur={onBlur}
                                value={value}
                                placeholder={t('Enter_password')}
                                error={Boolean(errors?.password)}
                                helperText={errors?.password?.message}
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position='end'>
                                      <IconButton edge='end' onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                          <IconifyIcon icon='material-symbols:visibility-outline' />
                                        ) : (
                                          <IconifyIcon icon='ic:outline-visibility-off' />
                                        )}
                                      </IconButton>
                                    </InputAdornment>
                                  )
                                }}
                              />
                            )}
                            name='password'
                          />
                        </Grid>
                      )}
                      {idUser && (
                        <Grid item md={6} xs={12}>
                          <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => {
                              return (
                                <FormControlLabel
                                  control={
                                    <Switch
                                      size='medium'
                                      value={value}
                                      checked={Boolean(value)}
                                      onChange={e => {
                                        onChange(e.target.checked ? 1 : 0)
                                      }}
                                    />
                                  }
                                  label={Boolean(value) ? t('Active') : t('Block')}
                                />
                              )
                            }}
                            name='status'
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Grid>
                <Grid container item md={6} xs={12}>
                  <Box>
                    <Grid container spacing={4}>
                      <Grid item md={12} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
                              fullWidth
                              label={t('fullName')}
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                              placeholder={t('enter_fullname')}
                              error={Boolean(errors?.fullName)}
                              helperText={errors?.fullName?.message}
                            />
                          )}
                          name='fullName'
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Controller
                          control={control}
                          name='address'
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              fullWidth
                              label={t('address')}
                              placeholder={t('address_enter')}
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Controller
                          name='city'
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <Box>
                              <InputLabel
                                sx={{
                                  fontSize: '13px',
                                  marginBottom: '4px',
                                  display: 'block',
                                  color: errors?.city
                                    ? theme.palette.error.main
                                    : `rgba(${theme.palette.customColors.main}, 0.42)`
                                }}
                              >
                                {t('city')}
                              </InputLabel>
                              <CustomSelect
                                fullWidth
                                onChange={onChange}
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
                            </Box>
                          )}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
                              fullWidth
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
                              error={Boolean(errors?.phoneNumber)}
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
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                {!idUser ? t('create') : t('update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}
export default memo(CreateEditUser)
