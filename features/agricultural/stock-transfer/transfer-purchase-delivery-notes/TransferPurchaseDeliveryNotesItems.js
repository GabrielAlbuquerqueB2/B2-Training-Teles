import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, TextField } from '@mui/material'
import CurrencyTextField from '../../../../components/ui/CurrencyTextField'


export default function TransferPurchaseDeliveryNotesItems(props) {

    return (
        <TableContainer>
            <Table size="small" style={{ padding: 0 }}>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ width: '10%' }}>Código do Item</TableCell>
                        <TableCell style={{ width: '40%' }}>Descrição</TableCell>
                        <TableCell style={{ width: '15%' }}>Quantidade</TableCell>
                        <TableCell style={{ width: '10%' }}>Depósito</TableCell>
                        <TableCell style={{ width: '15%' }}>Utilização</TableCell>
                        <TableCell style={{ width: '10%' }}>Cód. de Imposto</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.data.B2AG_TFO2Collection?.map((item, index) => {
                            return (
                                <TableRow>
                                    <TableCell style={{ padding: '3px' }}>
                                        <TextField
                                            key={`ItemCode-${item.LineId}`}
                                            value={item.U_B2AG_ItemCode}
                                            disabled
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: '3px' }}>
                                        <TextField
                                            key={`ItemName-${item.LineId}`}
                                            value={item.U_B2AG_ItemName}
                                            disabled
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: '3px' }}>
                                        <CurrencyTextField
                                            key={`Quantity-${item.LineId}`}
                                            value={props.data.B2AG_TFO2Collection[index].Quantity}
                                            onChange={(event, newValue) => {
                                                props.setChildField('B2AG_TFO2Collection', 'Quantity', index, newValue)
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: '3px' }}>
                                        <TextField
                                            key={`Warehouse-${item.LineId}`}
                                            value={item.U_B2AG_Warehouse}
                                            disabled
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: '3px' }}>
                                        <TextField
                                            key={`Usage-${item.LineId}`}
                                            value={item.U_B2AG_Usage}
                                            disabled
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: '3px' }}>
                                        <TextField
                                            key={`TaxCode-${item.LineId}`}
                                            value={item.U_B2AG_TaxCode}
                                            disabled
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}