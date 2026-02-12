import { Table, TableContainer, TableHead, TableBody, TableFooter, TableRow, TableCell } from "@mui/material"
import CurrencyTextField from '../../../components/ui/CurrencyTextField'

export default function PackingListAnalisysFinal(props) {

    return (
        <>
            <TableContainer disabled>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ width: '30%' }}>Código</TableCell>
                            <TableCell style={{ width: '30%' }}>Descrição</TableCell>
                            <TableCell align='right' style={{ width: '20%' }}>Valor (%)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            props.data?.B2AG_SPK1Collection.map((item, index) => {
                                return (
                                    <TableRow key={`final-row-${item.LineId}`}>
                                        <TableCell key={`final-code-${item.LineId}`}>{item.U_B2AG_Code}</TableCell>
                                        <TableCell key={`final-description-${item.LineId}`}>{item.U_B2AG_Description}</TableCell>
                                        <TableCell align='right' key={`final-cell-value-${item.LineId}`}>
                                            <CurrencyTextField
                                                key={`final-value-${item.LineId}`}
                                                value={props.data.B2AG_SPK1Collection[index].U_B2AG_ValueFinal}
                                                onChange={(event, newValue) => {
                                                    props.setChildField('B2AG_SPK1Collection', 'U_B2AG_ValueFinal', index, newValue)
                                                }}
                                                disabled={props.isDisabled}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}