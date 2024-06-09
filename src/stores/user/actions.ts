import { createAsyncThunk } from '@reduxjs/toolkit'
import { createUser, deleteMultipleUser, deleteUser, getAllUser, updateUser } from 'src/services/user'
import {
  TParamsCreateUser,
  TParamsDeleteMultipleUser,
  TParamsDeleteUser,
  TParamsEditUser,
  TParamsGetUsers
} from 'src/types/user'

export const serviceName = 'user'

export const getAllUserAsync = createAsyncThunk(`${serviceName}/get-all`, async (data: { params: TParamsGetUsers }) => {
  const response = await getAllUser(data)

  return response
})
export const updateUserAsync = createAsyncThunk(`${serviceName}/update`, async (data: TParamsEditUser) => {
  const response = await updateUser(data)

  return response
})
export const createUserAsync = createAsyncThunk(`${serviceName}/create`, async (data: TParamsCreateUser) => {
  const response = await createUser(data)

  return response
})
export const deleteUserAsync = createAsyncThunk(`${serviceName}/delete`, async (id: string) => {
  const response = await deleteUser(id)

  return response
})
export const deleteMultipleUserAsync = createAsyncThunk(
  `${serviceName}/delete-multiple`,
  async (data: TParamsDeleteMultipleUser) => {
    const response = await deleteMultipleUser(data)

    return response
  }
)
