export type TParamsGetUsers = {
  limit?: number
  page?: number
  search?: string
  order?: string
}
export type TParamsCreateUser = {
  name: string
}
export type TParamsEditUser = {
  name: string
  id: string
  permissions?: string[]
}
export type TParamsDeleteUser = {
  id: string
}
