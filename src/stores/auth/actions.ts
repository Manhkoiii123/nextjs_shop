import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  changePasswordMe,
  forgotPasswordAuth,
  registerAuth,
  registerAuthFacebook,
  registerAuthGoogle,
  resetPasswordAuth,
  updateAuthMe
} from 'src/services/auth'
import { TForgotPasswordAuth, TResetPasswordAuth, TypeChangePassword } from 'src/types/auth'

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
export const forgotPasswordAuthAsync = createAsyncThunk(`auth/forgot-password`, async (data: TForgotPasswordAuth) => {
  const response = await forgotPasswordAuth(data)

  if (response?.data) {
    return response
  }

  return {
    data: null,
    message: response?.response?.data?.message,
    typeError: response?.response?.data?.typeError
  }
})

export const resetPasswordAuthAsync = createAsyncThunk(`auth/reset-password`, async (data: TResetPasswordAuth) => {
  const response = await resetPasswordAuth(data)

  if (response?.data) {
    return response
  }

  return {
    data: null,
    message: response?.response?.data?.message,
    typeError: response?.response?.data?.typeError
  }
})
