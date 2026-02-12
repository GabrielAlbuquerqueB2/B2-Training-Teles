import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import getTranslation from '../../../locales/getTranslation'
import PageHeader from '../../../components/ui/PageHeader'
import WarehouseExitGeneralData from '../../../features/stockroom/warehouse-exit/WarehouseExitGeneralData'
import WarehouseExitItems from '../../../features/stockroom/warehouse-exit/WarehouseExitItems'
import WarehouseExitActions from '../../../features/stockroom/warehouse-exit/WarehouseExitActions'
import AlertMessage from '../../../components/ui/AlertMessage'
import {
    getAllProductionUnits, getWarehousesByLocation, getEquipmentTypes, getAllCrops, getFuelOrLubrificationTypes, 
    getProfitCentersInFirstDimension
} from '../../../features/stockroom/warehouse-exit/WarehouseExitServices'

export default function WarehouseExit() {

    const router = useRouter()
    const id = router.query.id
    const t = getTranslation()

    const [alert, setAlert] = useState({ visible: false, type: '', message: '' })

    const [data, setData] = useState({DocumentLines: [{}]})
    const [productionUnits, setProductionUnits] = useState([])
    const [warehouses, setWarehouses] = useState([])
    const [equipmentTypes, setEquipmentTypes] = useState([])
    const [equipment, setEquipment] = useState('')
    const [employee, setEmployee] = useState('')
    const [crops, setCrops] = useState([])
    const [types, setTypes] = useState([])
    const [profitCenters, setProfitCenters] = useState([])

    useEffect(() => {
        async function getData() {
            const result = await getAllProductionUnits()
            setProductionUnits(result)
        }
        getData()
    }, [])

    useEffect(() => {
        async function getData() {
            if (data.ProductionUnitCode) {
                const result = await getWarehousesByLocation(data.ProductionUnitCode)
                setWarehouses(result)
            }
        }
        getData()
    }, [data.ProductionUnitCode])

    useEffect(() => {
        if(data.Warehouse) {
            const bplid = warehouses.filter(whs => {                
                return whs.value === data.Warehouse
            })
            setField('BPLId', bplid[0].BusinessPlaceID)
        }
    }, [data.Warehouse])

    useEffect(() => {
        setEquipmentTypes(getEquipmentTypes())
    }, [])

    useEffect(() => {
        async function getData() {
            const cropsList = await getAllCrops()
            setCrops(cropsList)
        }
        getData()
    }, [])


    useEffect(() => {
        setTypes(getFuelOrLubrificationTypes())
    }, [])

    useEffect(() => {
        async function getData() {
            const profitCentersList = await getProfitCentersInFirstDimension()
            setProfitCenters(profitCentersList)
        }
        getData()
    }, [])

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

    return (
        <>
            <PageHeader
                title="Saída de Almoxarifado"
            />
            <WarehouseExitGeneralData
                data={data}
                setField={setField}
                productionUnits={productionUnits}
                warehouses={warehouses}
                equipmentTypes={equipmentTypes}
                equipment={equipment}
                setEquipment={setEquipment}
                employee={employee}
                setEmployee={setEmployee}
                crops={crops}
                types={types}
                profitCenters={profitCenters}
            />
            <WarehouseExitItems 
                data={data}
                warehouses={warehouses}                           
                setChildField={setChildField}
                handleNewLine={handleNewLine}
                handleDeleteLine={handleDeleteLine}
            />
            <br />
            <WarehouseExitActions
                data={data}
                setField={setField}
                equipment={equipment}
                employee={employee}
                setAlert={setAlert}
                router={router}
            />
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