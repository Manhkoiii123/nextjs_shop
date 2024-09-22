// ** Import Next
import { NextPage } from 'next'
import { ReactNode } from 'react'
import BlankLayout from 'src/views/layout/BlankLayout'
import LayoutNotApp from 'src/views/layout/LayoutNotApp'
import PaymentVNPay from 'src/views/pages/payment/vnpay'

// ** views

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <PaymentVNPay />
}

export default Index
Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
