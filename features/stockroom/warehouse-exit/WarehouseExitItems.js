import {
    Box, Grid, Table, TableHead, TableBody, TableRow, TableCell,
    TextField, Button
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import ItemAutocomplete from '../../../components/ui/Autocomplete/ItemAutocomplete'
import Select from '../../../components/ui/Select'
import CurrencyTextField from '../../../components/ui/CurrencyTextField'

export default function WarehouseExitItems(props) {
    
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell>U.M.</TableCell>
                                <TableCell>Depósito</TableCell>
                                <TableCell>Quantidade</TableCell>
                                <TableCell>Excluir</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                props.data.DocumentLines.map((item, index) => {
                                    return <WarehouseExitTableRow
                                        data={props.data}
                                        setChildField={props.setChildField}
                                        item={item}
                                        index={index}
                                        warehouses={props.warehouses}
                                        handleDeleteLine={props.handleDeleteLine}
                                        handleNewLine={props.handleNewLine}
                                    />
                                })
                            }
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        </Box>
    )
}

function WarehouseExitTableRow(props) {

    const { item, index, warehouses, data, setChildField, handleDeleteLine, handleNewLine } = props

    function handleLineBlur(index) {
        const lastIndex = data.DocumentLines.length - 1
        if (data.DocumentLines[lastIndex]?.Quantity) {
            handleNewLine()
        }
    }

    return (
        <TableRow>
            <TableCell width="50%" sx={{ padding: '3px' }}>
                <ItemAutocomplete               
                    name="Item"
                    value={data.DocumentLines[index]?.Item}
                    setValue={(newValue) => { props.setChildField('DocumentLines', 'Item', index, newValue) }}
                />
            </TableCell>
            <TableCell width="10%" sx={{ padding: '3px' }}>
                <TextField
                    value={data.DocumentLines[index]?.Item?.InventoryUOM}
                    disabled
                />
            </TableCell>
            <TableCell width="20%" sx={{ padding: '3px' }}>
                <Select
                    index={index}
                    name="WhsCode"
                    father="DocumentLines"
                    list={warehouses}
                    value={data.DocumentLines[index]?.WhsCode}
                    setState={setChildField}
                />
            </TableCell>
            <TableCell width="15%" sx={{ padding: '3px' }}>
                <CurrencyTextField
                    value={data.DocumentLines[index]?.Quantity}
                    onChange={(evt, newValue) => {
                        setChildField('DocumentLines', 'Quantity', index, newValue)

                        if (props.data.U_B2AG_PerformedArea && props.data.DocumentLines[index].Quantity) {
                            const quantityYeld = (props.data.DocumentLines[index].Quantity / props.data.U_B2AG_PerformedArea).toFixed(4)
                            setChildField('DocumentLines', 'ApplicationYeld', index, quantityYeld)
                        }
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
}