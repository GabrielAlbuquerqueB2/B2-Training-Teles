import { useState } from 'react';
import { Grid, TextField, FormControlLabel, Checkbox } from '@mui/material';
import CEPField from './CEPField';

export default function AddressForm({ 
    address, 
    setAddressField, 
    setAlertMessage, 
    showTaxId 
}) {
    const [cepInvalido, setCepInvalido] = useState(false);
    const getIECollection = () => address.BPFiscalTaxIDCollection || [];
    const getAddressId = () => address.AddressName;

    function isExemptAddress() {
        const entry = getIECollection().find(e => e.Address === getAddressId());
        return entry?.TaxId1 === "Isento";
    }

    function getInscricaoValueAddress() {
        const collection = getIECollection();
        const addressId = getAddressId();
        let entry = collection.find(e => e.Address === addressId);
        if (entry?.TaxId1 === "Isento") return "Isento";
        return entry?.TaxId1 || '';
    }

    function updateAddressTaxId(value) {
        let collection = [...getIECollection()];
        const addressId = getAddressId();
        let entryIndex = collection.findIndex(e => e.Address === addressId);
        if (entryIndex === -1) {
            collection.push({
                Address: addressId,
                TaxId1: value
            });
        } else {
            collection[entryIndex] = {
                ...collection[entryIndex],
                Address: addressId,
                TaxId1: value
            };
        }
        setAddressField('BPAddresses', 'BPFiscalTaxIDCollection', address.originalIndex, collection);
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <TextField
                    label="ID do Endereço"
                    value={address.AddressName || ''}
                    onChange={(evt) => setAddressField('BPAddresses', 'AddressName', address.originalIndex, evt.target.value)}
                    fullWidth
                />
            </Grid>
            
            <CEPField
                address={address}
                setAddressField={setAddressField}
                setAlertMessage={setAlertMessage}
                cepInvalido={cepInvalido}
                setCepInvalido={setCepInvalido}
            />
            
            <Grid item xs={1.5}>
                <TextField
                    label="Tipo Logradouro"
                    value={address.TypeOfAddress || ''}
                    onChange={(evt) => setAddressField('BPAddresses', 'TypeOfAddress', address.originalIndex, evt.target.value.toUpperCase())}
                    disabled={cepInvalido}
                    fullWidth
                    required
                    placeholder="Rua, Avenida..."
                    inputProps={{ style: { textTransform: 'uppercase' } }}
                />
            </Grid>
            
            <Grid item xs={4.1}>
                <TextField
                    label="Rua/Caixa Postal"
                    value={address.Street || ''}
                    onChange={(evt) => setAddressField('BPAddresses', 'Street', address.originalIndex, evt.target.value)}
                    disabled={cepInvalido}
                    fullWidth
                />
            </Grid>
            
            <Grid item xs={1.3}>
                <TextField
                    label="Número"
                    value={address.StreetNo || ''}
                    onChange={(evt) => setAddressField('BPAddresses', 'StreetNo', address.originalIndex, evt.target.value)}
                    fullWidth
                />
            </Grid>
            
            <Grid item xs={5.1}>
                <TextField
                    label="Bairro"
                    value={address.Block || ''}
                    onChange={(evt) => setAddressField('BPAddresses', 'Block', address.originalIndex, evt.target.value)}
                    disabled={cepInvalido}
                    fullWidth
                />
            </Grid>
            
            <Grid item xs={5.6}>
                <TextField
                    label="Cidade"
                    value={address.City || ''}
                    onChange={(evt) => setAddressField('BPAddresses', 'City', address.originalIndex, evt.target.value)}
                    disabled={cepInvalido}
                    fullWidth
                />
            </Grid>
            
            <Grid item xs={1.3}>
                <TextField
                    label="Estado"
                    value={address.State || ''}
                    onChange={(evt) => setAddressField('BPAddresses', 'State', address.originalIndex, evt.target.value)}
                    disabled={cepInvalido}
                    fullWidth
                    placeholder="UF"
                />
            </Grid>
            
            <Grid item xs={5.1}>
                <TextField
                    label="Município"
                    value={address.City || ''}
                    helperText={address.CountyCode ? `Cód. IBGE: ${address.CountyCode}` : ''}
                    disabled={true}
                    fullWidth
                />
            </Grid>
            
            {showTaxId && (
                <>
                    <Grid item xs={5.6}>
                        <TextField
                            label="Inscrição Estadual"
                            value={getInscricaoValueAddress()}
                            onChange={(evt) => updateAddressTaxId(evt.target.value)}
                            disabled={isExemptAddress()}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isExemptAddress()}
                                    onChange={(evt) => updateAddressTaxId(evt.target.checked ? "Isento" : null)}
                                    color="primary"
                                />
                            }
                            label="Isento"
                        />
                    </Grid>
                </>
            )}
        </Grid>
    );
}
