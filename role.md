đầu tiên là vào app
thì có cái

```ts
const authGuard = Component.authGuard ?? true

const guestGuard = Component.guestGuard ?? false
```

khi đó sử dụng

```ts
Login.guestGuard = true
```

khi đó tức là cái nào đã đăng nhập rồi thì ko vào được cái trang login của mình nữa chỉ vào được khi chưa đăng nhập

=> khi đó qua cái app thấy có cái cái compoent bọc ngoài có cái guard

```ts
const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<FallbackSpinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <NoGrard fallback={<FallbackSpinner />}>{children}</NoGrard>
  } else {
    return <AuthGuard fallback={<FallbackSpinner />}>{children}</AuthGuard>
  }
}
```

cái fallback là cái spiner

---

## Luồng guest guard (trang ko cần đăng nhập, đăng nhập r thì ko cho vào)

khi đó vào cái GuestGuard => check nếu mà có ACCTOKEN rồi mà vào cái trang có GG = true(ví dụ Login.guestGuard = true) => thì đá về trang home (ko cho vào lại nữa)

---

## Luồng auth guard (phải login mới được vào)

để mặc định là true

khi cái authg = true,gg=false => rơi vào case này

```ts
return <AuthGuard fallback={<FallbackSpinner />}>{children}
```

check là nếu user =null || token chưa có => đá về login

nếu path!==home trả về thêm 1 cái returnUrl nữa để back về cái đấy luôn

ko thì return về /login luôn

---

## vào AclGuard

trong này check phân quyền cho thằng user => sau khi đã đi qua AG và GG rồi thì qua đây để phần quyền như bước bảo mật cuối của app

```ts
// ** React Imports
import { ReactNode } from 'react'

// ** Types
import { buildAbilityFor, type ACLObj, AppAbility } from 'src/configs/acl'
import BlankLayout from 'src/views/layout/BlankLayout'
import NotAuthorized from 'src/pages/401'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import { AbilityContext } from '../acl/Can'
import { PERMISSIONS } from 'src/configs/permissions'

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean
  guestGuard?: boolean
  aclAbilities: ACLObj
  permission?: string[]
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard = false, authGuard = true, permission } = props
  const router = useRouter()
  const auth = useAuth()
  //
  const permissionUser = auth.user?.role?.permissions
    ? auth.user?.role?.permissions.includes(PERMISSIONS.BASIC)
      ? [PERMISSIONS.DASHBOARD] // nếu có quyền basic thì phải thêm cái dash vào
      : auth.user?.role?.permissions //per của người dùng đang đăng nhập
    : [] //nếu ko có thì trả về mảng []
//biến này check có quyền ko
  let ability: AppAbility
  if (auth.user && !ability) {
    ability = buildAbilityFor(permissionUser, permission)
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
```

cái này là cái page có quyền gì

```ts
Index.permission = [PERMISSIONS.SYSTEM.USER.VIEW]
```

bên cái app có cái

```ts
<AclGuard
    permission={permission}
    aclAbilities={aclAbilities}
    guestGuard={guestGuard}
    authGuard={authGuard}
>
    {getLayout(<Component {...pageProps} />)}
</AclGuard>
```

cái permission lấy từ các cái

```ts
Index.permission = [PERMISSIONS.SYSTEM.USER.VIEW]
```

này ra

---

Còn 1 cái là NoG thì ko có quyền gì cũng được vào => như trang home
