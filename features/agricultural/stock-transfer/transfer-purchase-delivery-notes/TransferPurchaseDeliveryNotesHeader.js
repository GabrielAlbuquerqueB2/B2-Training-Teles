import { useState } from 'react'
import { Box, Grid, TextField } from '@mui/material'
import Select from '../../../../components/ui/Select'
import CurrencyTextField from '../../../../components/ui/CurrencyTextField'
import BusinessPartnerAutocomplete from '../../../../components/ui/Autocomplete/BusinessPartnerAutocomplete'
import { getFederalUnities, getIncotermsOptions } from './TransferPurchaseDeliveryNotesServices'

export default function TransferPurchaseDeliveryNotesHeader(props) {

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
                    <Grid item xs={9}>
                        <Select
                            name="DeliveryNoteCode"
                            label="Entrega"
                            list={props.deliveryNotesList}
                            value={props.data.DeliveryNoteCode}
                            setState={props.setField}
                        />
                    </Grid>
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
                            value={props.data.U_B2AG_Date}
                            onChange={(event) => {
                                props.setField("U_B2AG_Date", event.target.value)
                            }}
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
                            label="Filial de Destino"
                            value={props.data.U_B2AG_DestinationBranch}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Fornecedor"
                            value={props.data.DefaultVendorID + ' - ' + props.data.BPLName}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Chave Acesso"
                            value={props.data.U_ChaveAcesso}
                            onChange={(event) => {
                                props.setField("U_ChaveAcesso", event.target.value)
                            }}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            id="Carrier"
                            label="Transportadora"
                            value={props.data.Carrier}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="Incoterms"
                            label="Tipo de Frete"
                            value={props.data.U_B2AG_Incoterms}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="Driver"
                            label="Motorista"
                            value={props.deliveryNote?.U_B2AG_Driver}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="LicensePlate"
                            label="Placa"
                            value={props.deliveryNote?.TaxExtension?.Vehicle}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="LicensePlateState"
                            label="UF"
                            value={props.deliveryNote?.TaxExtension?.VehicleState}
                            disabled
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