import { Box, Grid, TextField, Typography, Button } from '@mui/material'
import styles from '../../../../components/ui/PageHeader/PageHeader.module.css'
import { getAllWeatherNote } from './WeatherNoteServices'
import { getUserLocations } from '../../../../utils/getUserLocationsByAssignment'

export default function WeatherNoteListFilters(props) {

    async function handleFilter() {
        const locations = getUserLocations().map((item => item.Code))
        const result = await getAllWeatherNote(locations, props.filters)
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
        props.setData(mappedObject)
    }

    return (
        <>
            <Typography variant="h6" className={styles.title}>Filtros</Typography>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <TextField
                            label="Data Inicial"
                            type="date"
                            value={props.filters.initalDate || ''}
                            onChange={evt => props.setField('initalDate', evt.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Data Final"
                            type="date"
                            value={props.filters.finalDate || ''}
                            onChange={evt => props.setField('finalDate', evt.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFilter}
                        >
                            Filtrar
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}