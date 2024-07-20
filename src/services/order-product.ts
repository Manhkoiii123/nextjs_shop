// api endPoint
import { API_ENDPOINT } from 'src/configs/api'

// Axios
import instanceAxios from 'src/helpers/axios'
import axios from 'axios'
import { TParamsCreateOrderProduct, TParamsEditOrderProduct, TParamsGetOrderProducts } from 'src/types/order-product'

export const getAllOrderByMe = async (data: { params: TParamsGetOrderProducts }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/me`, data)

    return res.data
  } catch (error) {
    return error
  }
}
export const getDetailOrderById = async (id: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/me/${id}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const createOrderProduct = async (data: TParamsCreateOrderProduct) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}`, data)

    return res.data
  } catch (error: any) {
    return error?.response?.data
  }
}

export const cancelOrderProductOfMe = async (id: string) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/me/cancel/${id}`)

    return res.data
  } catch (error: any) {
    return error?.response?.data
  }
}