import { useState, useEffect } from 'react'
import PageHeader from '../../../../components/ui/PageHeader'
import InventoryTransferRequestGrid from '../../../../features/agricultural/stock-transfer/inventory-transfer-request/InventoryTransferRequestGrid'
import InventoryTransferRequestListFilters from '../../../../features/agricultural/stock-transfer/inventory-transfer-request/InventoryTransferRequestListFilters'
import { getInventoryTransferRequest } from '../../../../features/agricultural/stock-transfer/inventory-transfer-request/InventoryTransferRequestServices'
import getTranslation from '../../../../locales/getTranslation'

export default function InventoryTransferRequestList() {

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
            
            const stock = await getInventoryTransferRequest(filters)
            const mappedObject = stock.map(item => {
                return {
                    DocEntry: item.DocEntry,
                    DocNum: item.DocNum,
                    DocDate: item.DocDate,
                    FromWarehouse: item.FromWarehouse,
                    ToWarehouse: item.ToWarehouse,
                    BPLName: item.BPLName,
                    Comments: item.Comments,
                    Item: item.StockTransferLines[0].ItemDescription
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
                title={t["app.agricultural.fuel-and-lubrification.list-stock"]}
            />
            <InventoryTransferRequestListFilters
                filters={filters}
                setField={setField}
                setData={setData}
            />
            <br />
            <InventoryTransferRequestGrid
                data={data}
            />
        </>
    )
}