// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { updateAuthMeAsync, registerAuthAsync } from 'src/stores/apps/auth/actions'

const initialState = {
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: '',
  typeError: '',
  isSuccessUpdate: true,
  isErrorUpdate: false,
  messageUpdate: ''
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
      state.isErrorUpdate = false
      state.isSuccessUpdate = true
      state.messageUpdate = ''
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
  }
})

export const { resetInitialState } = authSlice.actions

export default authSlice.reducer
