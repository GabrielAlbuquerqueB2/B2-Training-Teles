import { useEffect } from 'react'
import { Table, TableContainer, TableHead, TableBody, TableFooter, TableRow, TableCell } from "@mui/material"
import CurrencyTextField from '../../../components/ui/CurrencyTextField'

export default function GoodsReceivedNoteAnalisys(props) {

    function sumTotal() {
        if(props.data.B2AG_GRN2Collection) {
            const total = 0
            for (let item of props.data.B2AG_GRN2Collection) {
                item.U_B2AG_Quantity ? total += item.U_B2AG_Quantity : ''
            }
            props.setTotalAnalisysSum(total)       
            props.setField("U_B2AG_DiscountKg", total)
        }
    }

    useEffect(() => {
        sumTotal()
    }, [props.data.B2AG_GRN2Collection])

    return (
        <>
            <TableContainer disabled>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ width: '30%' }}>Código</TableCell>
                            <TableCell style={{ width: '30%' }}>Descrição</TableCell>
                            <TableCell align='right' style={{ width: '20%' }}>Valor (%)</TableCell>
                            {
                                !props.isThirdPartTicket &&
                                <TableCell align='right' style={{ width: '20%' }}>Quantidade</TableCell>
                            }

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            props.data.B2AG_GRN2Collection?.map((item, index) => {
                                return (
                                    <TableRow key={item.LineId}>
                                        <TableCell>
                                            <TableCell>{item.U_B2AG_Code}</TableCell>
                                        </TableCell>
                                        <TableCell>{item.U_B2AG_Description}</TableCell>
                                        <TableCell align='right'>
                                            <CurrencyTextField
                                                value={props.data.B2AG_GRN2Collection[index].U_B2AG_Value}
                                                disabled={props.data.Status === 'C'}
                                                onChange={(event, newValue) => {
                                                    props.setChildField('B2AG_GRN2Collection', 'U_B2AG_Value', index, newValue)
                                                }}
                                                onBlur={() => {
                                                    if (!props.isThirdPartTicket) {                                                        
                                                        const discount = props.handleAnalisysValue(item.U_B2AG_Code, props.data.B2AG_GRN2Collection[index].U_B2AG_Value)
                                                        console.log(discount)
                                                        const typeDiscount = ((discount * props.data.U_B2AG_NetWeight) / 100)
                                                        props.setChildField('B2AG_GRN2Collection', 'U_B2AG_Quantity', index, typeDiscount)
                                                        sumTotal()
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        {
                                            !props.isThirdPartTicket &&
                                            <TableCell align='right'>
                                                <CurrencyTextField
                                                    value={props.data.B2AG_GRN2Collection[index].U_B2AG_Quantity ? props.data.B2AG_GRN2Collection[index].U_B2AG_Quantity : 0}
                                                    onChange={(event, newValue) => {
                                                        props.setChildField('B2AG_GRN2Collection', 'U_B2AG_Quantity', index, newValue)
                                                    }}
                                                    disabled
                                                />
                                            </TableCell>
                                        }
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            {
                                !props.isThirdPartTicket &&
                                <>
                                    <TableCell>Total</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell align='right'>{props.totalAnalisysSum}</TableCell>
                                </>
                            }
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </>
    )
}