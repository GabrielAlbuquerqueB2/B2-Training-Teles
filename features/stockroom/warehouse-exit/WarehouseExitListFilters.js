import { Box, Grid, TextField, Typography, Button } from '@mui/material'
import styles from '../../../components/ui/PageHeader/PageHeader.module.css'
import { getWarehouseExitGenExits } from './WarehouseExitServices'

export default function WarehouseExitListFilters(props) {

    async function handleFilter() {
        const branches = sessionStorage.getItem('Branches')
        const branchesArray = JSON.parse(branches)
        const locationIds = branchesArray.map((item => {
            return item.ProductionUnit.Code
        }))
        const uniqueLocationsList = [...new Set(locationIds)]
        
        const exits = await getWarehouseExitGenExits(uniqueLocationsList, props.filters)
        
        if (!Array.isArray(exits)) {
            console.error('Unexpected response format:', exits)
            props.setData([])
            return
        }
        
        const mappedObject = exits.map(item => {
            return {
                DocEntry: item.InventoryGenExits.DocEntry,
                DocNum: item.InventoryGenExits.DocNum,
                DocDate: item.InventoryGenExits.DocDate,
                Comments: item.InventoryGenExits.Comments,
                U_B2AG_Crop: item.InventoryGenExits.U_B2AG_Crop,
                U_B2AG_Equipment: item.InventoryGenExits.U_B2AG_Equipment,
                U_B2AG_Odometer: item.InventoryGenExits.U_B2AG_Odometer,
                U_B2AG_Operator: item.InventoryGenExits.U_B2AG_Operator,
                ItemCode: item["InventoryGenExits/DocumentLines"].ItemCode,
                ItemDescription: item["InventoryGenExits/DocumentLines"].ItemDescription,
                Quantity: item["InventoryGenExits/DocumentLines"].Quantity
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