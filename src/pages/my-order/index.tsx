import { NextPage } from 'next'
import { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layout/LayoutNotApp'
import MyOrderPage from 'src/views/pages/my-order'

type TProps = {}

const MyCart: NextPage<TProps> = () => {
  return <MyOrderPage />
}
export default MyCart
MyCart.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
