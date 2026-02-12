import { TextField, Box, Grid, FormGroup, FormControlLabel, Switch } from '@mui/material'
import EmployeeAutocomplete from '../../../components/ui/Autocomplete/EmployeeAutocomplete'
import BusinessPartnerAutocomplete from '../../../components/ui/Autocomplete/BusinessPartnerAutocomplete'
import UserBranchesSelect from '../../../components/ui/Select/UserBranchesSelect'
import EquipmentAutocomplete from '../../../components/ui/Autocomplete/EquipmentAutocomplete'
import UsageSelect from '../../../components/ui/Select/UsageSelect'
import Select from '../../../components/ui/Select'

export default function PurchaseRequestHeader(props) {

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={8}></Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="DocNum"
                            value={props.data.DocNum}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={8}></Grid>
                    <Grid item xs={4}>
                        <Select
                            name="U_B2AG_Crop"
                            label="Safra"
                            list={props.crops}
                            value={props.data.U_B2AG_Crop}
                            setState={props.setField}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            type="date"
                            label={"Data da Solicitação"}
                            value={props.data.DocDate ?? ''}
                            onChange={(evt) => props.setField('DocDate', evt.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            type="date"
                            label={"Data Necessária"}
                            value={props.data.DocDueDate ?? ''}
                            onChange={(evt) => props.setField('DocDueDate', evt.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            type="date"
                            label={"Válido Até"}
                            value={props.data.RequriedDate ?? ''}
                            onChange={(evt) => props.setField('RequriedDate', evt.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <UserBranchesSelect
                            name="BPL_IDAssignedToInvoice"
                            label="Filial"
                            value={props.data.BPL_IDAssignedToInvoice ?? ''}
                            setState={props.setField}
                            disabled={props.status === 'EDIT'}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <EmployeeAutocomplete
                            name={"Solicitante"}
                            value={props.requester ?? ''}
                            setValue={props.setRequester}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <EquipmentAutocomplete
                            name="Equipamento"
                            value={props.equipment}
                            setValue={props.setEquipment}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={props.isPurchaseMade ?? ''}
                                        onChange={(evt) => props.setIsPurchaseMade(evt.target.checked)}
                                    />}
                                label="Compra efetivada" />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={2}>
                        <UsageSelect
                            name="Usage"
                            label="Utilização"
                            value={props.data.Usage ?? ''}
                            setState={props.setField}
                        />
                    </Grid>
                    {
                        props.isPurchaseMade &&
                        <>

                            <Grid item xs={3}>
                                <TextField
                                    label="NF"
                                    value={props.data.U_TX_NDfe ?? ''}
                                    onChange={(evt) => props.setField('U_TX_NDfe', evt.target.value)}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <BusinessPartnerAutocomplete
                                    name="Fornecedor"
                                    value={props.vendor ?? ''}
                                    setValue={props.setVendor}
                                />
                            </Grid>
                        </>
                    }
                    <Grid item xs={4}>
                        <Select
                            name="ItemGroup"
                            label="Grupo de Item"
                            list={props.itemGroups}
                            value={props.data.ItemGroup}
                            setState={props.setField}
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}