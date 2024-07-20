import { createAsyncThunk } from '@reduxjs/toolkit'
import { cancelOrderProductOfMe, createOrderProduct, getAllOrderByMe } from 'src/services/order-product'
import { TParamsCreateOrderProduct, TParamsGetOrderProducts } from 'src/types/order-product'

export const serviceName = 'orderProduct'
export const createOrderProductAsync = createAsyncThunk(
  `${serviceName}/create`,
  async (data: TParamsCreateOrderProduct) => {
    const response = await createOrderProduct(data)

    return response
  }
)
export const getAllOrderByMeAsync = createAsyncThunk(
  `${serviceName}/get-all-me`,
  async (data: { params: TParamsGetOrderProducts }) => {
    const response = await getAllOrderByMe(data)

    return response
  }
)
export const cancelOrderProductOfMeAsync = createAsyncThunk(`${serviceName}/cancel-order-of-my`, async (id: string) => {
  const response = await cancelOrderProductOfMe(id)

  return response
})
