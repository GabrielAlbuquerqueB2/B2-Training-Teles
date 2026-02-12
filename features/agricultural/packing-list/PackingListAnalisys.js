import { Table, TableContainer, TableHead, TableBody, TableFooter, TableRow, TableCell } from "@mui/material"
import CurrencyTextField from '../../../components/ui/CurrencyTextField'

export default function PackingListAnalisys(props) {

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
                                    <TableRow key={`row-${item.LineId}`}>
                                        <TableCell key={`code-${item.LineId}`}>{item.U_B2AG_Code}</TableCell>
                                        <TableCell key={`description-${item.LineId}`}>{item.U_B2AG_Description}</TableCell>
                                        <TableCell align='right' key={`cell-value-${item.LineId}`}>
                                            <CurrencyTextField
                                                key={`value-${item.LineId}`} 
                                                value={props.data.B2AG_SPK1Collection[index].U_B2AG_Value}
                                                onChange={(event, newValue) => {
                                                    props.setChildField('B2AG_SPK1Collection', 'U_B2AG_Value', index, newValue)
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