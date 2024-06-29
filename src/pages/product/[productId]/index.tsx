import React, { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layout/LayoutNotApp'
import DetailProductPage from 'src/views/pages/product/detailProduct'

const index = () => {
  return <DetailProductPage></DetailProductPage>
}

export default index
index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
index.guestGuard = true
