import { NextPage } from 'next'
import { PERMISSIONS } from 'src/configs/permissions'
import Dashboardpage from 'src/views/pages/dashboard'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <Dashboardpage/>
}
Index.permission = [PERMISSIONS.DASHBOARD]
export default Index
