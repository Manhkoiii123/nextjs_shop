export const toFullName = (lastName: string, middleName: string, firstName: string, language: string) => {
  if (language === 'vi') {
    return `${lastName ? lastName : ''} ${middleName ? middleName : ''} ${firstName ? firstName : ''}`.trim()
  } else {
    return `${firstName ? firstName : ''} ${middleName ? middleName : ''} ${lastName ? lastName : ''}`.trim()
  }
}

export const convertBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })

export const seporationFullname = (fullname: string, language: string) => {
  const res = {
    firstName: '',
    middleName: '',
    lastName: ''
  }

  //dựa vào khoảng cách để lấy các fN, mN.lN
  const arrFullname = fullname.trim().split(' ')?.filter(Boolean) //bỏ đi các cái dấu cách ảo ở trong tên ví dụ giữa chữ a  b có 2 dấu cách
  if (arrFullname.length === 1) {
    if (language === 'vi') {
      res.firstName = arrFullname[0]
    } else if (language === 'en') {
      res.lastName = arrFullname[0]
    }
  } else if (arrFullname.length === 2) {
    if (language === 'vi') {
      //case nguyễn khánh => lastname = khánh
      res.firstName = arrFullname[1]
      res.lastName = arrFullname[0]
    } else if (language === 'en') {
      res.firstName = arrFullname[0]
      res.lastName = arrFullname[1]
    }
  } else if (arrFullname.length >= 3) {
    if (language === 'vi') {
      res.firstName = arrFullname[arrFullname.length - 1]
      res.lastName = arrFullname[0]
      res.middleName = arrFullname.slice(1, arrFullname.length - 1).join(' ')
    } else if (language === 'en') {
      res.firstName = arrFullname[0]
      res.lastName = arrFullname[arrFullname.length - 1]
      res.middleName = arrFullname.slice(1, arrFullname.length - 1).join(' ')
    }
  }

  return res
}

// viết hàm mà lúc mà ấn vào cái PRODUCT => sẽ chọn hết các cái như create,update edit của nó
//tham số thứ 2 để truyền các cái ko muốn lấy vào
// hàm này chạy thế nào
// nó sẽ lặp qua các cái key của obj truyền vào
// nếu mà cái phần tử đó trong obj (obj[key] là 1 obj) => chạy đệ quy (1)
// nếu ko thì nó check xem trong đó có trong arE ko => ok (2)
// nếu ko có thì sẽ đẩy vào values
// khi push cái obj[key] của trường hợp (2) => nó sẽ put cả cái mảng gồm các cái này của cái obj[key] đó vào
// ví dụ
//  PERMISSIONS.MANAGE_PRODUCT.PRODUCT.CREATE,
//  PERMISSIONS.MANAGE_PRODUCT.PRODUCT.UPDATE,
//  PERMISSIONS.MANAGE_PRODUCT.PRODUCT.DELETE,
export const getAllValueObject = (obj: any, arrExclude?: string[]) => {
  try {
    const values: string[] = []
    if (typeof obj === 'object') {
      for (const key in obj) {
        if (typeof obj[key] === 'object') {
          // có cái con (ví dụ xét đến cái system => trong cái key đó lại là cái obj => lại gọi đệ quy đến hàm đó)
          values.push(...getAllValueObject(obj[key], arrExclude))
        } else {
          if (!arrExclude?.includes(obj[key])) {
            values.push(obj[key]) //ko là obj mà nó là string
          }
        }
      }
    } else {
      //nếu là string thì push vào luôn => case dashboard
      values.push(obj)
    }

    return values
  } catch (error) {
    return []
  }
}

// viết hàm để format filter nhiều cái 1 lúc => ý tuwoogrn theo api yêu cầu
// ví dụ [a,b,c] => a|b|c
// nó tổng quát luôn cho cả {
//   a:[a,b,c],
//   b,
//   c
// }
export const formatFilter = (filter: any) => {
  const res: Record<string, string[] | string> = {}
  Object.keys(filter)?.forEach((key: string) => {
    if (Array.isArray(filter[key]) && filter[key].length > 0) {
      res[key] = filter[key].join('|')
    } else if (filter[key]) {
      // là chuỗi
      res[key] = filter[key]
    }
  })

  return res
}
export const stringToSlug = (str: string) => {
  // remove accents
  const from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ',
    to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy'
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], 'gi'), to[i])
  }

  //
  str = str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-')

  return str
}
