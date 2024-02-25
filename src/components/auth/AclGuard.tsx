// ** React Imports
import { ReactNode } from 'react'

// ** Types
import { buildAbilityFor, type ACLObj, AppAbility } from 'src/configs/acl'
import BlankLayout from 'src/views/layout/BlankLayout'
import NotAuthorized from 'src/pages/401'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import { AbilityContext } from '../acl/Can'

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean
  guestGuard?: boolean
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard = false, authGuard = true } = props
  const router = useRouter()
  const auth = useAuth()
  const permissionUser = auth.user?.role.permissions ?? []
  let ability: AppAbility
  if (auth.user && !ability) {
    ability = buildAbilityFor(permissionUser, aclAbilities.subject)
  }
  // console.log(ability) //đọc sẽ ko hiểu gì đâu =)) do nó ở dnagj map
  //khi trả về thăng casl => sử dụng cái ab.can để check quyền

  //nếu guestG or ko đăng nhập và những pge lỗi thì ko cần phân quyền
  if (guestGuard || router.route === '/500' || router.route === '/404' || !authGuard) {
    //ko cần phải check quyền
    if (auth.user && ability) {
      //đã đnhap và đã build quyền rồi
      return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    } else {
      //chưa đăng nhập và ch có ab => thì ch có quyền để mà check như trên
      return children
    }
  }

  // những cái cần check quyền
  if (ability && auth.user && ability.can(aclAbilities.action, aclAbilities.subject)) {
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  return (
    <BlankLayout>
      <NotAuthorized></NotAuthorized>
    </BlankLayout>
  )
}

export default AclGuard
