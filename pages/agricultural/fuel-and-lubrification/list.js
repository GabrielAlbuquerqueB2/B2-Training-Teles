import { useState, useEffect } from 'react'
import PageHeader from '../../../components/ui/PageHeader'
import FuelAndLubrificationGrid from '../../../features/agricultural/fuel-and-lubrification/FuelAndLubrificationGrid'
import FuelAndLubrificationListFilters from '../../../features/agricultural/fuel-and-lubrification/FuelAndLubrificationListFilters'
import { getFuelInventoryGenExits } from '../../../features/agricultural/fuel-and-lubrification/FuelAndLubrificationsServices'
import getTranslation from '../../../locales/getTranslation'

export default function FuelAndLubrificationList() {

    const t = getTranslation()
    const [data, setData] = useState([])
    const [filters, setFilters] = useState({})
    const [initialLoad, setInitialLoad] = useState(true)

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]
        const lastDays = new Date();
        lastDays.setTime(lastDays.getTime() - 15 * 24 * 60 * 60 * 1000);
        const lastDaysString = lastDays.toISOString().split('T')[0]
        setFilters({
            initalDate: lastDaysString,
            finalDate: today
        })
    }, [])

    useEffect(() => {
        async function fetchData() {
            if (!filters.initalDate || !filters.finalDate || !initialLoad) return

            const branches = sessionStorage.getItem('Branches')
            const branchesArray = JSON.parse(branches)           
            const branchIds = branchesArray.map((item => {
                return item.BusinessPlaces.BPLID
            }))
            const uniqueBranchList = [...new Set(branchIds)]
            const exits = await getFuelInventoryGenExits(uniqueBranchList, filters)
            const mappedObject = exits.map(item => {
                return {
                    DocEntry: item.InventoryGenExits.DocEntry,
                    DocNum: item.InventoryGenExits.DocNum,
                    DocDate: item.InventoryGenExits.DocDate,
                    Comments: item.InventoryGenExits.Comments,
                    U_B2AG_Crop: item.InventoryGenExits.U_B2AG_Crop,
                    U_B2AG_Equipment: item.InventoryGenExits.U_B2AG_Equipment,
                    U_B2AG_Odometer: item.InventoryGenExits.U_B2AG_Odometer,
                    U_B2AG_Operator: item.InventoryGenExits.U_B2AG_Operator,
                    ItemCode: item["InventoryGenExits/DocumentLines"].ItemCode,
                    ItemDescription: item["InventoryGenExits/DocumentLines"].ItemDescription,
                    Quantity: item["InventoryGenExits/DocumentLines"].Quantity,
                    Warehouse: item.Warehouses.WarehouseName
                }
            })
            setData(mappedObject)
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
        <>
            <PageHeader
                title={t["app.agricultural.fuel-and-lubrification.list"]}
            />
            <FuelAndLubrificationListFilters
                filters={filters}
                setField={setField}
                setData={setData}
            />
            <br />
            <FuelAndLubrificationGrid
                data={data}
            />
        </>
    )
}