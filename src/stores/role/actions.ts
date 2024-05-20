import { createAsyncThunk } from '@reduxjs/toolkit'
import { getAllRoles } from 'src/services/role'
import { TParamsGetRoles } from 'src/types/role'

export const getAllRolesAsync = createAsyncThunk('role/get-all', async (data: { params: TParamsGetRoles }) => {
  const response = await getAllRoles(data)

  return response
})
