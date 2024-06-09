// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import {
  createCityAsync,
  deleteMultipleCityAsync,
  deleteCityAsync,
  getAllCityAsync,
  serviceName,
  updateCityAsync
} from 'src/stores/city/actions'

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
  Citys: {
    data: [],
    total: 0
  }
}

export const CitySlice = createSlice({
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
    //get all City
    builder.addCase(getAllCityAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getAllCityAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.Citys.data = action.payload.data.cities || []
      state.Citys.total = action.payload.data.totalCount
    })
    builder.addCase(getAllCityAsync.rejected, (state, action) => {
      state.isLoading = false
      state.Citys.data = []
      state.Citys.total = 0
    })

    //creat City
    builder.addCase(createCityAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(createCityAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreateEdit = !!action.payload?.data?._id
      state.isErrorCreateEdit = !action.payload?.data?._id
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    //edit Role
    builder.addCase(updateCityAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateCityAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreateEdit = !!action.payload?.data?._id
      state.isErrorCreateEdit = !action.payload?.data?._id
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    //delete City
    builder.addCase(deleteCityAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteCityAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessDelete = !!action.payload?.data?._id
      state.isErrorDelete = !action.payload?.data?._id
      state.messageErrorDelete = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    //delete multiple City
    builder.addCase(deleteMultipleCityAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteMultipleCityAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessDeleteMultiple = !!action.payload?.data
      state.isErrorDeleteMultiple = !action.payload?.data
      state.messageErrorDeleteMultiple = action.payload?.message
      state.typeError = action.payload?.typeError
    })
  }
})

export const { resetInitialState } = CitySlice.actions

export default CitySlice.reducer
