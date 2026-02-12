import { Box, Grid, TextField } from '@mui/material';
import Select from '../../../components/ui/Select';
import { getIncotermsList, getVehicleStateList } from './PurchaseDeliveryNotesServices';

export default function PurchaseDeliveryNotesHeader(props) {

    const incotermsList = getIncotermsList()
    const vehicleStateList = getVehicleStateList()

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={9}>

                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="DocNum"
                            disabled
                            value={props?.data.DocNum}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id="DocDate"
                            label="Data"
                            type="date"
                            value={props?.data.DocDate}
                            onChange={evt => props.setField('DocDate', evt.target.value)}
                            disabled={props.status === 'UPDATE'}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="BPL"
                            label="Filial"
                            value={props?.purchaseOrder.BPLName}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <Select
                            name="SequenceCode"
                            label="Sequencia"
                            list={[
                                {
                                    value: -2,
                                    description: 'Externo'
                                },
                                {
                                    value: -1,
                                    description: 'Manual'
                                },
                            ]}
                            value={props.data.SequenceCode}
                            setState={props.setField}
                            disabled={props.status === 'UPDATE'}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="SequenceSerial"
                            label="Nota Fiscal"
                            value={props.data.SequenceSerial}
                            onChange={evt => props.setField('SequenceSerial', evt.target.value)}
                            disabled={props.status === 'UPDATE'}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="SeriesString"
                            label="Série"
                            value={props.data.SeriesString}
                            onChange={evt => props.setField('SeriesString', evt.target.value)}
                            disabled={props.status === 'UPDATE'}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Select
                            name="Incoterms"
                            label="Incoterms"
                            list={incotermsList}
                            value={props.data.Incoterms}
                            setState={props.setField}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="Vehicle"
                            label="Placa"
                            value={props.data.Vehicle}
                            onChange={evt => props.setField('Vehicle', evt.target.value)}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Select
                            name="VehicleState"
                            label="UF Veículo"
                            list={vehicleStateList}
                            value={props.data.VehicleState}
                            setState={props.setField}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Select
                            name="PayToCode"
                            label="Endereço de Cobrança"
                            list={props.addresses}
                            value={props.data.PayToCode}
                            setState={props.setField}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="U_ChaveAcesso"
                            label="Chave de Acesso NF"
                            value={props.data.U_ChaveAcesso}
                            onChange={evt => props.setField('U_ChaveAcesso', evt.target.value)}
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <TextField
                            id="Vendor"
                            label="Fornecedor"
                            value={props.purchaseOrder ? `${props.purchaseOrder.CardCode} - ${props.purchaseOrder.CardName}` : ''}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="Currency"
                            label="Moeda/Taxa"
                            value={props.purchaseOrder?  `${props.purchaseOrder.DocCurrency} / ${props.purchaseOrder.DocRate}` : ''}
                            disabled
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}