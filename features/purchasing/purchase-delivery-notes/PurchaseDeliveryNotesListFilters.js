import { Box, Grid, TextField, Typography, Button } from '@mui/material'
import styles from '../../../components/ui/PageHeader/PageHeader.module.css'
import { getAllPurchaseDeliveryNotesByBranches } from './PurchaseDeliveryNotesServices'

export default function PurchaseDeliveryNotesListFilters(props) {

    async function handleFilter() {
        const branches = sessionStorage.getItem('Branches')
        const branchesArray = JSON.parse(branches)
        const branchIds = branchesArray.map((item => {
            return item.BusinessPlaces.BPLID
        }))
        const uniqueBranchList = [...new Set(branchIds)]
        const result = await getAllPurchaseDeliveryNotesByBranches(uniqueBranchList, props.filters)
        props.setData(result)
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