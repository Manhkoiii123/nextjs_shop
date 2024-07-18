import { NextPage } from 'next'
import { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layout/LayoutNotApp'
import CheckoutProductPage from 'src/views/pages/checkout-product'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <CheckoutProductPage />
}
export default Index
Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
