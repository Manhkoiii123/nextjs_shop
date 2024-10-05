import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import Spinner from 'src/components/spinner'
import { getCountAllRecords, getCountProductStatus } from 'src/services/report'
import CardCountRecords from 'src/views/pages/dashboard/components/CardCountRecord'

const Dashboardpage = () => {
  const [loading, setLoading] = useState(false)
  const [countRecords, setCountRecords] = useState<Record<string, number>>({} as any)
  //fetch api
  const fetchAllCountProductStatus = async () => {
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
  useEffect(() => {
    fetchAllCountProductStatus()
  }, [])

  return (
    <Box>
      {loading && <Spinner />}
      <CardCountRecords data={countRecords} />
    </Box>
  )
}

export default Dashboardpage
