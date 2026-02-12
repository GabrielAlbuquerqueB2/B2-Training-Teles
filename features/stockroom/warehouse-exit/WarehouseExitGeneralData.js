import { Box, Grid, TextField } from '@mui/material'
import CurrencyTextField from '../../../components/ui/CurrencyTextField'
import Select from '../../../components/ui/Select'
import EquipmentAutocomplete from '../../../components/ui/Autocomplete/EquipmentAutocomplete'
import EmployeeAutocomplete from '../../../components/ui/Autocomplete/EmployeeAutocomplete'

export default function FuelAndLubrificationGeneralData(props) {

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={9}></Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="DocNum"
                            disabled
                            value={props.data.DocNum}
                        />
                    </Grid>
                    <Grid item xs={9}></Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Status"
                            disabled
                            value={props.data.Status}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Data"
                            type="date"
                            value={props.data.Date || ''}
                            onChange={evt => props.setField('Date', evt.target.value)}
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <Select
                            name="ProductionUnitCode"
                            label="Unidade de Produção"
                            list={props.productionUnits}
                            value={props.data.ProductionUnitCode}
                            setState={props.setField}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Select
                            name="EquipmentTypes"
                            label="Tipo de Equipamento"
                            list={props.equipmentTypes}
                            value={props.data.EquipmentTypes}
                            setState={props.setField}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        {
                            props.data.EquipmentTypes === 'P' &&
                            <EquipmentAutocomplete
                                name="Equipamento"
                                value={props.equipment}
                                setValue={props.setEquipment}
                                location={props.data.ProductionUnitCode}
                            />
                        }
                        {
                            props.data.EquipmentTypes !== 'P' &&
                            <TextField                                
                                label="Equipamento"
                                value={props.equipment}
                                onChange={evt => props.setEquipment(evt.target.value)}
                            />
                        }
                    </Grid>
                    <Grid item xs={3}>
                        <CurrencyTextField
                            label="Odômetro/Horímetro"
                            value={props.data.Odometer}
                            onChange={(evt, newValue) => props.setField('Odometer', newValue)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <EmployeeAutocomplete
                            name="Operador"
                            value={props.Employee}
                            setValue={props.setEmployee}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Select
                            name="Crop"
                            label="Safra"
                            list={props.crops}
                            value={props.data.Crop}
                            setState={props.setField}
                        />
                    </Grid> 
                    <Grid item xs={12}>
                        <Select
                            name="ProfitCenter"
                            label="Centro de Custo"
                            list={props.profitCenters}
                            value={props.data.ProfitCenter}
                            setState={props.setField}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="Comments"
                            label="Observação"
                            multiline
                            rows={3}
                            value={props.data.Comments}
                            onChange={evt => props.setField('Comments', evt.target.value)}
                        />
                    </Grid>
                </Grid>
            </Box>
        </>

    )
}