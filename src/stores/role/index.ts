// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { getAllRolesAsync } from 'src/stores/role/actions'

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
  roles: {
    data: [],
    total: 0
  }
}

export const roleSlice = createSlice({
  name: 'role', //tên này là type của action,
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
      state.roles = {
        data: [],
        total: 0
      }
    }
  },
  extraReducers: builder => {
    //get all
    builder.addCase(getAllRolesAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getAllRolesAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.roles.data = action.payload.data.roles
      state.roles.total = action.payload.data.totalCount
    })
    builder.addCase(getAllRolesAsync.rejected, (state, action) => {
      state.isLoading = false
      state.roles.data = []
      state.roles.total = 0
    })
  }
})

export const { resetInitialState } = roleSlice.actions

export default roleSlice.reducer
