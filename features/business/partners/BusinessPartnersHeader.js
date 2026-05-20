import { Box, Typography, TextField, Grid, MenuItem } from '@mui/material'

export default function BusinessPartnersHeader(props) {

    async function handleCardTypeChange(event) {
        const seriesMap = {
            cCustomer: 70,
            cSupplier: 71,
            cLid: 3
        }
        
        const cardTypeKey = event.target.value
        props.setField('CardType', cardTypeKey)
        const series = seriesMap[cardTypeKey]
        props.setField('Series', series)

        if (props.onCardTypeChange) {
            await props.onCardTypeChange(series, cardTypeKey)
        }
    }

    return (
        <Box sx={{ flexGrow: 1, mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Typography variant="h5" component="h1" sx={{ mb: 2, color: 'primary.main', fontWeight: 'medium' }}>
                {props.status === 'CREATE' ? 'Novo Parceiro de Negócios' : props.data?.CardName || 'Parceiro de Negócios'}
            </Typography>
            
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <TextField
                        label="Código"
                        value={props.data?.CardCode || ''}
                        disabled
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="CPF/CNPJ"
                        value={props.data?.FederalTaxID || ''}
                        onChange={evt => props.setField('FederalTaxID', evt.target.value)}
                        disabled={props.status === 'EDIT'}
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        select
                        label="Tipo"
                        value={props.data?.CardType || ''}
                        onChange={handleCardTypeChange}
                        disabled={props.status === 'EDIT'}
                        fullWidth
                        size="small"
                    >
                        <MenuItem value="cCustomer">Cliente</MenuItem>
                        <MenuItem value="cSupplier">Fornecedor</MenuItem>
                    </TextField>
                </Grid>
            </Grid>
        </Box>
    )
}