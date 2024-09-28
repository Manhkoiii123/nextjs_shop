// ** React Imports
import { useSession } from 'next-auth/react'
import { ReactElement, ReactNode, useEffect } from 'react'
import { clearLocalRememberLoginAuthSocial, clearTemporaryToken } from 'src/helpers/storage'
import { useAuth } from 'src/hooks/useAuth'

interface NoGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const NoGrard = (props: NoGuardProps) => {
  // ** Props
  const { children, fallback } = props
  const auth = useAuth()
  const { status } = useSession()
  useEffect(() => {
    const handleUnload = () => {
      if (status !== 'loading') {
        clearTemporaryToken()
        clearLocalRememberLoginAuthSocial()
      }
    }
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [])

  if (auth.loading) {
    return fallback
  }

  return <>{children}</>
}

export default NoGrard
