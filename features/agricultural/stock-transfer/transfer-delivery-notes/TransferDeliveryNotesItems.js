import { useState, useEffect } from 'react'
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, TextField } from '@mui/material'
import CurrencyTextField from '../../../../components/ui/CurrencyTextField'
import Select from '../../../../components/ui/Select'
import { getVarietiesByItemCode } from './TransferDeliveryNotesServices'

export default function TransferDeliveryNotesItems(props) {

    const [varietyList, setVarietyList] = useState([])

    useEffect(async () => {

        if (props.data.B2AG_TFO1Collection) {
            const varieties = await getVarietiesByItemCode(props.data.B2AG_TFO1Collection[0].U_B2AG_ItemCode)
            setVarietyList(varieties)
        }

    }, [props.data.B2AG_TFO1Collection])

    function handleVarietySelect() {
        if (props.data.B2AG_TFO1Collection) {
            const cultivation = varietyList.filter(item => {
                return props.data.B2AG_TFO1Collection[0].U_B2AG_Variety === item.description
            })
            if(cultivation) {
                props.setField('U_B2AG_Cultivation', cultivation[0].cultivation)                
            }
        }
    }

    return (
        <TableContainer>
            <Table size="small" style={{ padding: 0 }}>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ width: '10%' }}>Código do Item</TableCell>
                        <TableCell style={{ width: '25%' }}>Descrição</TableCell>
                        <TableCell style={{ width: '15%' }}>Quantidade</TableCell>
                        <TableCell style={{ width: '15%' }}>Variedade</TableCell>
                        <TableCell style={{ width: '10%' }}>Depósito</TableCell>
                        <TableCell style={{ width: '15%' }}>Utilização</TableCell>
                        <TableCell style={{ width: '10%' }}>Cód. de Imposto</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.data.B2AG_TFO1Collection?.map((item, index) => {
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
                                            value={props.data.B2AG_TFO1Collection[index].Quantity}
                                            onChange={(event, newValue) => {
                                                props.setChildField('B2AG_TFO1Collection', 'Quantity', index, newValue)
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: '3px' }}>
                                        <Select
                                            index={index}
                                            father="B2AG_TFO1Collection"
                                            name="U_B2AG_Variety"
                                            list={varietyList}
                                            value={props.data.B2AG_TFO1Collection[index].U_B2AG_Variety}
                                            setState={props.setChildField}
                                            onBlur={handleVarietySelect}
                                            disabled={props.data.U_B2AG_DeliveryType !== 'Semente'}
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