import { useState } from 'react'
import { Box, Grid, TextField } from '@mui/material'
import Select from '../../../../components/ui/Select'
import CurrencyTextField from '../../../../components/ui/CurrencyTextField'
import BusinessPartnerAutocomplete from '../../../../components/ui/Autocomplete/BusinessPartnerAutocomplete'
import { getFederalUnities, getIncotermsOptions } from './TransferDeliveryNotesServices'
import getTodayDate from '../../../../utils/getTodayDate'

export default function TransferDeliveryNotesHeader(props) {

    const [federalUnities] = useState(getFederalUnities())
    const [incotermsList] = useState(getIncotermsOptions())

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
                            value={props.data.Status}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            label="Data"
                            type="date"
                            value={getTodayDate()}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={10}>
                        <TextField
                            label="Descrição"
                            value={props.data.U_B2AG_Description}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Filial de Origem"
                            value={props.data.U_B2AG_OriginBranch}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Cliente"
                            value={props.data.DefaultCustomerID + ' - ' + props.data.BPLName}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <BusinessPartnerAutocomplete
                            name="Transportadora"
                            value={props.shipping}
                            setValue={props.setShipping}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Select
                            name="U_B2AG_Incoterms"
                            label="Tipo de Frete"
                            list={incotermsList}
                            value={props.data.U_B2AG_Incoterms}
                            setState={props.setField}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="Driver"
                            label="Motorista"
                            value={props.data.Driver}
                            onChange={evt => props.setField('Driver', evt.target.value)}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="LicensePlate"
                            label="Placa"
                            value={props.data.LicensePlate}
                            onChange={evt => props.setField('LicensePlate', evt.target.value)}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Select
                            name="PlateFederalUnit"
                            label="UF"
                            list={federalUnities}
                            value={props.data.PlateFederalUnit}
                            setState={props.setField}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <CurrencyTextField
                            label="Peso Bruto"
                            value={props.data.GrossWeight}
                            onChange={(event, newValue) => {
                                props.setField("GrossWeight", newValue)
                            }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <CurrencyTextField
                            label="Peso Tara"
                            value={props.data.TareWeight}
                            onChange={(event, newValue) => {
                                props.setField("TareWeight", newValue)
                            }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <CurrencyTextField
                            label="Peso Liquido"
                            value={props.data.LiquidWeight}
                            disabled
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}