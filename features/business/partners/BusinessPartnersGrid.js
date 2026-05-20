import { useEffect } from "react"
import { Box, Grid, TextField, FormControlLabel, Checkbox } from "@mui/material"

export default function BusinessPartnersGrid(props) {

    useEffect(() => {
        if (props.onMount) {
            props.onMount()
        }
    }, [])

    function isExempt() {
        return props.data.BPFiscalTaxIDCollection?.some(entry => entry.TaxId1 === "Isento")
    }

    function getInscricaoValue() {
        if (isExempt()) return 'Isento'
        const collection = props.data.BPFiscalTaxIDCollection || []

        let entry = collection.find(entry =>
            entry.CNAECode === -1 && entry.TaxId1 && entry.TaxId1 !== "Isento"
        )

        if (!entry) {
            entry = collection.find(entry =>
                entry.TaxId1 && entry.TaxId1 !== "Isento"
            )
        }
        
        return entry?.TaxId1 || ''
    }

    function updateTaxId(value) {
        let collection = [...(props.data.BPFiscalTaxIDCollection || [])]
        if (collection.length === 0) {
            collection.push({
                CNAECode: -1,
                TaxId1: '',
                TaxId4: '',
                TaxId5: ''
            })
        }
        let existingEntry = collection.find(entry => entry.CNAECode === -1)
        if (existingEntry) {
            existingEntry.TaxId1 = value
        } else {
            collection.push({
                CNAECode: -1,
                TaxId1: value,
                TaxId4: '',
                TaxId5: ''
            })
        }
        props.setField('BPFiscalTaxIDCollection', collection)
    }
    
    return (
        <Box sx={{ flexGrow: 1, mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        label="Nome"
                        value={props.data.CardName || ''}
                        onChange={evt => props.setField('CardName', evt.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Nome Fantasia"
                        value={props.data.AliasName || ''}
                        onChange={evt => props.setField('AliasName', evt.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Telefone 1"
                        value={props.data.Phone1 || ''}
                        onChange={evt => props.setField('Phone1', evt.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Telefone 2"
                        value={props.data.Phone2 || ''}
                        onChange={evt => props.setField('Phone2', evt.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Celular"
                        value={props.data.Cellular || ''}
                        onChange={evt => props.setField('Cellular', evt.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Email"
                        type="email"
                        value={props.data.EmailAddress || ''}
                        onChange={evt => props.setField('EmailAddress', evt.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Inscrição Estadual"
                        value={getInscricaoValue()}
                        onChange={evt => updateTaxId(evt.target.value)}
                        disabled={isExempt()}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isExempt()}
                                onChange={evt => updateTaxId(evt.target.checked ? "Isento" : null)}
                                color="primary"
                            />
                        }
                        label="Isento"
                    />
                </Grid>
            </Grid>
        </Box>
    )
}