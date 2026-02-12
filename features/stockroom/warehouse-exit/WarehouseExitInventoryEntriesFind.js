import { useState, useEffect } from 'react'
import Select from '../../../components/ui/Select/index'
import { getAllPurchaseDeliveryNotes } from './WarehouseExitServices'

export default function WarehouseExitInventoryEntriesFind(props) {

    const [inventoryEntries, setInventoryEntries] = useState([])

    useEffect(() => {
        async function fetchData() {
            const data = await getAllPurchaseDeliveryNotes()
            setInventoryEntries(data)
        }
        fetchData()
    }, [])

    return (
        <>
            <Select 
                list={inventoryEntries}
                value={props.selectedPurchaseDeliveryNote}
                setState={props.setSelectedPurchaseDeliveryNote}
            />
        </>
    )
}