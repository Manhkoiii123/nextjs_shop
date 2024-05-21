import { API_ENDPOINT } from 'src/configs/api'
import instanceAxios from 'src/helpers/axios'
import { TParamsCreateRoles, TParamsDeleteRoles, TParamsEditRoles, TParamsGetRoles } from 'src/types/role'

export const getAllRoles = async (data: { params: TParamsGetRoles }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.ROLE.INDEX}`, data)

    return res.data
  } catch (error) {}
}
export const createRoles = async (data: TParamsCreateRoles) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.ROLE.INDEX}`, data)

    return res.data
  } catch (error: any) {
    return error?.response?.data
  }
}
export const updateRoles = async (data: TParamsEditRoles) => {
  const { id, ...rest } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.ROLE.INDEX}/${data.id}`, rest)

    return res.data
  } catch (error: any) {
    return error?.response?.data
  }
}
export const deleteRoles = async (id: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.ROLE.INDEX}/${id}`)

    return res.data
  } catch (error) {
    return error
  }
}
export const getDetailRoles = async (id: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.ROLE.INDEX}/${id}`)

    return res.data
  } catch (error) {
    return error
  }
}
