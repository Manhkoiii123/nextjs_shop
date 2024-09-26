import axios from 'axios'
import { API_ENDPOINT } from 'src/configs/api'
import instanceAxios from 'src/helpers/axios'
import { TLoginAuth, TRegisterAuth, TypeChangePassword } from 'src/types/auth'

export const loginAuth = async (data: TLoginAuth) => {
  const res = await axios.post(`${API_ENDPOINT.AUTH.INDEX}/login`, data)

  return res.data
}
export const logoutAuth = async () => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.AUTH.INDEX}/logout`)

    return res.data
  } catch (error) {
    return null
  }
}
export const registerAuth = async (data: TRegisterAuth) => {
  try {
    const res = await axios.post(`${API_ENDPOINT.AUTH.INDEX}/register`, data)

    return res.data
  } catch (error) {
    return error
  }
}
export const updateAuthMe = async (data: any) => {
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.AUTH.INDEX}/me`, data)

    return res.data
  } catch (error) {
    return error
  }
}
export const getAuthMe = async () => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.AUTH.INDEX}/me`)

    return res.data
  } catch (error) {
    return error
  }
}
export const changePasswordMe = async (data: TypeChangePassword) => {
  try {
    const res = await instanceAxios.patch(`${API_ENDPOINT.AUTH.INDEX}/change-password`, data)

    return res.data
  } catch (error) {
    return error
  }
}
export const loginAuthGoogle = async (idToken: string) => {
  const res = await axios.post(`${API_ENDPOINT.AUTH.INDEX}/login-google`, { idToken })

  return res.data
}
export const registerAuthGoogle = async (idToken: string) => {
  const res = await axios.post(`${API_ENDPOINT.AUTH.INDEX}/register-google`, { idToken })

  return res.data
}
export const registerAuthFacebook = async (idToken: string) => {
  try {
    const res = await axios.post(`${API_ENDPOINT.AUTH.INDEX}/register-facebook`, { idToken })

    return res.data
  } catch (error) {
    return error
  }
}
export const loginAuthFacebook = async (data: { idToken: string; deviceToken?: string }) => {
  const res = await axios.post(`${API_ENDPOINT.AUTH.INDEX}/login-facebook`, data)

  return res.data
}
