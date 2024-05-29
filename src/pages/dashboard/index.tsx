import { NextPage } from 'next'
import { PERMISSIONS } from 'src/configs/permissions'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <h1>Dashboard</h1>
}
Index.permission = [PERMISSIONS.DASHBOARD]
export default Index
