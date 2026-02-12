import {
    Box, Grid, Typography, Table, TableHead, TableBody, TableRow, TableCell,
    TextField, Button
} from '@mui/material'
import CurrencyTextField from '../../../../components/ui/CurrencyTextField/CurrencyTextField'
import ItemAutocomplete from '../../../../components/ui/Autocomplete/ItemAutocompleteByGroupCode'
import DeleteIcon from '@mui/icons-material/Delete'

export default function SeedTreatmentGrid(props) {

    function handleLineBlur(index) {
        const lastIndex = props.data.DocumentLines.length - 1
        if (props.data.DocumentLines[lastIndex]?.Quantity) {
            props.handleNewLine()
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant='h6'>Insumos</Typography>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>U.M.</TableCell>
                            <TableCell>Quantidade Base</TableCell>
                            <TableCell>Quantidade</TableCell>
                            <TableCell>Excluir</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            props.data.DocumentLines ?
                                props.data.DocumentLines?.map((item, index) => {
                                    return (
                                        <TableRow>
                                            <TableCell width="35%" sx={{ padding: '3px' }}>
                                                <ItemAutocomplete
                                                    name="Item"
                                                    itemGroup={props.data.ItemGroup}
                                                    value={props.data.DocumentLines[index]?.Item}
                                                    setValue={(newValue) => { props.setChildField('DocumentLines', 'Item', index, newValue) }}
                                                />
                                            </TableCell>
                                            <TableCell width="10%" sx={{ padding: '3px' }}>
                                                <TextField

                                                    type="text"
                                                    value={props.data.DocumentLines[index].Item?.InventoryUOM}
                                                    onChange={evt => props.setChildField('DocumentLines', 'Item', index, evt.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell width="15%" sx={{ padding: '3px' }}>
                                                <CurrencyTextField
                                                    value={props.data.DocumentLines[index]?.Quantity}
                                                    onChange={(evt, newValue) => {
                                                        props.setChildField('DocumentLines', 'Quantity', index, newValue)
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell width="15%" sx={{ padding: '3px' }}>
                                                <CurrencyTextField
                                                    value={props.data.DocumentLines[index]?.Quantity}
                                                    onChange={(evt, newValue) => {
                                                        props.setChildField('DocumentLines', 'Quantity', index, newValue)
                                                    }}
                                                    onBlur={() => { handleLineBlur(index) }}
                                                />
                                            </TableCell>
                                            <TableCell width="5%" sx={{ padding: '3px' }}>
                                                <Button
                                                    variant='outlined'
                                                    onClick={() => { props.handleDeleteLine(index) }}
                                                >
                                                    <DeleteIcon />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }) : null
                        }
                    </TableBody>
                </Table>
            </Grid>
        </Box>
    )
}