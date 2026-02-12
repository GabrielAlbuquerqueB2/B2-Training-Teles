import { useState, useEffect } from 'react'
import PageHeader from '../../../../components/ui/PageHeader'
import TransferDeliveryNotesGrid from '../../../../features/agricultural/stock-transfer/transfer-delivery-notes/TransferDeliveryNotesGrid'
import TransferDeliveryNotesFilters from '../../../../features/agricultural/stock-transfer/transfer-delivery-notes/TransferDeliveryNotesFilters'
import { getOpenTransferOrders } from '../../../../features/agricultural/stock-transfer/transfer-delivery-notes/TransferDeliveryNotesServices'
import getTranslation from '../../../../locales/getTranslation'

export default function TransferDeliveryNotesOpenOrdens() {

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
            
            const openTransferOrders = await getOpenTransferOrders(filters)            
            setData(openTransferOrders)
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
                title={'Seleção de Ordem de Transferência'}
            />
            <TransferDeliveryNotesFilters
                filters={filters}
                setField={setField}
                setData={setData}
            />
            <br />
            <TransferDeliveryNotesGrid 
                data={data}
            />
        </>
    )
}