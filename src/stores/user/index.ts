// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import {
  createUserAsync,
  deleteMultipleUserAsync,
  deleteUserAsync,
  getAllUserAsync,
  serviceName,
  updateUserAsync
} from 'src/stores/user/actions'

const initialState = {
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: '',
  typeError: '',
  isSuccessCreateEdit: false,
  isErrorCreateEdit: false,
  messageErrorCreateEdit: '',
  isSuccessDelete: false,
  isErrorDelete: false,
  messageErrorDelete: '',
  isSuccessDeleteMultiple: false,
  isErrorDeleteMultiple: true,
  messageErrorDeleteMultiple: '',
  users: {
    data: [],
    total: 0
  }
}

export const userSlice = createSlice({
  name: serviceName, //tên này là type của action,
  initialState,
  reducers: {
    resetInitialState: state => {
      state.isError = false
      state.isSuccess = true
      state.isLoading = false
      state.message = ''
      state.typeError = ''
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = true
      state.messageErrorCreateEdit = ''
      state.isSuccessDelete = false
      state.isErrorDelete = true
      state.messageErrorDelete = ''
      state.isSuccessDeleteMultiple = false
      state.isErrorDeleteMultiple = true
      state.messageErrorDeleteMultiple = ''
    }
  },
  extraReducers: builder => {
    //get all user
    builder.addCase(getAllUserAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getAllUserAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.users.data = action.payload.data.users
      state.users.total = action.payload.data.totalCount
    })
    builder.addCase(getAllUserAsync.rejected, (state, action) => {
      state.isLoading = false
      state.users.data = []
      state.users.total = 0
    })

    //creat user
    builder.addCase(createUserAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(createUserAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreateEdit = !!action.payload?.data?._id
      state.isErrorCreateEdit = !action.payload?.data?._id
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    //edit Role
    builder.addCase(updateUserAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateUserAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreateEdit = !!action.payload?.data?._id
      state.isErrorCreateEdit = !action.payload?.data?._id
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    //delete user
    builder.addCase(deleteUserAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteUserAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessDelete = !!action.payload?.data?._id
      state.isErrorDelete = !action.payload?.data?._id
      state.messageErrorDelete = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    //delete multiple user
    builder.addCase(deleteMultipleUserAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteMultipleUserAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessDeleteMultiple = !!action.payload?.data
      state.isErrorDeleteMultiple = !action.payload?.data
      state.messageErrorDeleteMultiple = action.payload?.message
      state.typeError = action.payload?.typeError
    })
  }
})

export const { resetInitialState } = userSlice.actions

export default userSlice.reducer
