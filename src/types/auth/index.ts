export type TLoginAuth = {
  email: string
  password: string
}
export type TRegisterAuth = {
  email: string
  password: string
}
export type TypeChangePassword = {
  currentPassword: string
  newPassword: string
}

export type TForgotPasswordAuth = {
  email: string
}

export type TResetPasswordAuth = {
  newPassword: string
  secretKey: string
}
