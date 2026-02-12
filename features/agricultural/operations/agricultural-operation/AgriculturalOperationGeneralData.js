import { useState, useEffect } from 'react'
import { Box, Grid, Typography, TextField } from '@mui/material'
import Select from '../../../../components/ui/Select'
import { getAllCrops, getAllOperations } from './AgriculturalOperationServices'

export default function AgriculturalOperationGeneralData(props) {

    const [crops, setCrops] = useState([])
    const [operations, setOperations] = useState([])

    useEffect(() => {
        async function getData() {
            const cropsList = await getAllCrops()
            setCrops(cropsList)
        }
        getData()
    }, [])

    useEffect(() => {
        async function getData() {
            const operationsList = await getAllOperations()
            setOperations(operationsList)
        }
        getData()
    }, [])

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant='h6'>Dados Gerais</Typography>
                </Grid>
                <Grid item xs={9}></Grid>
                <Grid item xs={3}>
                    <TextField
                        label="TransId"
                        value={props.data.U_B2AG_TransId}
                        disabled
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Data Inicial"
                        type="date"
                        value={props.data.U_B2AG_InitialDate}
                        onChange={(event) => {
                            props.setField('U_B2AG_InitialDate', event.target.value)
                        }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Hora Inicial"
                        type="time"
                        value={props.data.U_B2AG_InitialHour}
                        onChange={(event) => {
                            props.setField('U_B2AG_InitialTime', event.target.value)
                        }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Data Final"
                        type="date"
                        value={props.data.U_B2AG_FinalDate}
                        onChange={(event) => {
                            props.setField('U_B2AG_FinalDate', event.target.value)
                        }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Hora Final"
                        type="time"
                        value={props.data.U_B2AG_FinalHour}
                        onChange={(event) => {
                            props.setField('U_B2AG_FinalTime', event.target.value)
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Select
                        name="U_B2AG_AgriOperation"
                        label="Operação"
                        list={operations}
                        value={props.data.U_B2AG_AgriOperation}
                        setState={props.setField}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="RDA"
                        type="text"
                        value={props.data.U_RDA}
                        onChange={(event) => {
                            props.setField('U_RDA', event.target.value)
                        }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Select
                        name="U_B2AG_Crop"
                        label="Safra"
                        list={crops}
                        value={props.data.U_B2AG_Crop}
                        setState={props.setField}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Observação"
                        multiline
                        rows={3}
                        value={props.data.Comments}
                        onChange={(event) => {
                            props.setField('Comments', event.target.value)
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}