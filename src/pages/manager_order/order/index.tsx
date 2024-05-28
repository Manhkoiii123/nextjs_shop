import { NextPage } from 'next'
import { PERMISSIONS } from 'src/configs/permissions'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <h1>list order</h1>
}
Index.permission = [PERMISSIONS.MANAGER_ORDER.ORDER.VIEW]
export default Index
