// ** Import Next
import { NextPage } from 'next'
import { PERMISSIONS } from 'src/configs/permissions'

// ** Pages
import ProductListPage from 'src/views/pages/manage-product/product/ProductList'

// ** Config

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <ProductListPage />
}

Index.permission = [PERMISSIONS.MANAGE_PRODUCT.PRODUCT.VIEW]
export default Index
