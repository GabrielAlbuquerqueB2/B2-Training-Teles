import { Box, Grid } from '@mui/material'
import Select from '../../../components/ui/Select'

export default function GoodsReceivedNoteRecipient(props) {

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {
                            props.isThirdPartTicket &&
                            <Select
                                name="U_B2AG_DeliveryPlace"
                                label="Local de Entrega"
                                list={props.deliveryPlaces}
                                value={props.data.U_B2AG_DeliveryPlace}
                                setState={props.setField}
                            />
                        }
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}