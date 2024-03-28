// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { registerAuthAsync } from 'src/stores/apps/auth/actions'

const initialState = {
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: '',
  typeError: ''
}

export const authSlice = createSlice({
  name: 'auth', //tên này là type của action,
  initialState,
  reducers: {
    resetInitialState: state => {
      state.isError = true
      state.isSuccess = false
      state.isLoading = false
      state.message = ''
      state.typeError = ''
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
      state.isError = true
      state.isSuccess = false
      state.isLoading = false
      state.message = ''
      state.typeError = ''
    })
  }
})

export const { resetInitialState } = authSlice.actions

export default authSlice.reducer
