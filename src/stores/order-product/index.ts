// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { serviceName } from 'src/stores/order-product/actions'

// ** Actions

const initialState = {
  orderItems: []
}

export const orderProductSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    updateProductToCard: (state, action) => {
      state.orderItems = action.payload.orderItems
    }
  },
  extraReducers: builder => {}
})

export const { updateProductToCard } = orderProductSlice.actions
export default orderProductSlice.reducer
