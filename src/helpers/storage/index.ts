import { ACCESS_TOKEN, REFRESH_TOKEN, USERDATA } from 'src/configs/auth'

export const setLocalUserData = (userData: string, accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(USERDATA, userData)
    window.localStorage.setItem(ACCESS_TOKEN, accessToken)
    window.localStorage.setItem(REFRESH_TOKEN, refreshToken)
  }
}
export const getLocalUserData = () => {
  if (typeof window !== 'undefined') {
    return {
      userData: window.localStorage.getItem(USERDATA),
      accessToken: window.localStorage.getItem(ACCESS_TOKEN),
      refreshToken: window.localStorage.getItem(REFRESH_TOKEN)
    }
  }

  return {
    userData: '',
    accessToken: '',
    refreshToken: ''
  }
}
export const clearLocalUserData = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(USERDATA)
    window.localStorage.removeItem(ACCESS_TOKEN)
    window.localStorage.removeItem(REFRESH_TOKEN)
  }
}
