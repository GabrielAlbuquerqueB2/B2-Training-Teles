import { Box, Grid, TextField, Typography, Button } from '@mui/material'
import Select from '../../../components/ui/Select'
import ItemAutocomplete from '../../../components/ui/Autocomplete/ItemAutocomplete'
import styles from '../../../components/ui/PageHeader/PageHeader.module.css'
import { } from './StockListServices'

export default function StockListFilter() {

    return (
        <>
            <Typography variant="h6" className={styles.title}>Filtros</Typography>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <ItemAutocomplete
                            label="Item"
                            onChange={(e, value) => console.log(value)}
                            setValue={(value) => console.log(value)}
                        />
                    </Grid>
                </Grid>
            </Box>
            <br />
        </>
    )
}