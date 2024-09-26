# Zalopay

vào vnpay developer => vào đăng kí test `https://sandbox.vnpayment.vn/devreg`

tài liệu hướng dẫn có gửi kèm theo mail

Sau khi đăng kí tài khoản thì có mail gửi về => 2 mail

- 1 mail có thông tin về tài khoản
- 1 mail có thông tin về api key và secret key

![alt text](image.png)

khai báo api (services/payments) => khia báo trong env có url khi thanh toán thành công => tạo pages/payment/index.tsx

# next auth

dự án này trên email manhtd@paditech.com => create => api & services

=> vào oauth conse..... => extenal => tieps tục save and continue

=> vào credential => create credential => oauth client=> điền cái redireact origins.. => `http://localhost:3000/api/auth/callback/google` => ra keys

khi đăng nahapaj bằng fb => client call 1 api đến fb => fb trả về nhiều cái trong đó có accToken => cầm cái aT đó gọi lên server => server call lên fb 1 lần nữa xem có hợp lệ hay ko => nếu có => trả về tt user cho server => lưu vào db (với sign up)

=> vấn đề tại sao client call đến fb rồi fb trả tt user rồi mà ko gửi lên cho server luôn => tại sao lại cần validate lần nữa => bảo mật thôi

## setup next auth

docs `https://next-auth.js.org/getting-started/example`

yarn add next auth

làm theo docs đã => TẠO ENV => ok base setup

## Xử lý đăng nhập, đăng ký với Google (OAuth)

## setup cho đăng nhập đăng kí fb

vào fb dev (meta for dev) => ud của tôi => tạo ud => xác thực yêu cầu...=> OK => import trong nexxtauth.ts

vào cái vừa tạo trên fb dev => chọn web vừa tạo => cài đặt ứng dụng => tt cơ bản => copi id
