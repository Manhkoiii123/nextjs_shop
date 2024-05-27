import { NextPage } from 'next'
import { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layout/LayoutNotApp'
import ProfilePage from 'src/views/pages/profile'

type TProps = {}

const MyProfile: NextPage<TProps> = () => {
  return <ProfilePage />
}
export default MyProfile
MyProfile.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
//