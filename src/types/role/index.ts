export type TParamsGetRoles = {
  limit?: number
  page?: number
  search?: string
  order?: string
}
export type TParamsCreateRoles = {
  name: string
}
export type TParamsEditRoles = {
  name: string
  id: string
}
export type TParamsDeleteRoles = {
  id: string
}
