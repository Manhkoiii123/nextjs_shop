import { API_ENDPOINT } from 'src/configs/api'
import instanceAxios from 'src/helpers/axios'

export const getCountOrderStatus = async () => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.REPORT.INDEX}/order-status/count`)

    return res.data
  } catch (error) {
    return error
  }
}
