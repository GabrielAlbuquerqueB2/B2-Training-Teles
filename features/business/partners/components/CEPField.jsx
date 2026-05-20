import { Grid, TextField } from '@mui/material';
import { BuscaCEP, retira_acentos } from '../BuscaCepService';

export default function CEPField({ 
    address, 
    setAddressField, 
    setAlertMessage, 
    cepInvalido, 
    setCepInvalido 
}) {
    
    const handleBuscaCEP = async (cep) => {
        setAlertMessage('');
        const result = await BuscaCEP(cep);
        
        if (!result.erro) {
            const logradouroSplit = result.logradouro ? result.logradouro.split(' ') : [''];
            const tipoLogradouro = logradouroSplit[0] || 'Rua';
            const nomeLogradouro = result.logradouro ? 
                result.logradouro.slice(tipoLogradouro.length).trim() : '';
            const fieldsToUpdate = [
                { field: 'TypeOfAddress', value: retira_acentos(tipoLogradouro), condition: !address.TypeOfAddress },
                { field: 'Street', value: retira_acentos(nomeLogradouro.toUpperCase()) || '', condition: !address.Street },
                { field: 'Block', value: retira_acentos(result.bairro?.toUpperCase() || ''), condition: !address.Block },
                { field: 'City', value: retira_acentos(result.localidade?.toUpperCase() || ''), condition: !address.City },
                { field: 'State', value: result.uf?.toUpperCase() || '', condition: !address.State },
                { field: 'County', value: retira_acentos(result.localidade?.toUpperCase() || ''), condition: !address.County && result.localidade }
            ];

            fieldsToUpdate.forEach(({ field, value, condition }) => {
                if (condition) {
                    setAddressField('BPAddresses', field, address.originalIndex, value);
                }
            });
            setAddressField('BPAddresses', 'ZipCode', address.originalIndex, result.cep || cep);
            
            if (result.ibge) {
                setAddressField('BPAddresses', 'CountyCode', address.originalIndex, result.ibge);
            }
            setCepInvalido(false);
        } else {
            setAlertMessage('CEP inválido ou inexistente!');
            setCepInvalido(true);
        }
    };

    return (
        <Grid item xs={1.1}>
            <TextField
                label="CEP"
                value={address.ZipCode || ''}
                onChange={(evt) => setAddressField('BPAddresses', 'ZipCode', address.originalIndex, evt.target.value)}
                onFocus={() => setAlertMessage('')}
                onBlur={(evt) => {
                    if (evt.target.value) {
                        handleBuscaCEP(evt.target.value);
                    }
                }}
                error={cepInvalido}
                fullWidth
                placeholder="00000-000"
            />
        </Grid>
    );
}
