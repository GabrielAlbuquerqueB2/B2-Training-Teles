import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { TextField, Box } from '@mui/material'
import AlertMessage from '../../../../components/ui/AlertMessage'
import PageHeader from '../../../../components/ui/PageHeader'

import { getAllCrops, getWarehouses } from '../../../../features/agricultural/operations/seed-treatment/SeedTreatmentServices'
import SeedTreatmentHeader from '../../../../features/agricultural/operations/seed-treatment/SeedTreatmentHeader'
import SeedTreatmentGrid from '../../../../features/agricultural/operations/seed-treatment/SeedTreatmentGrid'
import SeedTreatmentActions from '../../../../features/agricultural/operations/seed-treatment/SeedTreatmentActions'


export default function SeedTreatment() {

  const router = useRouter()
  const id = router.query.id

  const [statusList] = useState([
    { value: 'boposClosed', description: 'Fechado' },
    { value: 'boposPlanned', description: 'Planejado' },
    { value: 'boposReleased', description: 'Liberado' },
    { value: 'boposCancelled', description: 'Cancelado' },
  ])

  const [data, setData] = useState({ DocumentLines: [{}] })
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' })
  const [cropsList, setCropsList] = useState([])
  const [status, setStatus] = useState('CREATE')
  const [productionUnitsList, setProductionUnitsList] = useState([])
  const [warehousesList, setWarehousesList] = useState([])

  useEffect(() => {
    async function fetchData() {
      const crops = await getAllCrops()
      setCropsList(crops)
    }
    fetchData()
  }, [id])

  async function setFields(fields, values) {
    let newData = { ...data };
    for (let i = 0; i < fields.length; i++) {
      newData[fields[i]] = values[i];
    }
    setData(newData);
  }

  function setField(field, newValue) {
    let newData = { ...data }
    newData[field] = newValue
    setData(newData)
  }

  function setChildField(father, field, index, newValue) {
    let newData = { ...data }
    newData[father][index][field] = newValue
    setData(newData)
  }

  function handleNewLine() {
    let newData = { ...data }
    newData.DocumentLines.push({ Item: '' })
    setData(newData)
  }

  function handleDeleteLine(index) {
    if (data.DocumentLines.length <= 1) return;
    let newData = { ...data }
    newData.DocumentLines.splice(index, 1)
    setData(newData)
  }

  return (
    <>
      <PageHeader title="Tratamento de Sementes" />

      <SeedTreatmentHeader
        data={data}
        setField={setField}
        getWarehouses={getWarehouses}
        setWarehousesList={setWarehousesList}
        warehousesList={warehousesList}
        cropsList={cropsList}
        productionUnitsList={productionUnitsList}
        statusList={statusList}
        status={status}
        
      />

      <br />

      <SeedTreatmentGrid
        data={data}
        setChildField={setChildField}
        handleNewLine={handleNewLine}
        handleDeleteLine={handleDeleteLine}
        status={status}
      />

      <br />

      <SeedTreatmentActions
        data={data}
        status={status}
        router={router}
        setAlert={setAlert}
      />

      <br />
      <Box hidden={!alert.visible}>
        <AlertMessage
          alertOpen={alert.visible}
          setAlertOpen={setAlert}
          type={alert.type}
          message={alert.message}
        />
      </Box>
    </>
  )
}