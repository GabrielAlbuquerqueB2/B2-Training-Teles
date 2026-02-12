import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import getTranslation from '../../../../locales/getTranslation'
import { Box, Grid } from '@mui/material'
import AlertMessage from '../../../../components/ui/AlertMessage'
import PageHeader from '../../../../components/ui/PageHeader'
import AgriculturalOperationGeneralData from '../../../../features/agricultural/operations/agricultural-operation/AgriculturalOperationGeneralData'
import AgriculturalOperationArea from '../../../../features/agricultural/operations/agricultural-operation/AgriculturalOperationArea'
import AgriculturalOperationItems from '../../../../features/agricultural/operations/agricultural-operation/AgriculturalOperationItems'
import AgriculturalOperationActions from '../../../../features/agricultural/operations/agricultural-operation/AgriculturalOperationActions'
import { getAllProductionUnits } from '../../../../features/agricultural/operations/agricultural-operation/AgriculturalOperationServices'


export default function AgriculturalOperation() {

    const router = useRouter()
    const id = router.query.id
    const t = getTranslation()

    const [data, setData] = useState({DocumentLines: [{}]})
    const [status, setStatus] = useState('CREATE')
    const [alert, setAlert] = useState({ visible: false, type: '', message: '' })
    const [productionUnits, setProductionUnits] = useState([])
    const [fields, setFields] = useState([])
    const [warehouses, setWarehouses] = useState([])

    useEffect(() => {
        const transId = new Date().getTime()
        setField('U_B2AG_TransId', transId)
    }, [])

    useEffect(() => {
        async function getData() {
            const productionUnitsList = await getAllProductionUnits()
            setProductionUnits(productionUnitsList)
        }
        getData()
    }, [])

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
        if(data.DocumentLines.length <= 1) return;
        let newData = { ...data }
        newData.DocumentLines.splice(index, 1)
        setData(newData)
    }

    return (
        <>
            <PageHeader
                title={t["app.agricultural.operation"]}
            />
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <AgriculturalOperationGeneralData 
                            data={data}
                            setField={setField}                            
                            setFields={setFields}                            
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <AgriculturalOperationArea 
                            data={data}
                            setFields={setFields}
                            setField={setField}
                            productionUnits={productionUnits}       
                            setWarehouses={setWarehouses}               
                            fields={fields}      
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <AgriculturalOperationItems 
                            data={data}
                            warehouses={warehouses}
                            fields={fields}                            
                            setChildField={setChildField}
                            handleNewLine={handleNewLine}
                            handleDeleteLine={handleDeleteLine}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <AgriculturalOperationActions 
                            data={data}
                            status={status}
                            warehouses={warehouses}
                            setAlert={setAlert}                       
                        />
                    </Grid>
                </Grid>
                <br/>
            </Box>
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