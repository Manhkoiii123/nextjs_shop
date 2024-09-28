import { NextPage } from 'next'
import { ReactNode } from 'react'
import BlankLayout from 'src/views/layout/BlankLayout'
import ResetPasswordPage from 'src/views/pages/reset-password'

type TProps = {}

const ResetPassword: NextPage<TProps> = () => {
  return <ResetPasswordPage />
}

export default ResetPassword

ResetPassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
ResetPassword.guestGuard = true
