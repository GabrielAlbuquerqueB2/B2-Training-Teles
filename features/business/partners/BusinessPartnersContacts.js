import { useEffect } from 'react'
import { Box, Button, TextField, Grid } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

export default function BusinessPartnersContacts(props) {
    const contacts = props.data.ContactEmployees || [];

    useEffect(() => {
        if (props.onMount) {
            props.onMount();
        }
    }, []);
    
    function setContactField(index, field, value) {
        props.setChildField('ContactEmployees', field, index, value);
    }
    
    return (
        <Box sx={{ flexGrow: 1 }}>
            {contacts.map((contact, index) => (
                <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <TextField
                                label="Contato"
                                value={contact.Name || ''}
                                onChange={(evt) => setContactField(index, 'Name', evt.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={2.7}>
                            <TextField
                                label="Nome"
                                value={contact.FirstName || ''}
                                onChange={(evt) => setContactField(index, 'FirstName', evt.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4.7}>
                            <TextField
                                label="E-mail"
                                type="email"
                                value={contact.E_Mail || ''}
                                onChange={(evt) => setContactField(index, 'E_Mail', evt.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={1.7}>
                            <TextField
                                label="Telefone"
                                value={contact.Phone1 || ''}
                                onChange={(evt) => setContactField(index, 'Phone1', evt.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={0.5}>
                            <Button
                                variant="outlined"
                                onClick={() => props.handleDeleteContact(index)}
                            >
                                <DeleteIcon />
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            ))}
        </Box>
    )
}