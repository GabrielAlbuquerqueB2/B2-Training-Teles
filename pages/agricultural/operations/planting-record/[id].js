import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PageHeader from '../../../../components/ui/PageHeader'
import AlertMessage from '../../../../components/ui/AlertMessage'
import { getYearMonthDateFormat } from '../../../../utils/formatDate'
import PlantingRecordHeader from "../../../../features/agricultural/operations/planting-record/PlantingRecordHeader"
import PlantingRecordActions from '../../../../features/agricultural/operations/planting-record/PlantingRecordActions'
import { getAllCrops } from '../../../../features/agricultural/operations/planting-record/PlantingRecordServices'

export default function PlantingRecord() {
    const router = useRouter()
    const id = router.query.id

    const [data, setData] = useState({})
    const [status, setStatus] = useState('CREATE')
    const [cropsList, setCropsList] = useState([])
    const [alert, setAlert] = useState({ visible: false, type: '', message: '' })


    useEffect(() => {
        async function fetchData() {
            const crops = await getAllCrops()
            setCropsList(crops)
        }
        fetchData()
    }, [id])

    function setField(field, newValue) {
        let newData = { ...data }
        newData[field] = newValue
        setData(newData)
    }

    return (
        <>
            <PageHeader title='Registro de Plantio' />

            {/* <PlantingRecordHeader
                data={data}
                id={id}
                setField={setField}
                cropsList={cropsList}
                status={status}
            /> */}
            
            <PlantingRecordActions
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