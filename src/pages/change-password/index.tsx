import { NextPage } from 'next'
import { ReactNode } from 'react'
import BlankLayout from 'src/views/layout/BlankLayout'
import LayoutNotApp from 'src/views/layout/LayoutNotApp'
import ChangePasswordPage from 'src/views/pages/change-pasword'
import LoginPage from 'src/views/pages/login'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <ChangePasswordPage />
}
export default Index
Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
