import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import PageHeader from '../../components/ui/PageHeader'
import ApprovalRequestsFilters from '../../features/approval-requests/ApprovalRequestsFilters'
import ApprovalRequestsGrid from '../../features/approval-requests/ApprovalRequestsGrid'
import AlertMessage from '../../components/ui/AlertMessage'

export default function ApprovalRequestsList() {

  const [data, setData] = useState([])
  const [filters, setFilters] = useState({})
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' })
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const lastDays = new Date();
    lastDays.setTime(lastDays.getTime() - 15 * 24 * 60 * 60 * 1000);
    const lastDaysString = lastDays.toISOString().split('T')[0]
    setFilters({
      initalDate: lastDaysString,
      finalDate: today,
      status: 'T'
    })
  }, [])

  useEffect(() => {
    async function fetchData() {
      if (!filters.initalDate || !filters.finalDate || !initialLoad) return
      
      const { parseCookies } = require('nookies')
      const { getApprovalRequests } = require('../../features/approval-requests/ApprovalRequestsServices')
      
      const decodedSessionData = JSON.parse(Buffer.from(parseCookies().session, 'base64').toString('ascii'))
      const userId = decodedSessionData.UserInternalKey
      
      const result = await getApprovalRequests(filters, userId)
      setData(result)
      setInitialLoad(false)
    }
    fetchData()
  }, [filters])

  function setField(field, newValue) {
    let newData = { ...filters }
    newData[field] = newValue
    setFilters(newData)
  }

  return (
    <div>
      <PageHeader title="Pedidos de Aprovação" />

      <ApprovalRequestsFilters
        filters={filters}
        setField={setField}
        setData={setData}
      />

      <br />

      <ApprovalRequestsGrid
        data={data}
        setData={setData}
        setAlert={setAlert}
      />

      <Box hidden={!alert.visible}>
        <AlertMessage
          alertOpen={alert.visible}
          setAlertOpen={setAlert}
          type={alert.type}
          message={alert.message}
        />
      </Box>

    </div>
  )
}