import { NextPage } from 'next'
import { PERMISSIONS } from 'src/configs/permissions'
import UserListPage from 'src/views/pages/system/user/UserList'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <UserListPage />
}
Index.permission = [PERMISSIONS.SYSTEM.USER.VIEW]
export default Index
