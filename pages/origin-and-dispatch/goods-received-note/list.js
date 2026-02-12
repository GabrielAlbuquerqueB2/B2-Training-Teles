import { useState, useEffect } from 'react'
import PageHeader from '../../../components/ui/PageHeader'
import GoodsReceivedNoteGrid from '../../../features/origin-and-dispatch/goods-received-note/GoodsReceivedNoteGrid'
import GoodsReceivedNoteListFilters from '../../../features/origin-and-dispatch/goods-received-note/GoodsReceivedNoteListFilters'
import { getAllGoodsReceivedNotesWithDetails } from '../../../features/origin-and-dispatch/goods-received-note/GoodsReceivedNoteServices'
import getTranslation from '../../../locales/getTranslation'

export default function GoodsReceivedNoteList() {

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
            
            const GoodsReceivedNotes = await getAllGoodsReceivedNotesWithDetails(filters)          
            setData(GoodsReceivedNotes)
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
                title={t["app.origin-and-dispatch.goods-received-note.list"]}
            />
            <GoodsReceivedNoteListFilters
                filters={filters}
                setField={setField}
                setData={setData}
            />
            <br />
            <GoodsReceivedNoteGrid
                data={data}
            />
        </>
    )
}