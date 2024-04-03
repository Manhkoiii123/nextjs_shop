// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { updateAuthMeAsync, registerAuthAsync, chagePasswordMeAsync } from 'src/stores/auth/actions'

const initialState = {
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
  messageChangePassword: ''
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
    }
  },
  extraReducers: builder => {
    builder.addCase(registerAuthAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(registerAuthAsync.fulfilled, (state, action) => {
      // console.log('🚀 ~ builder.addCase ~ action:', action
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
    //update
    builder.addCase(updateAuthMeAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateAuthMeAsync.fulfilled, (state, action) => {
      // console.log('🚀 ~ builder.addCase ~ action:', action
      state.isLoading = false
      state.isErrorUpdate = !action.payload.data?.email
      state.isSuccessUpdate = !!action.payload.data?.email //có emial là thành công
      state.messageUpdate = action.payload.message
      state.typeError = action.payload.typeError
    })
    builder.addCase(updateAuthMeAsync.rejected, (state, action) => {
      state.isErrorUpdate = true
      state.isSuccessUpdate = false
      state.isLoading = false
      state.messageUpdate = ''
      state.typeError = ''
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
  }
})

export const { resetInitialState } = authSlice.actions

export default authSlice.reducer
