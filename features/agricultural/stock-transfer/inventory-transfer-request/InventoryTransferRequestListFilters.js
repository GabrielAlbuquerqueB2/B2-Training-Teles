import { Box, Grid, TextField, Typography, Button } from '@mui/material'
import styles from '../../../../components/ui/PageHeader/PageHeader.module.css'
import { getInventoryTransferRequest } from './InventoryTransferRequestServices'

export default function InventoryTransferRequestListFilters(props) {

    async function handleFilter() {
        const result = await getInventoryTransferRequest(props.filters)
        const mappedObject = result.map(item => {
            return {
                DocEntry: item.DocEntry,
                DocNum: item.DocNum,
                DocDate: item.DocDate,
                FromWarehouse: item.FromWarehouse,
                ToWarehouse: item.ToWarehouse,
                BPLName: item.BPLName,
                Comments: item.Comments,
                Item: item.StockTransferLines[0].ItemDescription
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