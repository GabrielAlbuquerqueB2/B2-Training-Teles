import { useState, useEffect } from 'react'
import PageHeader from '../../../components/ui/PageHeader'
import PurchaseDeliveryNotesList from '../../../features/purchasing/purchase-delivery-notes/PurchaseDeliveryNotesList'
import PurchaseDeliveryNotesListFilters from '../../../features/purchasing/purchase-delivery-notes/PurchaseDeliveryNotesListFilters'
import { getAllPurchaseDeliveryNotesByBranches } from '../../../features/purchasing/purchase-delivery-notes/PurchaseDeliveryNotesServices'

export default function PurchaseDeliveryNotesGrid() {

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
            const purchaseDeliveryNotes = await getAllPurchaseDeliveryNotesByBranches(uniqueBranchList, filters)  
            setData(purchaseDeliveryNotes)
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
                title={'Recebimentos de Mercadorias'}
            />
            <PurchaseDeliveryNotesListFilters
                filters={filters}
                setField={setField}
                setData={setData}
            />
            <br />
            <PurchaseDeliveryNotesList
                data={data}
            />
        </>
    )
}