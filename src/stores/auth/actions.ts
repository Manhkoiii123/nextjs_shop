import { createAsyncThunk } from '@reduxjs/toolkit'
import { changePasswordMe, registerAuth, registerAuthFacebook, registerAuthGoogle, updateAuthMe } from 'src/services/auth'
import { TypeChangePassword } from 'src/types/auth'

export const registerAuthAsync = createAsyncThunk('auth/register', async (data: any) => {
  const response = await registerAuth(data)
  if (response?.data) {
    return response
  }

  return {
    data: null,
    message: response?.response?.data?.message,
    typeError: response?.response?.data?.typeError
  }
})
export const registerAuthGoogleAsync = createAsyncThunk('auth/register-goole', async (idToken: string) => {
  const response = await registerAuthGoogle(idToken)
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
  if (response?.status === 'success') {
    return { ...response, data: 1 }
  }

  return {
    data: null,
    message: response?.response?.data?.message,
    typeError: response?.response?.data?.typeError
  }
})

export const registerAuthFacebookAsync = createAsyncThunk(`auth/register-facebook`, async (idToken: string) => {
  const response = await registerAuthFacebook(idToken)

  if (response?.data) {
    return response
  }

  return {
    data: null,
    message: response?.response?.data?.message,
    typeError: response?.response?.data?.typeError
  }
})
