import { NextPage } from 'next'
import { PERMISSIONS } from 'src/configs/permissions'
import RoleListPage from 'src/views/pages/system/role/RoleList'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <RoleListPage></RoleListPage>
}
//1
Index.permission = [PERMISSIONS.SYSTEM.ROLE.VIEW]
export default Index
