// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { getAllRoleAsync } from 'src/stores/role/actions'

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
  messageChangePassword: '',
  roles: []
}

export const roleSlice = createSlice({
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
      state.roles = []
    }
  },
  extraReducers: builder => {
    //get all
    builder.addCase(getAllRoleAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getAllRoleAsync.fulfilled, (state, action) => {
      console.log('🚀 ~ builder.addCase ~ action:', action)
      state.isLoading = false
      state.roles = []
    })
    builder.addCase(getAllRoleAsync.rejected, (state, action) => {
      state.isLoading = false
    })
  }
})

export const { resetInitialState } = roleSlice.actions

export default roleSlice.reducer
