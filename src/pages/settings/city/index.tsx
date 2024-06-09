import { NextPage } from 'next'
import { PERMISSIONS } from 'src/configs/permissions'
import CityListPage from 'src/views/pages/settings/city/CityList'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <CityListPage />
}
Index.permission = [PERMISSIONS.SETTING.CITY.VIEW]
export default Index
