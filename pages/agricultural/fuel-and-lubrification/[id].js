import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import getTranslation from '../../../locales/getTranslation'
import AlertMessage from '../../../components/ui/AlertMessage'
import PageHeader from '../../../components/ui/PageHeader'
import FuelAndLubrificationGeneralData from '../../../features/agricultural/fuel-and-lubrification/FuelAndLubrificationGeneralData'
import FuelAndLubrificationActions from '../../../features/agricultural/fuel-and-lubrification/FuelAndLubrificationActions'
import { Box } from '@mui/material'
import {
    getAllProductionUnits, getWarehousesByLocation, getEquipmentTypes, getAllCrops, getAllCultivations,
    getFuelOrLubrificationTypes, getProfitCentersInFirstDimension, getItemInStockInWarehouse
} from '../../../features/agricultural/fuel-and-lubrification/FuelAndLubrificationsServices'

export default function FuelAndLubrification() {

    const router = useRouter()
    const id = router.query.id
    const t = getTranslation()

    const [data, setData] = useState({})
    const [productionUnits, setProductionUnits] = useState([])
    const [warehouses, setWarehouses] = useState([])
    const [equipmentTypes, setEquipmentTypes] = useState([])
    const [equipment, setEquipment] = useState('')
    const [employee, setEmployee] = useState('')
    const [crops, setCrops] = useState([])
    const [cultivations, setCultivations] = useState([])
    const [types, setTypes] = useState([])
    const [item, setItem] = useState('')
    const [inStock, setInStock] = useState('')
    const [profitCenters, setProfitCenters] = useState([])
    const [alert, setAlert] = useState({ visible: false, type: '', message: '' })

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
                const result = await getWarehousesByLocation(data.ProductionUnitCode, data.Type)
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
        async function getData() {
            const cultivationsList = await getAllCultivations()
            setCultivations([{value: '', description: '-'}, ...cultivationsList])
        }
        getData()
    }, [])

    useEffect(() => {
        setTypes(getFuelOrLubrificationTypes())
    }, [])

    useEffect(() => {
        async function getData() {
            if (item && data?.Warehouse) {
                const onHand = await getItemInStockInWarehouse(item?.id, data?.Warehouse)
                setInStock(onHand)
            }
        }
        getData()
    }, [item?.id, data.Warehouse])

    useEffect(() => {
        async function getData() {
            const profitCentersList = await getProfitCentersInFirstDimension()
            setProfitCenters(profitCentersList)
        }
        getData()
    }, [])

    function setField(field, newValue) {
        let newData = { ...data }
        newData[field] = newValue
        setData(newData)
    }
    

    return (
        <>
            <PageHeader
                title="Abastecimento e Lubrificação"
            />
            <FuelAndLubrificationGeneralData
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
                cultivations={cultivations}
                types={types}
                profitCenters={profitCenters}
                item={item}
                inStock={inStock}
                setItem={setItem}
            />
            <br />
            <FuelAndLubrificationActions
                data={data}
                equipment={equipment}
                employee={employee}
                item={item}
                router={router}
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
        </>
    )
}