import axios from 'axios'
import { BASE_URL, API_ENDPOINT } from 'src/configs/api'
import {
  clearLocalUserData,
  clearTemporaryToken,
  getLocalUserData,
  getTemporaryToken,
  setLocalUserData,
  setTemporaryToken
} from '../storage'
import { jwtDecode } from 'jwt-decode'
import { FC } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { UserDataType } from 'src/contexts/types'
import { useAuth } from 'src/hooks/useAuth'

type TAxiosInterceptor = {
  children: React.ReactNode
}

const handleRedirectLogin = (router: NextRouter, setUser: (data: UserDataType | null) => void) => {
  if (router.asPath !== '/') {
    router.replace({
      pathname: '/login',
      query: { returnUrl: router.asPath }
    })
  } else {
    router.replace('/login')
  }
  setUser(null)
  clearLocalUserData()
  clearTemporaryToken()
}

const instanceAxios = axios.create({ baseURL: BASE_URL })
// đưa vào 1 cái hàm để dùng được các cái hook như useRouter
const AxiosInterceptor: FC<TAxiosInterceptor> = ({ children }) => {
  const router = useRouter()
  const { setUser, user } = useAuth()

  // cái api nào vừa dùng ở public vừa dùng ở private như cái detail
  // 2 th 1 là tính số view => private ( cần acct) còn xem chi tiết của khách vãng lai
  // thêm cái ispublic vòa lúc truyền lên
  // nếu mà có accT || tem thì chạy với config  có acc
  // còn neeys ko có thì chia tiếp làm 2 tf
  // có isPub => return cofig ban đầu tức là ko gửi kém acc lên
  // ếu mà ko có cái ispub Nốt thì mới đá về login

  instanceAxios.interceptors.request.use(async config => {
    const { accessToken, refreshToken } = getLocalUserData() //để luôn lấy cái mới nhất token
    const { temporaryToken } = getTemporaryToken()
    const isPublicApi = config?.params?.isPublic
    if (accessToken || temporaryToken) {
      let decodeAccessToken: any = {}
      if (accessToken) {
        decodeAccessToken = jwtDecode(accessToken)
      } else if (temporaryToken) {
        //isMem = fase
        decodeAccessToken = jwtDecode(temporaryToken)
      }
      //check xem còn accToken thời hạn ko
      if (decodeAccessToken.exp > Date.now() / 1000) {
        config.headers['Authorization'] = `Bearer ${accessToken ? accessToken : temporaryToken}`
      } else {
        // hết hạn acc => gọi api ref để lấy lại acc token mới
        if (refreshToken) {
          const decodeRefreshToken: any = jwtDecode(refreshToken)
          //còn hạn refToken
          if (decodeRefreshToken.exp > Date.now() / 1000) {
            //call api ở đây để lấy
            await axios
              .post(
                `${API_ENDPOINT.AUTH.INDEX}/refresh-token`,
                {}, //data
                {
                  headers: {
                    Authorization: `Bearer ${refreshToken}`
                  }
                }
              )
              .then(res => {
                const newAccessToken = res?.data?.data?.access_token
                if (newAccessToken) {
                  config.headers['Authorization'] = `Bearer ${newAccessToken}`
                  if (accessToken) {
                    setLocalUserData(JSON.stringify(user), newAccessToken, refreshToken)
                  }
                } else {
                  //ko trả về acc mới
                  handleRedirectLogin(router, setUser)
                }
              })
              .catch(err => {
                handleRedirectLogin(router, setUser)
              })
          } else {
            // hết hạn refToken thì đá về login
            handleRedirectLogin(router, setUser)
          }
        } else {
          //ko có refToken
          handleRedirectLogin(router, setUser)
        }
      }
    } else if (!isPublicApi) {
      //ko có acctoken
      handleRedirectLogin(router, setUser)
    }

    return config
  })

  instanceAxios.interceptors.response.use(response => {
    return response
  })

  return <>{children}</>
}

export default instanceAxios
export { AxiosInterceptor }
