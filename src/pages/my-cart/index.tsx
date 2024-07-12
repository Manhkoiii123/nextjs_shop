import { NextPage } from 'next'
import { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layout/LayoutNotApp'
import MyCardPage from 'src/views/pages/my-cart'

type TProps = {}

const MyCart: NextPage<TProps> = () => {
  return <MyCardPage />
}
export default MyCart
MyCart.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
