import { useState, useEffect } from 'react'
import getTranslation from '../../../../locales/getTranslation'
import PageHeader from '../../../../components/ui/PageHeader'
import { getAllWeatherNote } from '../../../../features/agricultural/field-control/weather-note/WeatherNoteServices'
import WeatherNoteList from '../../../../features/agricultural/field-control/weather-note/WeatherNoteList'
import WeatherNoteListFilters from '../../../../features/agricultural/field-control/weather-note/WeatherNoteListFilters'
import { getUserLocations } from '../../../../utils/getUserLocationsByAssignment'

export default function ListWeatherNote() {
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
            const result = await getAllWeatherNote(locations, filters)
            const mappedObject = result.map(item => {
                return {
                    DocEntry: item.WeatherNote.DocEntry,
                    DocNum: item.WeatherNote.DocNum,
                    Status: item.WeatherNote.Status,
                    Canceled: item.WeatherNote.Canceled,
                    U_B2AG_RegisterDate: item.WeatherNote.U_B2AG_RegisterDate,
                    U_B2AG_Comments: item.WeatherNote.U_B2AG_Comments,
                    U_B2AG_PostId: item.WeatherNote.U_B2AG_PostId,
                    U_B2AG_Element: item["WeatherNote/B2AG_WSN1Collection"].U_B2AG_Element,
                    U_B2AG_Value: item["WeatherNote/B2AG_WSN1Collection"].U_B2AG_Value,
                    U_B2AG_ProductionUnitCode: item.WeatherStation.U_B2AG_ProductionUnitCode,
                    Name: item.WeatherStation.Name
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
                title={t["app.agricultural.field-control.weather-note-list"]}
            />
            <WeatherNoteListFilters
                filters={filters}
                setField={setField}
                setData={setData}
            />
            <br />
            <WeatherNoteList
                data={data}
            />
        </>
    )
}