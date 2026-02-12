import { Box, Grid, TextField } from '@mui/material'
import Select from '../../../../components/ui/Select'
import UserLocationsSelect from '../../../../components/ui/Select/UserLocationsSelect'

export default function PlantingRecordHeader(props) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={9} />
                <Grid item xs={3}>
                    <TextField
                        label="Doc Num"
                        value={props.id}
                        disabled
                    />
                </Grid>

                <Grid item xs={9}></Grid>

                <Grid item xs={9}></Grid>
                <Grid item xs={3}>
                    <Select
                        label="Safra"
                        list={props.cropsList}
                        value={props.data?.U_B2AG_Crop}
                        setState={(newValue) => {
                            props.setField("U_B2AG_Crop", newValue)
                        }}
                    />
                </Grid>

                <Grid item xs={3}>
                    <UserLocationsSelect
                        label="Unidade de Produção"
                        value={props.data.Location}
                        setState={(newValue) => {
                            props.setField("Location", newValue)
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}