import { Grid } from '@mui/material';
import CurrencyTextField from '../../../components/ui/CurrencyTextField';

export default function PackingListWeighting(props) {

    function attLiquidWeight() {
        const liquidWeight = (props.data.U_B2AG_GrossWeight - props.data.U_B2AG_TareWeight) - props.data.U_B2AG_PackingWeight
        props.setField("U_B2AG_LiquidWeight", liquidWeight)
    }

    return (
        <Grid container spacing={2}>
            <Grid item style={{ width: '25%' }}>
                <CurrencyTextField
                    label="Peso Tara"
                    value={props.data.U_B2AG_TareWeight}
                    onChange={(event, newValue) => {
                        props.setField("U_B2AG_TareWeight", newValue)
                    }}
                    onBlur={attLiquidWeight}
                    disabled={props.isDisabled}
                />
            </Grid>
            <Grid item style={{ width: '25%' }}>
                <CurrencyTextField
                    label="Peso Bruto"
                    value={props.data.U_B2AG_GrossWeight}
                    onChange={(event, newValue) => {
                        props.setField("U_B2AG_GrossWeight", newValue)
                    }}
                    onBlur={attLiquidWeight}
                    disabled={props.isDisabled}
                />
            </Grid>
            <Grid item style={{ width: '25%' }}>
                <CurrencyTextField
                    label="Peso Embalagem"
                    value={props.data.U_B2AG_PackingWeight}
                    onChange={(event, newValue) => {
                        props.setField("U_B2AG_PackingWeight", newValue)
                    }}
                    onBlur={attLiquidWeight}
                    disabled={props.isDisabled}
                />
            </Grid>
            <Grid item style={{ width: '25%' }}>
                <CurrencyTextField
                    label="Peso Líquido"
                    value={props.data.U_B2AG_LiquidWeight}
                    onChange={(event, newValue) => {
                        props.setField("U_B2AG_LiquidWeight", newValue)
                    }}
                    disabled
                />
            </Grid>
        </Grid>
    )
}