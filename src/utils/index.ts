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
