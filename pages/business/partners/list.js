import { useState, useEffect } from 'react'
import PageHeader from '../../../components/ui/PageHeader'
import BusinessPartnersList from '../../../features/business/partners/BusinessPartnersList'
import BusinessPartnersListFilters from '../../../features/business/partners/BusinessPartnersListFilters'
import { getAllBusinessPartners } from '../../../features/business/partners/BusinessPartnersServices'

export default function BusinessPartnersListPage() {

    const [data, setData] = useState([])
    const [filters, setFilters] = useState({})
    const [initialLoad, setInitialLoad] = useState(true)

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]
        const lastDays = new Date()
        lastDays.setTime(lastDays.getTime() - 15 * 24 * 60 * 60 * 1000)
        const lastDaysString = lastDays.toISOString().split('T')[0]
        setFilters({
            initialDate: lastDaysString,
            finalDate: today
        })
    }, [])

    useEffect(() => {
        async function fetchData() {
            if (!filters.initialDate || !filters.finalDate || !initialLoad) return

            const businessPartners = await getAllBusinessPartners(filters)
            setData(businessPartners)
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
                title={'Parceiros de Negócios'}
            />
            <BusinessPartnersListFilters
                filters={filters}
                setField={setField}
                setData={setData}
            />
            <br />
            <BusinessPartnersList
                data={data}
            />
        </>
    )
}