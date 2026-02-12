import { useState, useEffect } from 'react'
import PageHeader from '../../../components/ui/PageHeader'
import PackingListGrid from '../../../features/agricultural/packing-list/PackingListGrid'
import PackingListFilters from '../../../features/agricultural/packing-list/PackingListFilters'
import { getAllPackingList } from '../../../features/agricultural/packing-list/PackingListServices' 
import getTranslation from '../../../locales/getTranslation'

export default function PackingListList() {

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
            
            const packingLists = await getAllPackingList(null, filters)            
            setData(packingLists)
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
                title={t["app.agricultural.packing-list.list"]}
            />
            <PackingListFilters
                filters={filters}
                setField={setField}
                setData={setData}
            />
            <br />
            <PackingListGrid
                data={data}
            />
        </>
    )
}