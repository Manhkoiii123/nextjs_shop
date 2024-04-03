import { createAsyncThunk } from '@reduxjs/toolkit'
import { getAllRoles } from 'src/services/role'
import { TParamsGetRoles } from 'src/types/role'

export const getAllRoleAsync = createAsyncThunk('/role/get-all', async (data: { params: TParamsGetRoles }) => {
  const res = await getAllRoles(data)

  return res
})
