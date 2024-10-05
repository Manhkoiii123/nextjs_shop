import { Box, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import Spinner from 'src/components/spinner'
import { getAllProducts } from 'src/services/product'
import {
  getCountAllRecords,
  getCountOrderStatus,
  getCountProductStatus,
  getCountProductTypes,
  getCountRevenueYear,
  getCountUserType
} from 'src/services/report'
import CardCountRecords from 'src/views/pages/dashboard/components/CardCountRecord'
import CardCountRevenue from 'src/views/pages/dashboard/components/CardCountRevenue'
import CardCountOrderStatus from 'src/views/pages/dashboard/components/CardCountStatusOrder'
import CardCountUserType from 'src/views/pages/dashboard/components/CardCountUserType'
import CardProductPopular from 'src/views/pages/dashboard/components/CardProductPopular'
import CardProductType from 'src/views/pages/dashboard/components/CardProductTypes'

export interface TCountProductType {
  typeName: string
  total: number
}
export interface TCountRevenue {
  year: string
  month: string
  total: number
}
export interface TProductPopular {
  name: string
  price: string
  image: string
  slug: string
  _id: string
  type: {
    name: string
  }
}

const Dashboardpage = () => {
  const [loading, setLoading] = useState(false)
  const [countRecords, setCountRecords] = useState<Record<string, number>>({} as any)
  const [countProductTypes, setcountProductTypes] = useState<TCountProductType[]>([])
  const [countRevenues, setCountRevenues] = useState<TCountRevenue[]>([])
  const [countOrderStatus, setCountOrderStatus] = useState<Record<number, number>>({} as any)
  const [countUserType, setCountUserType] = useState<Record<number, number>>({} as any)
  const [listProductPopular, setListProductPopular] = useState<TProductPopular[]>([])

  //fetch api
  const fetchAllCountRecord = async () => {
    setLoading(true)
    await getCountAllRecords()
      .then(res => {
        const data = res?.data
        setLoading(false)
        setCountRecords(data)
      })
      .catch(e => {
        setLoading(false)
      })
  }
  //bnh sản phẩm thuộc từng loại
  const fetchAllProductTypes = async () => {
    setLoading(true)
    await getCountProductTypes()
      .then(res => {
        const data = res?.data
        setLoading(false)
        setcountProductTypes(data)
      })
      .catch(e => {
        setLoading(false)
      })
  }
  const fetchAllTotalRevenues = async () => {
    setLoading(true)
    await getCountRevenueYear()
      .then(res => {
        const data = res?.data
        setLoading(false)
        setCountRevenues(data)
      })
      .catch(e => {
        setLoading(false)
      })
  }
  const fetchAllCountStatusOrder = async () => {
    setLoading(true)
    await getCountOrderStatus()
      .then(res => {
        const data = res?.data
        setLoading(false)
        setCountOrderStatus(data?.data)
      })
      .catch(e => {
        setLoading(false)
      })
  }
  const fetchAllCountUserType = async () => {
    setLoading(true)
    await getCountUserType()
      .then(res => {
        const data = res?.data
        setLoading(false)
        setCountUserType(data?.data)
      })
      .catch(e => {
        setLoading(false)
      })
  }
  const fetchListProductPopular = async () => {
    setLoading(true)
    await getAllProducts({ params: { limit: 5, page: 1, order: 'sold desc' } })
      .then(res => {
        const data = res?.data
        setLoading(false)
        setListProductPopular(data?.products)
      })
      .catch(e => {
        setLoading(false)
      })
  }
  useEffect(() => {
    fetchAllCountRecord()
    fetchAllProductTypes()
    fetchAllTotalRevenues()
    fetchAllCountStatusOrder()
    fetchAllCountUserType()
    fetchListProductPopular()
  }, [])

  return (
    <Box>
      {loading && <Spinner />}
      <CardCountRecords data={countRecords} />
      <Grid container spacing={6}>
        <Grid item md={6} xs={12}>
          <CardProductType data={countProductTypes} />
        </Grid>
        <Grid item md={6} xs={12}>
          <CardCountRevenue data={countRevenues} />
        </Grid>
        <Grid item md={4} xs={12}>
          <CardProductPopular data={listProductPopular} />
        </Grid>
        <Grid item md={4} xs={12}>
          <CardCountUserType data={countUserType} />
        </Grid>
        <Grid item md={4} xs={12}>
          <CardCountOrderStatus data={countOrderStatus} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboardpage
