import { useEffect } from 'react'
import { Box, Grid } from '@mui/material'
import CurrencyTextField from '../../../components/ui/CurrencyTextField'

export default function GoodsReceivedNoteWeighing(props) {

    function refreshNetWeight() {
        const netWeight = props.data.U_B2AG_GrossWeight - props.data.U_B2AG_TareWeight
        props.setField("U_B2AG_NetWeight", netWeight)

    }

    useEffect(() => {

        const liquidWeight = props.data.U_B2AG_NetWeight - props.data.U_B2AG_DiscountKg

        props.setField("U_B2AG_LiquidWeight", liquidWeight)

    }, [props.data.U_B2AG_NetWeight, props.data.U_B2AG_DiscountKg])

    useEffect(() => {
        if (props.data.B2AG_GRN2Collection) {
            const mappedObject = props.data.B2AG_GRN2Collection.map(item => {
                const discount = props.handleAnalisysValue(item.U_B2AG_Code, item.U_B2AG_Value)
                return {
                    ...item,
                    U_B2AG_Quantity: ((discount * props.data.U_B2AG_NetWeight) / 100)
                }
            })
            props.setField("B2AG_GRN2Collection", mappedObject)
        }

    }, [props.data.U_B2AG_NetWeight])

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item style={{ width: '20%' }}>
                        <CurrencyTextField
                            label="Peso Bruto"
                            value={props.data.U_B2AG_GrossWeight}
                            onChange={(event, newValue) => {
                                props.setField("U_B2AG_GrossWeight", newValue)
                            }}
                            onBlur={refreshNetWeight}
                            disabled={props.data.Status === 'C'}
                        />
                    </Grid>
                    <Grid item style={{ width: '20%' }}>
                        <CurrencyTextField
                            label="Peso Tara"
                            value={props.data.U_B2AG_TareWeight}
                            onChange={(event, newValue) => {
                                props.setField("U_B2AG_TareWeight", newValue)
                            }}
                            onBlur={refreshNetWeight}
                            disabled={props.data.Status === 'C'}
                        />
                    </Grid>
                    <Grid item style={{ width: '20%' }}>
                        <CurrencyTextField
                            label="Peso Neto"
                            value={props.data.U_B2AG_NetWeight}
                            disabled
                        />
                    </Grid>
                    <Grid item style={{ width: '20%' }}>
                        <CurrencyTextField
                            label="Desconto Kg"
                            value={props.data.U_B2AG_DiscountKg}
                            disabled={!props.isThirdPartTicket}
                        />
                    </Grid>
                    <Grid item style={{ width: '20%' }}>
                        <CurrencyTextField
                            label="Peso Líquido"
                            value={props.data.U_B2AG_LiquidWeight}
                            disabled
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}