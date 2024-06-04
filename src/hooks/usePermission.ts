import { useEffect, useState } from 'react'
import { PERMISSIONS } from 'src/configs/permissions'
import { useAuth } from 'src/hooks/useAuth'
//tham số thứ 2 là các cái actios cần check quyền

type TActions = 'VIEW' | 'UPDATE' | 'CREATE' | 'DELETE'
export const usePermission = (key: string, actions: TActions[]) => {
  const { user } = useAuth()
  const defaultValue = {
    VIEW: false,
    CREATE: false,
    UPDATE: false,
    DELETE: false
  }

  // hàm này để lấy ra các quyền trong PERMISS ban đầu
  // ví dụ truyền cái role => thì lấy ra được cái đó
  //ý tưởng
  // lúc truyền lên cái SYSTEM.ROLE => tacash nó ra thành system và role
  // lặp qua cái keys đó => đầu tiên là res = obj ban đầu
  // lần lặp đầu tiên lấy ra được cái mảng chứa obj[SYSTEM]
  // lần thứ 2 => lấy được cái obj[ROLE]=> là đã lấy được cái crud trong permission cho sẵn
  // luồng chạy
  // lấy ra cái perUser của user đố có quyền  = use Auth
  // dùng 1 cái useEFf
  // trong đây
  // lấy ra cái mapPermission từ cái getObjectValue
  // lặp qua cái actions => mỗi cái là 1 cái mode
  // nếu mà cái pU là admin => bật all cái mapP[mode] => laf true
  // nếu ko phải là admin => check cái userP mà chứa cái mapP[mode] => bật cái đó là true, còn ko là false
  //

  const getObjectValue = (obj: any, key: string) => {
    const keys = key.split('.')
    let res = obj
    if (keys && !!keys.length) {
      // check xem cái key có nằm trong cái object PERMISS của mình ko
      for (const k of keys) {
        //console.log({ res, k }) // (1)
        if (k in res) {
          // (1)
          // nếu có trong cái obj kia thì gán cái res lại thành cái phần tử k trong res ban đầu
          res = res[k]
        } else {
          return undefined
        }
      }
    }

    return res
  }
  const userPermission = user?.role?.permissions
  const [permission, setPermission] = useState(defaultValue)
  useEffect(() => {
    const mapPermission = getObjectValue(PERMISSIONS, key)
    actions.forEach(mode => {
      if (userPermission?.includes(PERMISSIONS.ADMIN)) {
        defaultValue[mode] = true //admin thì bật hết mode crud lên thành true
      } else if (userPermission?.includes(mapPermission[mode])) {
        //truy cập vào cái view | edit... của cái mapP
        // nếu mà cái userPer có chứa cái
        defaultValue[mode] = true
      } else {
        defaultValue[mode] = false
      }
    })
    setPermission(defaultValue)
  }, [userPermission])

  return permission
  // cái key sẽ là SYSTEM.ROLE => dựa vào dấu . để tách thành 1 cái aray
}

// (1)
// lúc đầu alf cái PERMI hiện tại
// lặp lần đầu tiên k = SYSTEM => res = res [SYSTEM] => là cái SYSTEM trog mảng PERMI ban đầu
// lặp lần thứ 2 => k = ROLE => nếu mà có => res = res[ROLE] => cái res[SYSTEM][ROLE] lúc này là cái => là cái mảng ROLE trong cái PERMISSION ban đầu => lấy ra được các quyền view eidt hay create => nhah
// sau vòng lặp đó thì cái res này là các cái quyền mà người dùng đang đăng nhập có thể sử dụng
