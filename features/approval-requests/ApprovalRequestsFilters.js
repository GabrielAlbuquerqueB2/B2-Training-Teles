import { Box, Grid, TextField, Typography, Button } from '@mui/material'
import Select from '../../components/ui/Select'
import styles from '../../components/ui/PageHeader/PageHeader.module.css'
import { getApprovalRequests } from './ApprovalRequestsServices'
import { parseCookies } from 'nookies'

export default function ApprovalRequestsFilters(props) {

    async function handleFilter() {
        const decodedSessionData = JSON.parse(Buffer.from(parseCookies().session, 'base64').toString('ascii'))
        const userId = decodedSessionData.UserInternalKey

        const result = await getApprovalRequests(props.filters, userId)
        props.setData(result)
    }

    return (
        <Box className={styles.filtersContainer}>
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
                <Grid item xs={4}>
                    <Select
                        label="Status"
                        name="status"
                        list={[
                            { value: 'arsPending', description: 'Pendente' },
                            { value: 'arsApproved', description: 'Aprovado' },
                            { value: 'arsNotApproved', description: 'Rejeitado' },
                            { value: 'T', description: 'Todos' }
                        ]}
                        value={props.filters.status}
                        setState={props.setField}
                    />
                </Grid>
                <Grid item xs={2}>
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
    )
}