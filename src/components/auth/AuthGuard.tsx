/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useRouter } from 'next/router'
import { ReactNode, ReactElement, useEffect } from 'react'
import { ACCESS_TOKEN, USERDATA } from 'src/configs/auth'
import { clearLocalUserData } from 'src/helpers/storage'
import { useAuth } from 'src/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}
//những trang mà chưa đăng nhập thì ko vòa được phải login trước đã
//page mà có authG = true
const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const authContext = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!router.isReady) {
      // khi chuyển trang mà cái trang nó first render rồi => thì cái isRE = true
      return
    }
    if (
      // lúc đầu kể cả đăng nhập rồi thì cái authC.user nó luôn là null
      //sau đó mới xét lại là có dl nếu đăg nhập rồi
      //vì vậy cần check thêm 2 cái điều kiện sau nữa cho chắc
      authContext.user === null &&
      !window.localStorage.getItem(ACCESS_TOKEN) &&
      !window.localStorage.getItem(USERDATA)
    ) {
      //nếu đang ở /profile mà f5 lại actoken hết hạn đá sang login
      //login lại thì phải quay lại /profile
      if (router.asPath !== '/') {
        router.replace({
          pathname: '/login',
          //cái query này để xử lí bên cái authCOntext có cái returnUrl khi login => đã setup chứ ko phỉa nó tự chạy sang
          query: { returnUrl: router.asPath }
        })
      } else {
        //chưa đăng nhập đá sang login và đang ở trang home luôn
        router.replace('/login')
      }
      //khi đã sang trang login thì phair xóa đi thôi
      authContext.setUser(null)
      clearLocalUserData()
    }
  }, [router.route])

  //nếu mỗi xử lí như trên thì khi mà chưa login mà vào trang /aaa => vẫn hiện ra cái ui của /aaa trong 1 thời gian
  //dưới đây sẽ xử lí
  if (authContext.loading || authContext.user === null) return fallback

  return <>{children}</>
}

export default AuthGuard
