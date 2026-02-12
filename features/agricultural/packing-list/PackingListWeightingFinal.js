import { Grid } from '@mui/material';
import CurrencyTextField from '../../../components/ui/CurrencyTextField';

export default function PackingListWeightingFinal(props) {

    function attLiquidWeight() {
        const liquidWeight = (props.data.U_B2AG_GrossWeightFinal - props.data.U_B2AG_TareWeightFinal)
        props.setField("U_B2AG_LiquidWeightFinal", liquidWeight)
    }

    return (
        <Grid container spacing={2}>
            <Grid item style={{ width: '25%' }}>
                <CurrencyTextField
                    label="Peso Tara"
                    value={props.data.U_B2AG_TareWeightFinal}
                    onChange={(event, newValue) => {
                        props.setField("U_B2AG_TareWeightFinal", newValue)
                    }}
                    onBlur={attLiquidWeight}
                    disabled={props.isDisabled}
                />
            </Grid>
            <Grid item style={{ width: '25%' }}>
                <CurrencyTextField
                    label="Peso Bruto"
                    value={props.data.U_B2AG_GrossWeightFinal}
                    onChange={(event, newValue) => {
                        props.setField("U_B2AG_GrossWeightFinal", newValue)
                    }}
                    onBlur={attLiquidWeight}
                    disabled={props.isDisabled}
                />
            </Grid>
            <Grid item style={{ width: '25%' }}>
                <CurrencyTextField
                    label="Peso Líquido"
                    value={props.data.U_B2AG_LiquidWeightFinal}
                    onChange={(event, newValue) => {
                        props.setField("U_B2AG_LiquidWeightFinal", newValue)
                    }}
                    disabled
                />
            </Grid>
        </Grid>
    )
}