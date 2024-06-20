// ** Import Next
import { NextPage } from 'next'
import ProductTypeListPage from 'src/views/pages/manage-product/product-type/ProductTypeList'

// ** Pages

// ** Config

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <ProductTypeListPage />
}

// Index.permission = [PERMISSIONS.MANAGE_PRODUCT.PRODUCT_TYPE.VIEW]
export default Index
