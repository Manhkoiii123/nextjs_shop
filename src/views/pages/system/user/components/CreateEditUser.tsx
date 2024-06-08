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
import { createUserAsync, updateUserAsync } from 'src/stores/user/actions'
import { useEffect, useState } from 'react'
import { getDetailUser, updateUser } from 'src/services/user'
import Spinner from 'src/components/spinner'
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'

interface TCreateEditUser {
  open: boolean
  onClose: () => void
  idUser?: string
}
type TDefaultValue = {
  fullName: string
  email: string
  password: string
  role: string
  phoneNumber: string
  address: string
  avatar: string
  city: string
  status: 1
}
const CreateEditUser = (props: TCreateEditUser) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const { open, onClose, idUser } = props
  const theme = useTheme()
  const defaultValues: TDefaultValue = {
    fullName: '',
    email: '',
    password: '',
    role: '',
    phoneNumber: '',
    address: '',
    avatar: '',
    city: '',
    status: 1
  }
  const schema = yup.object().shape({
    fullName: yup.string().required(t('required')),
    email: yup.string().required('The field is required').matches(EMAIL_REG, 'The field is must email type'),
    password: yup
      .string()
      .required('The field is required')
      .matches(PASSWORD_REG, 'The password is contain charator,special charactor,number'),
    city: yup.string(),
    address: yup.string(),
    phoneNumber: yup.string().required(t('required')).min(8, t('min_8')),
    role: yup.string().required(t('required')),
    avatar: yup.string().required(t('required'))
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
      if (idUser) {
        //update
        // dispatch(updateUserAsync({ name: data.name, id: idUser }))
      } else {
        // create
        // dispatch(createUserAsync({ name: data.name }))
      }
    }
  }
  //fetch APi detail
  const fetchApiDetailUser = async (id: string) => {
    setLoading(true)
    await getDetailUser(id)
      .then(res => {
        const data = res.data
        if (data) {
          reset({
            // name: data.name
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
        ...defaultValues
      })
    } else {
      if (idUser) {
        fetchApiDetailUser(idUser)
      }
    }
  }, [open, idUser])

  return <></>
}
export default CreateEditUser


// {
//   loading && <Spinner />
// }
// ;<CustomModal open={open} onClose={onClose}>
//   <Box
//     sx={{ backgroundColor: theme.palette.background.paper, padding: '20px', borderRadius: '15px' }}
//     minWidth={{ md: '400px', xs: '80vw' }}
//   >
//     <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//       <Typography variant='h4' sx={{ fontWeight: 600 }}>
//         {idUser ? t('edit_user') : t('create_user')}
//       </Typography>
//       <IconButton onClick={onClose}>
//         <IconifyIcon icon='material-symbols-light:close' />
//       </IconButton>
//     </Box>
//     <form onSubmit={handleSubmit(onsubmit)} autoComplete='off' noValidate>
//       <Controller
//         control={control}
//         rules={{
//           required: true
//         }}
//         render={({ field: { onChange, onBlur, value } }) => (
//           <CustomTextField
//             error={Boolean(errors?.name)}
//             margin='normal'
//             required
//             fullWidth
//             name='name'
//             label={t('Name_user')}
//             placeholder={t('enter_name_user')}
//             onChange={onChange}
//             onBlur={onBlur}
//             helperText={errors?.name?.message}
//             value={value}
//           />
//         )}
//         name='name'
//       />

//       <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//         <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
//           {idUser ? t('edit') : t('create')}
//         </Button>
//       </Box>
//     </form>
//   </Box>
// </CustomModal>