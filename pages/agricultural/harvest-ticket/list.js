import { useState, useEffect } from 'react'
import PageHeader from '../../../components/ui/PageHeader'
import HarvestTicketGrid from '../../../features/agricultural/harvest-ticket/HarvestTicketGrid'
import HarvestTicketListFilters from '../../../features/agricultural/harvest-ticket/HarvestTicketListFilters'
import { getAllHarvestTicketsWithDetails } from '../../../features/agricultural/harvest-ticket/HarvestTicketServices'
import getTranslation from '../../../locales/getTranslation'
import { getUserLocations } from '../../../utils/getUserLocationsByAssignment'

export default function HarvestTicketList() {

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
            
            const locations = getUserLocations().map((item => item.Code))
            const harvestTickets = await getAllHarvestTicketsWithDetails(locations, filters)         
            setData(harvestTickets)
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
                title={t["app.agricultural.harvest-ticket.list"]}
            />
            <HarvestTicketListFilters
                filters={filters}
                setField={setField}
                setData={setData}
            />
            <br />
            <HarvestTicketGrid
                data={data}
            />
        </>
    )
}