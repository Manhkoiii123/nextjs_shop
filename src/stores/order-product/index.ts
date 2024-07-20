// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import {
  cancelOrderProductOfMeAsync,
  createOrderProductAsync,
  getAllOrderByMeAsync,
  serviceName
} from 'src/stores/order-product/actions'

// ** Actions

const initialState = {
  isSuccessCreate: false,
  isErrorCreate: false,
  messageErrorCreate: '',
  isSuccessCancelMe: false,
  isErrorCancelMe: false,
  messageErrorCancelMe: '',
  isSuccessEdit: false,
  isErrorEdit: false,
  messageErrorEdit: '',
  isSuccessDelete: false,
  isErrorDelete: false,
  messageErrorDelete: '',
  isLoading: false,
  typeError: '',
  orderItems: [],
  orderProducts: {
    data: [],
    total: 0
  },
  ordersOfMe: {
    data: [],
    total: 0
  }
}
export const orderProductSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    updateProductToCard: (state, action) => {
      state.orderItems = action.payload.orderItems
    },
    resetInitialState: state => {
      state.isSuccessCreate = false
      state.isErrorCreate = true
      state.messageErrorCreate = ''
      state.typeError = ''
      state.isLoading = false
      state.isSuccessCancelMe = false
      state.isErrorCancelMe = true
      state.messageErrorCancelMe = ''
      state.isSuccessEdit = false
      state.isErrorEdit = true
      state.messageErrorEdit = ''
      state.isSuccessDelete = false
      state.isErrorDelete = true
      state.messageErrorDelete = ''
    }
  },
  extraReducers: builder => {
    // ** create order product
    builder.addCase(createOrderProductAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(createOrderProductAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreate = !!action.payload?.data?._id
      state.isErrorCreate = !action.payload?.data?._id
      state.messageErrorCreate = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    // ** get all order products by me
    builder.addCase(getAllOrderByMeAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getAllOrderByMeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.ordersOfMe.data = action.payload?.data?.orders || []
      state.ordersOfMe.total = action.payload?.data?.totalCount
    })
    builder.addCase(getAllOrderByMeAsync.rejected, (state, action) => {
      state.isLoading = false
      state.ordersOfMe.data = []
      state.ordersOfMe.total = 0
    })
    // ** cancel order product of me
    builder.addCase(cancelOrderProductOfMeAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(cancelOrderProductOfMeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCancelMe = !!action.payload?.data?._id
      state.isErrorCancelMe = !action.payload?.data?._id
      state.messageErrorCancelMe = action.payload?.message
      state.typeError = action.payload?.typeError
    })
  }
})

export const { updateProductToCard, resetInitialState } = orderProductSlice.actions
export default orderProductSlice.reducer
