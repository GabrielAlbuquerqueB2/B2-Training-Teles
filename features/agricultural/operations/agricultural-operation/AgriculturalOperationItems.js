import { useEffect } from 'react';
import {
    Box, Grid, Typography, Table, TableHead, TableBody, TableRow, TableCell,
    TextField, Button
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import ItemAutocomplete from '../../../../components/ui/Autocomplete/ItemAutocomplete'
import Select from '../../../../components/ui/Select'
import CurrencyTextField from '../../../../components/ui/CurrencyTextField'
import { getItemInStockInWarehouse } from './AgriculturalOperationServices'

export default function AgriculturalOperationItems(props) {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant='h6'>Insumos</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell>U.M.</TableCell>
                                <TableCell>Depósito</TableCell>
                                <TableCell>Em Estoque</TableCell>
                                <TableCell>Quantidade</TableCell>
                                <TableCell>Rendimento/ha</TableCell>
                                <TableCell>Excluir</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                props.data.DocumentLines.map((item, index) => {
                                    return <AgriculturalOperationTableRow
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

function AgriculturalOperationTableRow(props) {

    const { item, index, warehouses, data, setChildField, handleDeleteLine, handleNewLine } = props

    function handleLineBlur(index) {
        const lastIndex = data.DocumentLines.length - 1
        if (data.DocumentLines[lastIndex]?.Quantity) {
            handleNewLine()
        }
    }

    const handleSetOnHand = async  () => {
        const inStock = await getItemInStockInWarehouse(
            data.DocumentLines[index]?.Item.id, 
            data.DocumentLines[index]?.WhsCode
        )
        setChildField('DocumentLines', 'OnHand', index, inStock);
    }

    return (
        <TableRow>
            <TableCell width="30%" sx={{ padding: '3px' }}>
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
            <TableCell width="15%" sx={{ padding: '3px' }}>
                <Select
                    index={index}
                    name="WhsCode"
                    father="DocumentLines"
                    list={warehouses}
                    value={data.DocumentLines[index]?.WhsCode}
                    onBlur={handleSetOnHand}
                    setState={setChildField}
                />
            </TableCell>
            <TableCell width="10%" sx={{ padding: '3px' }}>
                <TextField
                    value={data.DocumentLines[index]?.OnHand}
                    disabled
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
            <TableCell width="15%" sx={{ padding: '3px' }}>
                <CurrencyTextField
                    value={data.DocumentLines[index]?.ApplicationYeld}
                    onChange={(evt, newValue) => {
                        setChildField('DocumentLines', 'ApplicationYeld', index, newValue)

                        if (props.data.U_B2AG_PerformedArea && props.data.DocumentLines[index].ApplicationYeld) {
                            const quantity = (props.data.DocumentLines[index].ApplicationYeld * props.data.U_B2AG_PerformedArea).toFixed(4)
                            setChildField('DocumentLines', 'Quantity', index, quantity)
                        }
                    }}
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