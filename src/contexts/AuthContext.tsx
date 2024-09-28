// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Config
import authConfig, { LIST_PAGE_PUBLIC } from 'src/configs/auth'

// ** Types
import {
  AuthValuesType,
  LoginParams,
  ErrCallbackType,
  UserDataType,
  LoginGoogleParams,
  LoginFacebookParams
} from './types'
import { loginAuth, loginAuthFacebook, loginAuthGoogle, logoutAuth } from 'src/services/auth'
import { API_ENDPOINT } from 'src/configs/api'
import {
  clearLocalRememberLoginAuthSocial,
  clearLocalUserData,
  setLocalUserData,
  setTemporaryToken
} from 'src/helpers/storage'
import instanceAxios from 'src/helpers/axios'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { updateProductToCard } from 'src/stores/order-product'
import { ROUTE_CONFIG } from 'src/configs/route'
import { signOut } from 'next-auth/react'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  loginGoogle: () => Promise.resolve(),
  loginFacebook: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  ///khi f5 se chya cai nay để call get auth me
  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(true)
        await instanceAxios
          .get(API_ENDPOINT.AUTH.AUTH_ME)
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.data })
          })
          .catch(() => {
            clearLocalUserData()
            setUser(null)
            setLoading(false)
            //nếu mà đang ở 1 trang nào ko phải login => đá về trang login khi ch đăng nhập
            if (!router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    loginAuth({ email: params.email, password: params.password })
      .then(async response => {
        if (params.rememberMe) {
          setLocalUserData(JSON.stringify(response.data.user), response.data.access_token, response.data.refresh_token)
        } else {
          setTemporaryToken(response.data.access_token)
        }
        toast.success(t('login_successfull'))
        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.user })

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
      })

      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLoginGoogle = (params: LoginGoogleParams, errorCallback?: ErrCallbackType) => {
    loginAuthGoogle(params.idToken)
      .then(async response => {
        if (params.rememberMe) {
          setLocalUserData(JSON.stringify(response.data.user), response.data.access_token, response.data.refresh_token)
        } else {
          setTemporaryToken(response.data.access_token)
        }
        toast.success(t('login_successfull'))
        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.user })

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
      })

      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }
  const handleLoginFacebook = (params: LoginFacebookParams, errorCallback?: ErrCallbackType) => {
    loginAuthFacebook({ idToken: params.idToken, deviceToken: params.deviceToken })
      .then(async response => {
        if (params.rememberMe) {
          setLocalUserData(JSON.stringify(response.data.user), response.data.access_token, response.data.refresh_token)
        } else {
          setTemporaryToken(response.data.access_token)
        }

        toast.success(t('Login_success'))

        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.user })
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
      })

      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    logoutAuth().then(res => {
      setUser(null)
      clearLocalUserData()
      clearLocalRememberLoginAuthSocial()
      signOut()
      // nếu mà ko phải các trang public thì logout sẽ đá ra các trang khác
      // nếu đang ở các trang public thì vẫn ở nguyên trang đó
      //ví dụ đang ở home logout ra thì vẫn phải ở home
      // nếu check thế này thì cái list_page này phải đổi cái url của cái home page thành /home
      // do all router đều bắt đầu bằng '/'

      // ví dụ từ /my-order mà logout ra => as path sẽ là /my-order nó vẫn ăn cái startWith '/' => cái if đầu trả về true => loading mãi
      if (!LIST_PAGE_PUBLIC.some(item => router.asPath?.startsWith(item))) {
        if (router.asPath !== '/') {
          router.replace({
            pathname: ROUTE_CONFIG.LOGIN,
            query: { returnUrl: router.asPath }
          })
        } else {
          router.replace(ROUTE_CONFIG.LOGIN)
        }
      }
      // router.push(router.asPath)
      dispatch(
        updateProductToCard({
          orderItems: []
        })
      )
    })
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    loginGoogle: handleLoginGoogle,
    loginFacebook: handleLoginFacebook
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
