import { NextPage } from 'next'
import { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layout/LayoutNotApp'
import MyOrderDetailPage from 'src/views/pages/my-order/DetailOrder'

type TProps = {}

const MyCart: NextPage<TProps> = () => {
  return <MyOrderDetailPage />
}
export default MyCart
MyCart.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
