import { Table, Box, Grid, TableCell, TableRow, TableHead, TableBody, TextField } from '@mui/material'
import CurrencyTextField from '../../../../components/ui/CurrencyTextField/CurrencyTextField'

export default function WeatherNoteGrid(props) {

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Elemento</TableCell>
                                    <TableCell>Valor</TableCell>
                                    <TableCell>U.M</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    props.data.B2AG_WSN1Collection ?
                                        props.data.B2AG_WSN1Collection?.map((item, index) => {
                                            return (
                                                <TableRow>
                                                    <TableCell width="30%" sx={{ padding: '3px' }}>
                                                        <TextField
                                                            disabled
                                                            value={props.data.B2AG_WSN1Collection[index]?.U_B2AG_Element}
                                                        />
                                                    </TableCell>
                                                    <TableCell width="15%" sx={{ padding: '3px' }}>
                                                        <TextField
                                                            //type="number"

                                                            //readOnly = true
                                                            value={props.data.B2AG_WSN1Collection[index]?.U_B2AG_Value}
                                                            onChange={evt => props.setChildField('B2AG_WSN1Collection', 'U_B2AG_Value', index, evt.target.value)}
                                                        />
                                                    </TableCell>
                                                    <TableCell width="15%" sx={{ padding: '3px' }}>
                                                        <TextField
                                                            disabled
                                                            value={props.data.B2AG_WSN1Collection[index]?.U_B2AG_UnitOfMeasurement}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                        : null
                                }
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}