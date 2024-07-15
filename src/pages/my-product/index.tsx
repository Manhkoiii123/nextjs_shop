import { NextPage } from 'next'
import { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layout/LayoutNotApp'
import ProductPage from 'src/views/pages/my-product'

type TProps = {}

const MyProfile: NextPage<TProps> = () => {
  return <ProductPage />
}
export default MyProfile
MyProfile.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
