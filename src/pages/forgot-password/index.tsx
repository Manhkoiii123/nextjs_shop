import { NextPage } from 'next'
import { ReactNode } from 'react'
import BlankLayout from 'src/views/layout/BlankLayout'
import ForgotPasswordPage from 'src/views/pages/forgot-pasword'

type TProps = {}

const ForgotPassword: NextPage<TProps> = () => {
  return <ForgotPasswordPage />
}

export default ForgotPassword

ForgotPassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
ForgotPassword.guestGuard = true
