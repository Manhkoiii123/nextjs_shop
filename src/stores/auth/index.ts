// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { UserDataType } from 'src/contexts/types'
import {
  updateAuthMeAsync,
  registerAuthAsync,
  chagePasswordMeAsync,
  registerAuthGoogleAsync,
  registerAuthFacebookAsync,
  resetPasswordAuthAsync,
  forgotPasswordAuthAsync
} from 'src/stores/auth/actions'

type TInit = {
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  message: string
  typeError: string
  isSuccessUpdate: boolean
  isErrorUpdate: boolean
  messageUpdate: string
  isSuccessChangePassword: boolean
  isErrorChangePassword: boolean
  messageChangePassword: string
  userData: UserDataType | null
  isSuccessResetPassword: boolean
  isErrorResetPassword: boolean
  messageResetPassword: string
  isSuccessForgotPassword: boolean
  isErrorForgotPassword: boolean
  messageForgotPassword: string
}

const initialState: TInit = {
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: '',
  typeError: '',
  isSuccessUpdate: true,
  isErrorUpdate: false,
  messageUpdate: '',
  isSuccessChangePassword: true,
  isErrorChangePassword: false,
  messageChangePassword: '',
  userData: null,
  isSuccessForgotPassword: true,
  isErrorForgotPassword: false,
  messageForgotPassword: '',
  isSuccessResetPassword: true,
  isErrorResetPassword: false,
  messageResetPassword: ''
}

export const authSlice = createSlice({
  name: 'auth', //tên này là type của action,
  initialState,
  reducers: {
    resetInitialState: state => {
      state.isError = false
      state.isSuccess = true
      state.isLoading = false
      state.message = ''
      state.typeError = ''
      state.isErrorChangePassword = false
      state.isSuccessUpdate = true
      state.messageUpdate = ''
      state.isErrorChangePassword = false
      state.isSuccessChangePassword = true
      state.messageChangePassword = ''
      state.isSuccessForgotPassword = false
      state.isErrorForgotPassword = true
      state.messageForgotPassword = ''
      state.isSuccessResetPassword = false
      state.isErrorResetPassword = true
      state.messageResetPassword = ''
    },
    updateUserredux: (state, action) => {
      state.userData = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(registerAuthAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(registerAuthAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isError = !action.payload.data?.email
      state.isSuccess = !!action.payload.data?.email //có emial là thành công
      state.message = action.payload.message
      state.typeError = action.payload.typeError
    })
    builder.addCase(registerAuthAsync.rejected, (state, action) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ''
      state.typeError = ''
    })
    builder.addCase(registerAuthGoogleAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(registerAuthGoogleAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isError = !action.payload.data?.email
      state.isSuccess = !!action.payload.data?.email //có emial là thành công
      state.message = action.payload.message
      state.typeError = action.payload.typeError
    })
    builder.addCase(registerAuthGoogleAsync.rejected, (state, action) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ''
      state.typeError = ''
    })

    // ** register facebook
    builder.addCase(registerAuthFacebookAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(registerAuthFacebookAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = !!action.payload?.data?.email
      state.isError = !action.payload?.data?.email
      state.message = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(registerAuthFacebookAsync.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = ''
      state.typeError = ''
    })
    //update
    builder.addCase(updateAuthMeAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateAuthMeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isErrorUpdate = !action.payload.data?.email
      state.isSuccessUpdate = !!action.payload.data?.email //có emial là thành công
      state.messageUpdate = action.payload.message
      state.typeError = action.payload.typeError
      // state.userData = action.payload.data
    })
    builder.addCase(updateAuthMeAsync.rejected, (state, action) => {
      state.isErrorUpdate = true
      state.isSuccessUpdate = false
      state.isLoading = false
      state.messageUpdate = ''
      state.typeError = ''
      state.userData = null
    })
    //change password me
    builder.addCase(chagePasswordMeAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(chagePasswordMeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isErrorChangePassword = !action.payload.data
      state.isSuccessChangePassword = !!action.payload.data //có emial là thành công
      state.messageChangePassword = action.payload.message
      state.typeError = action.payload.typeError
    })
    builder.addCase(chagePasswordMeAsync.rejected, (state, action) => {
      state.isErrorChangePassword = true
      state.isSuccessChangePassword = false
      state.isLoading = false
      state.messageChangePassword = ''
      state.typeError = ''
    })
    builder.addCase(resetPasswordAuthAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(resetPasswordAuthAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessResetPassword = !!action.payload?.data?.email
      state.isErrorResetPassword = !action.payload?.data?.email
      state.messageResetPassword = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(resetPasswordAuthAsync.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccessResetPassword = false
      state.isErrorResetPassword = true
      state.messageResetPassword = ''
      state.typeError = ''
    })

    // ** forgot password
    builder.addCase(forgotPasswordAuthAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(forgotPasswordAuthAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessForgotPassword = !!action.payload?.data?.email
      state.isErrorForgotPassword = !action.payload?.data?.email
      state.messageForgotPassword = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(forgotPasswordAuthAsync.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccessForgotPassword = false
      state.isErrorForgotPassword = true
      state.message = ''
      state.typeError = ''
    })
  }
})

export const { resetInitialState, updateUserredux } = authSlice.actions

export default authSlice.reducer
