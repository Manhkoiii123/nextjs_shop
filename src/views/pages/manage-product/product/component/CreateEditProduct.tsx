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
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Spinner from 'src/components/spinner'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import { convertBase64, covertHtmlToDraft, seporationFullname, stringToSlug, toFullName } from 'src/utils'
import CustomSelect from 'src/components/custom-select'
import { FormHelperText } from '@mui/material'
import { createProductAsync, updateProductAsync } from 'src/stores/product/actions'
import { getDetailsProduct } from 'src/services/product'
import { getAllProductTypes } from 'src/services/product-type'
import CustomDatePicker from 'src/components/custom-date-picker'
import CustomEditor from 'src/components/custom-editor'
import { EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { formatDate } from 'src/utils/date'

interface TCreateEditUser {
  open: boolean
  onClose: () => void
  idProduct?: string
  imageProduct: string
  setImageProduct: Dispatch<SetStateAction<string>>
}
type TDefaultValue = {
  name: string
  type: string
  discount?: string
  price: string
  description: EditorState
  slug: string
  countInStock: string
  status: number
  discountEndDate?: Date | null
  discountStartDate?: Date | null
}
const CreateEditProduct = (props: TCreateEditUser) => {
  const { t, i18n } = useTranslation()
  const [loading, setLoading] = useState(false)
  // const [imageProduct, setImageProduct] = useState('')
  const [optionTypes, setOptionTypes] = useState<{ label: string; value: string }[]>([])
  const { open, onClose, idProduct, imageProduct, setImageProduct } = props
  const theme = useTheme()
  const defaultValues: TDefaultValue = {
    name: '',
    type: '',
    price: '',
    discount: '',
    description: EditorState.createEmpty(),
    slug: '',
    countInStock: '',
    status: 0,
    discountEndDate: null,
    discountStartDate: null
  }
  const schema = yup.object().shape({
    name: yup.string().required(t('Required_field')),
    slug: yup.string().required(t('Required_field')),
    type: yup.string().required(t('Required_field')),
    // location: yup.string().required(t('Required_field')),
    countInStock: yup
      .string()
      .required(t('Required_field'))
      .test('least_count', t('least_1_in_count'), value => {
        return Number(value) >= 1
      }),
    discount: yup
      .string()
      .notRequired()
      .test('least_discount', t('least_1_in_discount'), (value, context: any) => {
        const discountStartDate = context?.parent?.discountStartDate
        const discountEndDate = context?.parent?.discountEndDate
        if (value) {
          if (!discountStartDate) {
            setError('discountStartDate', { type: 'required_start_discount', message: t('required_start_discount') })
          }

          if (!discountEndDate) {
            setError('discountEndDate', { type: 'required_end_discount', message: t('required_end_discount') })
          }
        } else {
          clearErrors('discountEndDate')
          clearErrors('discountStartDate')
        }

        return !value || Number(value) >= 1
      }),
    discountStartDate: yup
      .date()
      .notRequired()
      .test('required_start_discount', t('required_start_discount'), (value, context: any) => {
        const discount = context?.parent?.discount

        return (discount && value) || !discount
      })
      .test('less_end_discount', t('required_less_end_discount'), (value, context: any) => {
        const discountEndDate = context?.parent?.discountEndDate
        if (value && discountEndDate && discountEndDate.getTime() > value?.getTime()) {
          clearErrors('discountEndDate')
        }

        return (discountEndDate && value && discountEndDate.getTime() > value?.getTime()) || !discountEndDate
      }),
    discountEndDate: yup
      .date()
      .notRequired()
      .test('required_end_discount', t('required_end_discount'), (value, context: any) => {
        const discountStartDate = context?.parent?.discountStartDate

        return (discountStartDate && value) || !discountStartDate
      })
      .test('than_start_discount', t('required_than_start_discount'), (value, context: any) => {
        const discountStartDate = context?.parent?.discountStartDate
        if (value && discountStartDate && discountStartDate.getTime() < value?.getTime()) {
          clearErrors('discountStartDate')
        }

        return (discountStartDate && value && discountStartDate.getTime() < value?.getTime()) || !discountStartDate
      }),
    status: yup.number().required(t('Required_field')),
    description: yup.object().required(t('Required_field')),
    price: yup
      .string()
      .required(t('Required_field'))
      .test('least_count', t('least_1_in_count'), value => {
        return Number(value) >= 1000
      })
  })
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
    setError,
    clearErrors
  } = useForm({
    defaultValues: defaultValues,
    mode: 'onSubmit',
    resolver: yupResolver(schema)
  })
  const dispatch: AppDispatch = useDispatch()
  const onsubmit = (data: any) => {
    if (!Object.keys(errors).length) {
      if (idProduct) {
        dispatch(
          updateProductAsync({
            id: idProduct,
            name: data.name,
            slug: data.slug,
            price: Number(data.price),
            discountEndDate: data?.discountEndDate || null,
            discountStartDate: data?.discountStartDate || null,
            status: data.status ? 1 : 0,
            image: imageProduct,
            type: data.type,
            discount: Number(data.discount) || 0,
            description: data.description ? draftToHtml(convertToRaw(data.description.getCurrentContent())) : '',
            countInStock: Number(data.countInStock)
          })
        )
      } else {
        dispatch(
          createProductAsync({
            name: data.name,
            slug: data.slug,
            price: Number(data.price),
            discountEndDate: data?.discountEndDate || null,
            discountStartDate: data?.discountStartDate || null,
            status: data.status ? 1 : 0,
            image: imageProduct,
            type: data.type,
            discount: Number(data.discount) || 0,
            description: data.description ? draftToHtml(convertToRaw(data.description.getCurrentContent())) : '',
            countInStock: Number(data.countInStock)
          })
        )
      }
    }
  }

  const fetchAllType = async () => {
    setLoading(true)
    await getAllProductTypes({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res.data.productTypes
        if (data) {
          setOptionTypes(data.map((item: { name: string; _id: string }) => ({ label: item.name, value: item._id })))
        }
        setLoading(false)
      })
      .catch(e => setLoading(false))
  }

  useEffect(() => {
    fetchAllType()
  }, [])
  const handleUploadImage = async (file: File) => {
    const base64 = await convertBase64(file)
    setImageProduct(base64 as string)
  }
  //fetch APi detail
  const fetchApiDetailProduct = async (id: string) => {
    setLoading(true)
    await getDetailsProduct(id)
      .then(res => {
        const data = res.data
        if (data) {
          reset({
            name: data.name,
            type: data.type,
            price: data.price,
            discount: data.discount,
            description: data.description ? covertHtmlToDraft(data.description) : '',
            slug: data.slug,
            countInStock: data.countInStock,
            status: data.status,
            discountEndDate: data.discountEndDate ? new Date(data.discountEndDate) : null,
            discountStartDate: data.discountStartDate ? new Date(data.discountStartDate) : null
          })
          setImageProduct(data.image)
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
    } else {
      if (idProduct) {
        fetchApiDetailProduct(idProduct)
      }
    }
  }, [open, idProduct])

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
              {idProduct ? t('Edit_product') : t('Create_product')}
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
                            {imageProduct && (
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
                                onClick={() => setImageProduct('')}
                              >
                                <IconifyIcon icon='material-symbols-light:delete-outline' />
                              </IconButton>
                            )}
                            {imageProduct ? (
                              <Avatar src={imageProduct} sx={{ width: 100, height: 100 }}>
                                <IconifyIcon icon='ph:user-thin' fontSize={70} />
                              </Avatar>
                            ) : (
                              <Avatar sx={{ width: 100, height: 100 }}>
                                <IconifyIcon icon='ph:user-thin' fontSize={70} />
                              </Avatar>
                            )}
                          </Box>
                          <WrapperFileUpload
                            uploadFunc={handleUploadImage}
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
                              {imageProduct ? t('Change_image_product') : t('Upload_image_product')}
                            </Button>
                          </WrapperFileUpload>
                        </Box>
                      </Grid>
                      <Grid item md={12} xs={12} mb={2}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
                              fullWidth
                              label={t('Name_product')}
                              onChange={e => {
                                const value = e.target.value
                                const replaced = stringToSlug(value)
                                onChange(value)
                                reset({
                                  ...getValues(),
                                  slug: replaced
                                })
                              }}
                              onBlur={onBlur}
                              value={value}
                              placeholder={t('Enter_name_product')}
                              error={Boolean(errors?.name)}
                              helperText={errors?.name?.message}
                            />
                          )}
                          name='name'
                        />
                      </Grid>
                      <Grid item md={12} xs={12} mb={2}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
                              disabled
                              fullWidth
                              label={t('Slug')}
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                              placeholder={t('Enter_slug')}
                              error={Boolean(errors?.slug)}
                              helperText={errors?.slug?.message}
                            />
                          )}
                          name='slug'
                        />
                      </Grid>

                      <Grid item md={12} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => {
                            return (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <InputLabel
                                  sx={{
                                    fontSize: '13px',
                                    marginBottom: '4px',
                                    display: 'block',
                                    color: errors?.status
                                      ? theme.palette.error.main
                                      : `rgba(${theme.palette.customColors.main}, 0.68)`
                                  }}
                                >
                                  {t('Status_product')}
                                </InputLabel>
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
                                  label={Boolean(value) ? t('Public') : t('Private')}
                                />
                              </Box>
                            )
                          }}
                          name='status'
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid container item md={6} xs={12}>
                  <Box>
                    <Grid container spacing={4}>
                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
                              fullWidth
                              label={t('Price')}
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                              placeholder={t('Enter_price')}
                              error={Boolean(errors?.price)}
                              helperText={errors?.price?.message}
                            />
                          )}
                          name='price'
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          name='countInStock'
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              fullWidth
                              label={t('Count_in_stock')}
                              placeholder={t('Enter_your_count')}
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                              error={Boolean(errors?.countInStock)}
                              helperText={errors?.countInStock?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Controller
                          name='type'
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <Box>
                              <InputLabel
                                sx={{
                                  fontSize: '13px',
                                  marginBottom: '4px',
                                  display: 'block',
                                  color: errors?.type
                                    ? theme.palette.error.main
                                    : `rgba(${theme.palette.customColors.main}, 0.68)`
                                }}
                              >
                                {t('Type_product')}
                              </InputLabel>
                              <CustomSelect
                                fullWidth
                                onChange={onChange}
                                options={optionTypes}
                                error={Boolean(errors?.type)}
                                onBlur={onBlur}
                                value={value}
                                placeholder={t('Select')}
                              />
                              {errors?.type?.message && (
                                <FormHelperText
                                  sx={{
                                    color: errors?.type
                                      ? theme.palette.error.main
                                      : `rgba(${theme.palette.customColors.main}, 0.68)`
                                  }}
                                >
                                  {errors?.type?.message}
                                </FormHelperText>
                              )}
                            </Box>
                          )}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              fullWidth
                              label={t('Discount(percent)')}
                              placeholder={t('Enter_discount')}
                              onChange={e => {
                                const numValue = e.target.value.replace(/\D/g, '')
                                onChange(numValue)
                              }}
                              inputProps={{
                                inputMode: 'numeric',
                                pattern: '[0-9]*',
                                minLength: 1
                              }}
                              onBlur={onBlur}
                              value={value}
                              error={Boolean(errors?.discount)}
                              helperText={errors?.discount?.message}
                            />
                          )}
                          name='discount'
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomDatePicker
                              onChange={(date: Date | null) => {
                                onChange(date)
                              }}
                              label={`${t('Start_date_discount')}`}
                              placeholder='Date start'
                              onBlur={onBlur}
                              selectedDate={value}
                              error={Boolean(errors?.discountStartDate)}
                              helperText={errors?.discountStartDate?.message}
                            />
                          )}
                          name='discountStartDate'
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomDatePicker
                              onChange={(date: Date | null) => {
                                onChange(date)
                              }}
                              label={`${t('End_date_discount')}`}
                              placeholder='Date end'
                              onBlur={onBlur}
                              selectedDate={value}
                              error={Boolean(errors?.discountEndDate)}
                              helperText={errors?.discountEndDate?.message}
                            />
                          )}
                          name='discountEndDate'
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomEditor
                              onEditorStateChange={onChange}
                              label={`${t('Description')}`}
                              onBlur={onBlur}
                              editorState={value as EditorState}
                              placeholder={t('Enter_your_description')}
                              error={Boolean(errors?.description)}
                              helperText={errors?.description?.message}
                            />
                          )}
                          name='description'
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                {!idProduct ? t('create') : t('update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}
export default CreateEditProduct
