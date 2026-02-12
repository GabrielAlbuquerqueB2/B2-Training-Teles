import { Grid, Box, TextField } from '@mui/material'
import Select from '../../../../components/ui/Select'
import UserBranchesSelect from '../../../../components/ui/Select/UserBranchesSelect'

export default function InventoryTransferRequestHeader(props) {

    const { isClosed } = props

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
                            label="DocumentStatus"
                            disabled
                            value={props.data.DocumentStatus}
                        />
                    </Grid>
                    <Grid item xs={9}></Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="DocDate"
                            label="Data"
                            type="date"
                            value={props.data.DocDate}
                            onChange={evt => props.setField('DocDate', evt.target.value)}
                            disabled={isClosed || props.formMode.mode === 'UPDATE'}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <UserBranchesSelect
                            name="BPLID"
                            label="Filial"
                            value={props.data.BPLID}
                            setState={props.setField}
                            disabled={isClosed || props.formMode.mode === 'UPDATE' }
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Select
                            name="FromWarehouse"
                            label="Depósito Origem"
                            list={props.warehousesList}
                            value={props.data.FromWarehouse}
                            setState={props.setField}
                            disabled={isClosed}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Select
                            name="ToWarehouse"
                            label="Depósito Destino"
                            list={props.warehousesList}
                            value={props.data.ToWarehouse}
                            setState={props.setField}
                            disabled={isClosed}
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}