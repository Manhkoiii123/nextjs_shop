import { NextPage } from 'next'
import { PERMISSIONS } from 'src/configs/permissions'
import OrderProductListPage from 'src/views/pages/manage-order/order-product/OrderProductList'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <OrderProductListPage />
}
Index.permission = [PERMISSIONS.MANAGE_ORDER.ORDER.VIEW]
export default Index
