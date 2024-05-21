import { createAsyncThunk } from '@reduxjs/toolkit'
import { changePasswordMe, registerAuth, updateAuthMe } from 'src/services/auth'
import { TypeChangePassword } from 'src/types/auth'

export const registerAuthAsync = createAsyncThunk('auth/register', async (data: any) => {
  const response = await registerAuth(data)
  //   console.log('🚀 ~ registerAuthAsync ~ response:', response)
  if (response?.data) {
    return response
  }

  return {
    data: null,
    message: response?.response?.data?.message,
    typeError: response?.response?.data?.typeError
  }
})
export const updateAuthMeAsync = createAsyncThunk('auth/update-me', async (data: any) => {
  const response = await updateAuthMe(data)
  if (response?.data) {
    return response
  }

  return {
    data: null,
    message: response?.response?.data?.message,
    typeError: response?.response?.data?.typeError
  }
})
export const chagePasswordMeAsync = createAsyncThunk('auth/chage-password', async (data: TypeChangePassword) => {
  const response = await changePasswordMe(data)
  console.log('🚀 ~ chagePasswordMeAsync ~ response:', response)
  if (response?.status === 'success') {
    return { ...response, data: 1 }
  }

  return {
    data: null,
    message: response?.response?.data?.message,
    typeError: response?.response?.data?.typeError
  }
})
