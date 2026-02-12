import { useState, useEffect } from 'react'
import { Table, TableContainer, TableHead, TableBody, TableFooter, TableRow, TableCell, TextField } from "@mui/material"
import CurrencyTextField from '../../../components/ui/CurrencyTextField'
import Select from '../../../components/ui/Select'
import { getVarietiesByCultivation } from './GoodsReceivedNoteServices'

export default function GoodsReceivedNoteVariety(props) {

    const [varietyList, setVarietyList] = useState([])

    function handleAddLine() {
        const lastIndex = props.data.B2AG_GRN1Collection.length - 1
        if (props.data.B2AG_GRN1Collection[lastIndex].U_B2AG_Variety) {
            props.addLineToVariety()
        }
    }

    useEffect(async () => {

        const varieties = await getVarietiesByCultivation(props.data.U_B2AG_Cultivation)
        setVarietyList(varieties)

    }, [props.data.U_B2AG_Cultivation])

    useEffect(() => {

        if (props.data.B2AG_GRN1Collection) {

            const total = 0
            for (let item of props.data.B2AG_GRN1Collection) {
                item.U_B2AG_Quantity ? total += item.U_B2AG_Quantity : ''
            }
            props.setTotalVarietySum(total)
        }
    })

    return (
        <>
            <TableContainer disabled>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ width: '30%' }}>Talhão</TableCell>
                            <TableCell style={{ width: '30%' }}>Variedade</TableCell>
                            <TableCell align='right' style={{ width: '20%' }}>Quantidade</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            props.data.B2AG_GRN1Collection?.map((item, index) => {
                                return (
                                    <TableRow key={item.LineId}>
                                        <TableCell>
                                            <TextField
                                                id="U_B2AG_Field"
                                                value={props.data.B2AG_GRN1Collection[index].U_B2AG_Field}
                                                onChange={(event) => {
                                                    props.setChildField("B2AG_GRN1Collection", 'U_B2AG_Field', index, event.target.value)
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                index={index}
                                                father="B2AG_GRN1Collection"
                                                name="U_B2AG_Variety"
                                                list={varietyList}
                                                value={props.data.B2AG_GRN1Collection[index].U_B2AG_Variety}
                                                setState={props.setChildField}
                                                disabled={props.data.Status === 'C'}
                                            />
                                        </TableCell>
                                        <TableCell align='right'>
                                            <CurrencyTextField
                                                value={props.data.B2AG_GRN1Collection[index].U_B2AG_Quantity}
                                                onChange={(event, newValue) => {
                                                    props.setChildField("B2AG_GRN1Collection", 'U_B2AG_Quantity', index, newValue)
                                                }}
                                                onBlur={handleAddLine}
                                                disabled={props.data.Status === 'C'}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell>Total</TableCell>
                            <TableCell></TableCell>
                            <TableCell align='right'>{props.totalVarietySum}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </>
    )
}