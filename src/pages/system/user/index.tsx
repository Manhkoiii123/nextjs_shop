import { NextPage } from 'next'
import { PERMISSIONS } from 'src/configs/permissions'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <h1>User</h1>
}
Index.permission = [PERMISSIONS.SYSTEM.USER.VIEW]
export default Index
