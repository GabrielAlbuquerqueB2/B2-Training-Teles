import { useState, useEffect } from 'react'
import { Box, Grid, TextField } from '@mui/material'
import Select from '../../../../components/ui/Select'
import { getWeatherStationByCode, mapDataToSelectComponent, getAllProductionUnits, getWeatherStationByLocation, mapWeatherStationToSelectComponent, getAllWeatherStation } from './WeatherNoteServices'
import  UserLocationsSelect  from '../../../../components/ui/Select/UserLocationsSelect'

export default function WeatherNoteHeader(props) {
    const [productionUnits, setProductionUnits] = useState([])
    const [weatherStations, setWeatherStations] = useState([])

    useEffect(() => {
        async function getData() {
            const productionUnits = await getAllProductionUnits()
            setProductionUnits(productionUnits)
        }
        getData()
    }, [])

    useEffect(() => {
        if (props.id !== 'new' && props.id) {
            async function getData() {
                const allWeatherStation = await getAllWeatherStation(props.data.U_B2AG_ProductionUnitCode)
                setWeatherStations(allWeatherStation)
            }
            getData()
        }
    }, [props.id])

    async function handleProductionUnitSelect() {
        const allWeatherStation = await getWeatherStationByLocation(props.data.U_B2AG_ProductionUnitCode)
        const weatherStationList = await mapWeatherStationToSelectComponent(allWeatherStation)
        setWeatherStations(weatherStationList)
    }

    async function handleWeatherStationSelect() {
        const ws = await getWeatherStationByCode(props.data.U_B2AG_PostId)
        props.setField('B2AG_WSN1Collection', ws.B2AG_WST1Collection)
    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={9} />
                    <Grid item xs={3}>
                        <TextField
                            label="Doc Num"
                            value={props.data.DocNum}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={9} />
                    <Grid item xs={3}>
                        <TextField
                            label="Status"
                            value={props.data.Status}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={9} />
                    <Grid item xs={3}>
                        <TextField
                            label="Data do Registro"
                            type="date"
                            value={props.data.U_B2AG_RegisterDate}
                            onChange={(event) => {
                                props.setField('U_B2AG_RegisterDate', event.target.value)
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <UserLocationsSelect
                            name="U_B2AG_ProductionUnitCode"
                            label="Unidade de Produção"
                            value={props.data.U_B2AG_ProductionUnitCode}
                            setState={props.setField}
                            onBlur={handleProductionUnitSelect}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Select
                            name="U_B2AG_PostId"
                            label="Posto"
                            list={weatherStations}
                            value={props.data.U_B2AG_PostId}
                            setState={props.setField}
                            onBlur={handleWeatherStationSelect}
                        />
                    </Grid>

                </Grid>
            </Box>
        </>
    )

}