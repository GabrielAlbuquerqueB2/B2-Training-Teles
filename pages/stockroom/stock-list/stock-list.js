import { useState, useEffect } from 'react'
import PageHeader from '../../../components/ui/PageHeader'
import StockListGrid from '../../../features/stockroom/stock-list/StockListGrid'
import StockListFilter from '../../../features/stockroom/stock-list/StockListFIlter'
import { getInventoryStock } from '../../../features/stockroom/stock-list/StockListServices'
import getTranslation from '../../../locales/getTranslation'

export default function StockList() {

    const t = getTranslation()
    const [data, setData] = useState([])

    useEffect(() => {
        async function fetchData() {
            const stock = await getInventoryStock()
            const mappedObject = stock.map(item => {
                return {
                    ItemCode: item.Items.ItemCode,
                    ItemName: item.Items.ItemName,
                    Warehouse: item.Warehouses.WarehouseName,
                    InStock: item["Items/ItemWarehouseInfoCollection"].InStock
                }
            })
            setData(mappedObject)
        }
        fetchData()
    }, [])

    return (
        <>
            <PageHeader
                title="Lista de Estoque"

            />
            <StockListFilter />
            <StockListGrid
                data={data}
            />
        </>
    )
}