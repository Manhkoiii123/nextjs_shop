import { createAsyncThunk } from '@reduxjs/toolkit'
import { createOrderProduct } from 'src/services/order-product'
import { TParamsCreateOrderProduct } from 'src/types/order-product'

export const serviceName = 'orderProduct'
export const createOrderProductAsync = createAsyncThunk(
  `${serviceName}/create`,
  async (data: TParamsCreateOrderProduct) => {
    const response = await createOrderProduct(data)

    return response
  }
)
