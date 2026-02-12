import { useEffect } from 'react'
import { Table, TableContainer, TableHead, TableBody, TableFooter, TableRow, TableCell } from "@mui/material"
import CurrencyTextField from '../../../components/ui/CurrencyTextField'

export default function HarvestTicketAnalisys(props) {

    function sumTotal() {
        if (props.data.B2AG_PKL2Collection) {
            const total = 0
            for (let item of props.data.B2AG_PKL2Collection) {
                item.U_B2AG_Quantity ? total += item.U_B2AG_Quantity : ''
            }
            props.setTotalAnalisysSum(total)
            props.setField("U_B2AG_DiscountKg", total)
        }
    }

    useEffect(() => {
        sumTotal()
    }, [props.data.B2AG_PKL2Collection])

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
                            props.data.B2AG_PKL2Collection?.map((item, index) => {
                                return (
                                    <TableRow key={item.LineId}>
                                        <TableCell>
                                            <TableCell>{item.U_B2AG_Code}</TableCell>
                                        </TableCell>
                                        <TableCell>{item.U_B2AG_Description}</TableCell>
                                        <TableCell align='right'>
                                            <CurrencyTextField
                                                value={props.data.B2AG_PKL2Collection[index].U_B2AG_Value}
                                                disabled={props.data.Status === 'C'}
                                                decimalPlaces={2}
                                                onChange={(event, newValue) => {
                                                    props.setChildField('B2AG_PKL2Collection', 'U_B2AG_Value', index, newValue)
                                                }}
                                                onBlur={() => {
                                                    if (!props.isThirdPartTicket) {
                                                        const discount = props.handleAnalisysValue(item.U_B2AG_Code, props.data.B2AG_PKL2Collection[index].U_B2AG_Value)
                                                        const typeDiscount = ((discount * props.data.U_B2AG_NetWeight) / 100)
                                                        props.setChildField('B2AG_PKL2Collection', 'U_B2AG_Quantity', index, typeDiscount)
                                                        sumTotal()
                                                    }
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell align='right'>
                                            <CurrencyTextField
                                                value={props.data.B2AG_PKL2Collection[index].U_B2AG_Quantity ? props.data.B2AG_PKL2Collection[index].U_B2AG_Quantity : 0}
                                                decimalPlaces={2}
                                                onChange={(event, newValue) => {
                                                    console.log(props.data.B2AG_PKL2Collection[index].U_B2AG_Quantity)
                                                    props.setChildField('B2AG_PKL2Collection', 'U_B2AG_Quantity', index, newValue)
                                                    sumTotal()
                                                }}
                                                disabled={props.data.Status === 'C' || !props.isThirdPartTicket}
                                            />
                                        </TableCell>

                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow>

                            <>
                                <TableCell>Total</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell align='right'>{ props.totalAnalisysSum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                            </>

                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </>
    )
}