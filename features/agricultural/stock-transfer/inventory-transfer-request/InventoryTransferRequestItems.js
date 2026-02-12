import { Table, Box, Grid, TableCell, TableRow, TableHead, TableBody, Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import CurrencyTextField from '../../../../components/ui/CurrencyTextField/CurrencyTextField'
import ItemAutocomplete from '../../../../components/ui/Autocomplete/ItemAutocomplete'

export default function InventoryTransferRequestItems(props) {

    const { isClosed } = props

    function handleLineBlur(index) {
        const lastIndex = props.data.StockTransferLines.length - 1
        if (props.data.StockTransferLines[lastIndex]?.Quantity) {
            props.handleNewLine()
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item</TableCell>                                
                                <TableCell>Quantidade</TableCell>
                                <TableCell>Excluir</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                props.data.StockTransferLines ?
                                    props.data.StockTransferLines?.map((item, index) => {
                                        return (
                                            <TableRow>
                                                <TableCell width="80%" sx={{ padding: '3px' }}>
                                                    <ItemAutocomplete
                                                        name="Item"
                                                        value={props.data.StockTransferLines[index]?.Item}
                                                        setValue={(newValue) => { props.setChildField('StockTransferLines', 'Item', index, newValue) }}
                                                        disabled={isClosed}
                                                    />
                                                </TableCell>                                                
                                                <TableCell width="15%" sx={{ padding: '3px' }}>
                                                    <CurrencyTextField
                                                        value={props.data.StockTransferLines[index]?.Quantity}
                                                        onChange={(evt, newValue) => {
                                                            props.setChildField('StockTransferLines', 'Quantity', index, newValue)
                                                        }}
                                                        onBlur={() => { handleLineBlur(index) }}
                                                        disabled={isClosed}
                                                    />
                                                </TableCell>
                                                <TableCell width="5%" sx={{ padding: '3px' }}>
                                                    <Button
                                                        variant='outlined'
                                                        onClick={() => { props.handleDeleteLine(index) }}
                                                        disabled={isClosed}
                                                    >
                                                        <DeleteIcon />
                                                    </Button>
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
    )

}