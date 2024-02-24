/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useRouter } from 'next/router'
import { ReactNode, ReactElement, useEffect } from 'react'
import { ACCESS_TOKEN, USERDATA } from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}
//user đã đăng nhập trước thì ko cho vào lại
//đã đn thì ko cho login signup nữa
const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props
  const authContext = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!router.isReady) {
      return
    }
    //check đã đnhăp bằng local
    if (window.localStorage.getItem(ACCESS_TOKEN) && window.localStorage.getItem(USERDATA)) {
      router.replace('/')
    }
  }, [router.route])

  if (authContext.loading) return fallback

  return <>{children}</>
}

export default GuestGuard
