import { useState, useEffect } from 'react'
import { Box, Grid, TextField } from '@mui/material'
import Select from '../../../components/ui/Select'
import BusinessPartnerAutocomplete from '../../../components/ui/Autocomplete/BusinessPartnerAutocomplete'
import Tabs from '../../../components/ui/Tabs'
import { getFederalUnities } from './PackingListServices'
import CurrencyTextField from '../../../components/ui/CurrencyTextField'
import PackingListWeighting from './PackingListWeighting'
import PackingListAnalisys from './PackingListAnalisys'
import PackingListWeightingFinal from './PackingListWeightingFinal'
import PackingListAnalisysFinal from './PackingListAnalisysFinal'

export default function PackingListGeneralData(props) {

    const [federalUnities] = useState(getFederalUnities())

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
                    <Grid item xs={3}>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Data"
                            type="date"
                            value={props.data.U_B2AG_Date || ''}
                            onChange={evt => props.setField('U_B2AG_Date', evt.target.value)}
                            disabled={props.isDisabled}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Hora"
                            type="time"
                            value={props.data.U_B2AG_Time || ''}
                            onChange={evt => props.setField('U_B2AG_Time', evt.target.value)}
                            disabled={props.isDisabled}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Status"
                            disabled
                            value={props.data.Status}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Select
                            name="U_B2AG_Order"
                            label="Pedido"
                            list={props.orderList}
                            value={props.data.U_B2AG_Order}
                            setState={props.setField}
                            onBlur={(event) => {
                                props.updateOrder(event.target.value)
                            }}
                            disabled={props.isDisabled}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            label="Filial"
                            disabled
                            value={props.order.BPLName}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Depósito"
                            disabled
                            value={props.order.DocumentLines ? props.order.DocumentLines[0].WarehouseCode : ''}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            label="Cliente"
                            disabled
                            value={`${props.order.CardCode} - ${props.order.CardName}`}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="CNPJ"
                            disabled
                            value={props.order.TaxExtension ? props.order.TaxExtension.TaxId0 : ''}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Item"
                            value={props.order.DocumentLines ? `${props.order.DocumentLines[0].ItemCode} - ${props.order.DocumentLines[0].ItemDescription}` : ''}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={2}>
                    <Select
                            name="U_B2AG_Batch"
                            label="Lote"
                            list={props.batchList}
                            value={props.data.U_B2AG_Batch}
                            setState={props.setField}
                            disabled={props.isDisabled}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Select
                            name="U_B2AG_AddDesc"
                            label="Descrição Complementar"
                            list={[
                                { value: 'NENHUMA', description: 'NENHUMA' },
                                { value: 'INTACTA', description: 'INTACTA' }
                            ]}
                            value={props.data.U_B2AG_AddDesc}
                            setState={props.setField}
                            disabled={props.isDisabled}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <CurrencyTextField
                            label="Qtd. Pendente"
                            value={props.order.DocumentLines ? props.order.DocumentLines[0].RemainingOpenQuantity : ''}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="U_B2AG_Driver"
                            label="Motorista"
                            value={props.data.U_B2AG_Driver}
                            onChange={evt => props.setField('U_B2AG_Driver', evt.target.value)}
                            disabled={props.isDisabled}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="U_B2AG_LicensePlate"
                            label="Placa"
                            value={props.data.U_B2AG_LicensePlate}
                            onChange={evt => props.setField('U_B2AG_LicensePlate', evt.target.value)}
                            disabled={props.isDisabled}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Select
                            name="U_B2AG_PlateFederalUnit"
                            label="UF"
                            list={federalUnities}
                            value={props.data.U_B2AG_PlateFederalUnit}
                            setState={props.setField}
                            disabled={props.isDisabled}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <BusinessPartnerAutocomplete
                            name="Transportadora"
                            value={props.shipping}
                            setValue={props.setShipping}
                            disabled={props.isDisabled}
                        />
                    </Grid>
                    <Tabs>
                        <Box
                            index={1}
                            label="Pesagem Local"
                            component={
                                <>
                                    <Grid item xs={12}>
                                        <PackingListWeighting
                                            data={props.data}
                                            setField={props.setField}
                                            isDisabled={props.isDisabled}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <PackingListAnalisys
                                            data={props.data}
                                            setChildField={props.setChildField}
                                            isDisabled={props.isDisabled}
                                        />
                                    </Grid>
                                </>

                            }
                        />
                        <Box
                            index={2}
                            label="Pesagem Destino"
                            component={
                                <>
                                    <Grid item xs={12}>
                                        <PackingListWeightingFinal
                                            data={props.data}
                                            setField={props.setField}
                                            isDisabled={props.isDisabled}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <PackingListAnalisysFinal
                                            data={props.data}
                                            setChildField={props.setChildField}
                                            isDisabled={props.isDisabled}
                                        />
                                    </Grid></>
                            }
                        />
                    </Tabs>
                    <Grid item xs={12}>
                        <TextField
                            id="U_B2AG_Comments"
                            label="Observação"
                            multiline
                            rows={3}
                            value={props.data.U_B2AG_Comments}
                            onChange={evt => props.setField('U_B2AG_Comments', evt.target.value)}
                            disabled={props.isDisabled}
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}