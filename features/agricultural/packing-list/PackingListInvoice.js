import { Grid, TextField, Button, Stack } from '@mui/material'
import { Refresh, Note, Code } from '@mui/icons-material';

export default function PackingListInvoice(props) {

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        id="SequenceSerial"
                        label="Nº NF"
                        value={props.data.U_B2AG_Invoice}
                        disabled
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="SeriesString"
                        label="Serie"
                        value={''}
                        disabled
                    />
                </Grid>
                <Grid item xs={9}>
                    <TextField
                        id="Status"
                        label="Status"
                        value={''}
                        disabled
                    />
                </Grid>
                <Grid item xs={3}>
                    <Button
                        color="primary"
                        variant={"contained"}
                        fullWidth
                        disabled
                        startIcon={<Refresh />}
                    >
                        Consulta Sefaz
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        id="Motivo"
                        label="Motivo"
                        value={''}
                        disabled
                    />
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        id="ChaveAcesso"
                        label="Chave de Acesso"
                        value={''}
                        disabled
                    />
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" spacing={2}>
                        <Button
                            color="primary"
                            variant={"contained"}
                            disabled
                            startIcon={<Code />}
                        >
                            Download XML
                        </Button>
                        <Button
                            color="primary"
                            variant={"contained"}
                            disabled
                            startIcon={<Note />}
                        >
                            Download Danfe
                        </Button>
                        <Button
                            color="primary"
                            variant={"contained"}
                            startIcon={<Note />}
                            disabled
                        >
                            Cancelar NFe
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </>
    )
}