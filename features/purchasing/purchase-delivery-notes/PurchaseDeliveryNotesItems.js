import {
    Box, Grid, Table, TableHead, TableBody, TableRow, TableCell, Button
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ItemAutocomplete from '../../../components/ui/Autocomplete/ItemAutocomplete'
import Select from '../../../components/ui/Select'
import CurrencyTextField from '../../../components/ui/CurrencyTextField'
import WarehouseByBranchSelect from '../../../components/ui/Select/WarehousesByBranchSelect'

export default function PurchaseDeliveryNotesItems(props) {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell>Qtde/UM</TableCell>
                                <TableCell>Quantidade Recebida</TableCell>
                                <TableCell>Un. Med.</TableCell>
                                <TableCell >Valor Unitário</TableCell>
                                <TableCell>Depósito</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Excluir</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                props.data.DocumentLines.map((item, index) => {
                                    return <PurchaseDeliveryNotesTableRow
                                        index={index}
                                        data={props.data}
                                        setChildField={props.setChildField}
                                        setData={props.setData}
                                        item={item}
                                        purchaseOrder={props.purchaseOrder}
                                        status={props.status}
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

function PurchaseDeliveryNotesTableRow(props) {

    const { data, index, item, setChildField, purchaseOrder, setData } = props

    function handleDeleteLine(index) {
        if (data.DocumentLines.length <= 1) return;
        let newData = { ...data }
        newData.DocumentLines.splice(index, 1)
        setData(newData)
    }


    function handleTotal(index, setChildField) {

        if (data.DocumentLines[index]?.Quantity && data.DocumentLines[index]?.Price) {
            const total = data.DocumentLines[index]?.Quantity * data.DocumentLines[index]?.Price
            setChildField('DocumentLines', 'LineTotal', index, total)
        }
    }

    return (
        <TableRow>
            <TableCell width="35%" sx={{ padding: '3px' }}>
                <ItemAutocomplete
                    name="Item"
                    value={data.DocumentLines[index]?.Item}
                    setValue={(newValue) => { props.setChildField('DocumentLines', 'Item', index, newValue) }}
                    disabled={props.status === 'UPDATE'}
                />
            </TableCell>
            <TableCell width="5%" sx={{ padding: '3px' }} align='center'>
                {item.RemainingOpenQuantity} / {item.MeasureUnit}
            </TableCell>
            <TableCell width="10%" sx={{ padding: '3px' }}>
                <CurrencyTextField
                    value={data.DocumentLines[index]?.Quantity}
                    onChange={(evt, newValue) => {
                        setChildField('DocumentLines', 'Quantity', index, newValue)
                    }}
                    onBlur={() => {
                        handleTotal(index, setChildField)
                    }}
                    disabled={props.status === 'UPDATE'}
                />
            </TableCell>
            <TableCell width="10%" sx={{ padding: '3px' }}>
                <Select
                    index={index}
                    name="UoM"
                    father="DocumentLines"
                    list={data.DocumentLines[index]?.UoMList}
                    value={data.DocumentLines[index]?.UoM}
                    setState={setChildField}
                    disabled={props.status === 'UPDATE'}
                />
            </TableCell>
            <TableCell width="10%" sx={{ padding: '3px' }}>
                <CurrencyTextField
                    value={data.DocumentLines[index]?.Price}
                    onChange={(evt, newValue) => {
                        setChildField('DocumentLines', 'Price', index, newValue)
                    }}
                    onBlur={() => {
                        handleTotal(index, setChildField)
                    }}
                    disabled={props.status === 'UPDATE'}
                />
            </TableCell>
            <TableCell width="10%" sx={{ padding: '3px' }}>
                <WarehouseByBranchSelect
                    index={index}
                    name="WhsCode"
                    father="DocumentLines"
                    value={data.DocumentLines[index]?.WhsCode}
                    setState={setChildField}
                    branch={purchaseOrder.BPL_IDAssignedToInvoice}
                    disabled={props.status === 'UPDATE'}
                />
            </TableCell>
            <TableCell width="10%" sx={{ padding: '3px' }}>
                <CurrencyTextField
                    value={data.DocumentLines[index]?.LineTotal}
                    onChange={(evt, newValue) => {
                        setChildField('DocumentLines', 'LineTotal', index, newValue)
                    }}
                    disabled
                />
            </TableCell>
            <TableCell width="5%" sx={{ padding: '3px' }}>
                <Button
                    variant='outlined'
                    onClick={() => { handleDeleteLine(index) }}
                >
                    <DeleteIcon />
                </Button>
            </TableCell>
        </TableRow>
    )
}