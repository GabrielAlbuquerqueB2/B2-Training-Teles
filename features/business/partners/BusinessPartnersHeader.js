import { Box, Typography, TextField, Grid, MenuItem } from '@mui/material'

export default function BusinessPartnersHeader(props) {
    const seriesOptions = props.seriesOptions || []

    async function handleCardTypeChange(event) {
        const cardTypeKey = event.target.value
        props.setField('CardType', cardTypeKey)
        props.setField('Series', '')

        if (props.onCardTypeChange) {
            await props.onCardTypeChange(cardTypeKey)
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
                <Grid item xs={props.status === 'CREATE' && seriesOptions.length > 0 ? 2 : 4}>
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
                {props.status === 'CREATE' && seriesOptions.length > 0 && (
                    <Grid item xs={2}>
                        <TextField
                            select
                            label="Série"
                            value={props.data?.Series || ''}
                            onChange={evt => props.setField('Series', evt.target.value)}
                            fullWidth
                            size="small"
                        >
                            {seriesOptions.map(s => (
                                <MenuItem key={s.Series} value={s.Series}>
                                    {s.Name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                )}
            </Grid>
        </Box>
    )
}