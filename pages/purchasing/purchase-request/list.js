import { useState, useEffect } from 'react'
import PageHeader from '../../../components/ui/PageHeader'
import getTranslation from '../../../locales/getTranslation'
import PurchaseRequestList from '../../../features/purchasing/purchase-request/PurchaseRequestList'
import PurchaseRequestListFilters from '../../../features/purchasing/purchase-request/PurchaseRequestListFilters'
import { getAllPurchaseRequests } from '../../../features/purchasing/purchase-request/PurchaseRequestServices'

export default function PurchaseRequestGrid() {

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
            const purchaseRequests = await getAllPurchaseRequests(uniqueBranchList, filters)         
            setData(purchaseRequests)
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
                title={'Solicitações de Compras'}
            />
            <PurchaseRequestListFilters
                filters={filters}
                setField={setField}
                setData={setData}
            />
            <br />
            <PurchaseRequestList
                data={data}
            />
        </>
    )
}