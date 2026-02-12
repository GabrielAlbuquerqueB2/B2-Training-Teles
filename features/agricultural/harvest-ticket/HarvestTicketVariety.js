import { useState, useEffect } from 'react'
import { Table, TableContainer, TableHead, TableBody, TableFooter, TableRow, TableCell } from "@mui/material"
import CurrencyTextField from '../../../components/ui/CurrencyTextField'
import Select from '../../../components/ui/Select'
import { getVarietiesByCultivation } from './HarvestTicketServices'

export default function HarvestTicketVariety(props) {

    const [varietyList, setVarietyList] = useState([])

    function handleAddLine() {
        const lastIndex = props.data.B2AG_PKL1Collection.length - 1
       if(props.data.B2AG_PKL1Collection[lastIndex].U_B2AG_Variety)  {
            props.addLineToVariety()
        }
    }

    useEffect(async () => {

        const varieties = await getVarietiesByCultivation(props.data.U_B2AG_Cultivation)
        setVarietyList(varieties)

    },[props.data.U_B2AG_Cultivation])

    useEffect(() => {
      
        if(props.data.B2AG_PKL1Collection) {

            const total = 0
            for(let item of props.data.B2AG_PKL1Collection) {               
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
                            props.data.B2AG_PKL1Collection?.map((item, index) => {
                                return (
                                    <TableRow key={item.LineId}>
                                        <TableCell>
                                            <Select  
                                                index={index}
                                                father="B2AG_PKL1Collection"                                               
                                                name="U_B2AG_Field"
                                                list={props.fieldsList}
                                                value={props.data.B2AG_PKL1Collection[index].U_B2AG_Field}
                                                setState={props.setChildField}
                                                disabled={props.data.Status === 'C'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Select                  
                                                index={index}
                                                father="B2AG_PKL1Collection"                              
                                                name="U_B2AG_Variety"
                                                list={varietyList}
                                                value={props.data.B2AG_PKL1Collection[index].U_B2AG_Variety}
                                                setState={props.setChildField}
                                                disabled={props.data.Status === 'C'}
                                            />
                                        </TableCell>
                                        <TableCell align='right'>                                            
                                            <CurrencyTextField                                               
                                                value={props.data.B2AG_PKL1Collection[index].U_B2AG_Quantity}
                                                onChange={(event, newValue) => {
                                                    props.setChildField("B2AG_PKL1Collection", 'U_B2AG_Quantity', index, newValue)
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
                            <TableCell align='right'>{props.totalVarietySum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </>
    )
}