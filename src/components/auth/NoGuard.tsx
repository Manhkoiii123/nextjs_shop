// ** React Imports
import { ReactElement, ReactNode } from 'react'
import { useAuth } from 'src/hooks/useAuth'

interface NoGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const NoGrard = (props: NoGuardProps) => {
  // ** Props
  const { children, fallback } = props
  const auth = useAuth()
  if (auth.loading) {
    return fallback
  }

  return <>{children}</>
}

export default NoGrard
