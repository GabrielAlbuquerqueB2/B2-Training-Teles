import { useState, useEffect } from 'react'
import { Grid, TextField, Box } from '@mui/material'
import { useRouter } from 'next/router'
import PageHeader from '../../../../components/ui/PageHeader'
import getTranslation from '../../../../locales/getTranslation'
import WeatherNoteHeader from '../../../../features/agricultural/field-control/weather-note/WeatherNoteHeader'
import WeatherNoteActions from '../../../../features/agricultural/field-control/weather-note/WeatherNoteActions'
import WeatherNoteGrid from '../../../../features/agricultural/field-control/weather-note/WeatherNoteGrid'
import { getWeatherNoteById, getProductionUnitByPostId } from '../../../../features/agricultural/field-control/weather-note/WeatherNoteServices'
import AlertMessage from '../../../../components/ui/AlertMessage'
import { getYearMonthDateFormat } from '../../../../utils/formatDate'


export default function WeatherNote() {

    const router = useRouter()
    const id = router.query.id
    const t = getTranslation()

    const [data, setData] = useState({ B2AG_WSN1Collection: [] })
    const [status, setStatus] = useState('CREATE')
    const [alert, setAlert] = useState({ visible: false, type: '', message: '' })

    useEffect(() => {
        async function fetchData() {

            if (id !== 'new' && id) {
                const result = await getWeatherNoteById(id)
                const productionUnitId = await getProductionUnitByPostId(result.U_B2AG_PostId)
                if (result && productionUnitId) {
                    console.log(productionUnitId.U_B2AG_ProductionUnitCode)
                    setData({
                        ...result,
                        U_B2AG_RegisterDate: getYearMonthDateFormat(result.U_B2AG_RegisterDate),
                        U_B2AG_ProductionUnitCode: productionUnitId.U_B2AG_ProductionUnitCode
                    })
                    setStatus('EDIT')
                }
            } else {
                setStatus('CREATE')
            }
        }
        fetchData()
    }, [id])

    function setField(field, newValue) {
        let newData = { ...data }
        newData[field] = newValue
        setData(newData)
    }

    function setChildField(father, field, index, newValue) {
        let newData = { ...data }
        newData[father][index][field] = newValue
        setData(newData)
    }


    return (
        <>
            <PageHeader
                title={t["app.agricultural.field-control.weather-note"]}
            />
            <WeatherNoteHeader
                id={id}
                data={data}
                setField={setField}
            />
            <WeatherNoteGrid
                data={data}
                setField={setField}
                setChildField={setChildField}
            />
            <br />
            <Grid item xs={12}>
                <TextField
                    label="Observação"
                    multiline
                    rows={3}
                    value={data.U_B2AG_Comments}
                    onChange={(event) => {
                        setField('U_B2AG_Comments', event.target.value)
                    }}
                />
            </Grid>
            <br />
            <WeatherNoteActions
                data={data}
                status={status}
                setAlert={setAlert}
                router={router}
            />
            <Box hidden={!alert.visible}>
                <AlertMessage
                    alertOpen={alert.visible}
                    setAlertOpen={setAlert}
                    type={alert.type}
                    message={alert.message}
                />
            </Box>
        </>
    )
}