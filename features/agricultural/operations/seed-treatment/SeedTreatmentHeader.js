import { TextField, Grid, Box } from '@mui/material'
import Select from '../../../../components/ui/Select'
import UserLocationsSelect from '../../../../components/ui/Select/UserLocationsSelect'
import ProductTreesAutocomplete from '../../../../components/ui/Autocomplete/ProductTreesAutocomplete'
import CurrencyTextField from '../../../../components/ui/CurrencyTextField/CurrencyTextField'

export default function SeedTreatmentHeader(props) {

    async function handleProductionUnitSelect() {
        const warehouses = await props.getWarehouses(props.data.U_B2AG_ProductionUnitCode)
        props.setWarehousesList(warehouses)
    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={9}></Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="DocNum"
                            value={props.id}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={9}></Grid>
                    <Grid item xs={3}>
                        <Select
                            label="Status"
                            value={props.data.ProductionOrderStatus}
                            setState={(newValue) => {
                                props.setField("ProductionOrderStatus", newValue)
                            }}
                            list={props.selectList}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={9}></Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Data"
                            type="date"
                            value={props.data.PostingDate}
                            onChange={(e) => props.setField("PostingDate", e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={9}></Grid>
                    <Grid item xs={3}>
                        <Select
                            label="Safra"
                            list={props.cropsList}
                            value={props.data?.U_B2AG_Crop}
                            setState={(newValue) => {
                                props.setField("U_B2AG_Crop", newValue)
                            }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <UserLocationsSelect
                            name="U_B2AG_ProductionUnitCode"
                            label="Unidade de Produção"
                            value={props.data.U_B2AG_ProductionUnitCode}
                            setState={props.setField}
                            onBlur={handleProductionUnitSelect}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <Select
                            name="WhsCode"
                            list={props.warehousesList}
                            value={props.data.WhsCode}
                            setState={props.setField}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <ProductTreesAutocomplete
                            name="Item Tratado"
                            value={props.data.ProductTree}
                            setValue={(newValue) => {
                                props.setField("ProductTree", newValue)
                            }}
                            disabled={props.status === 'EDIT'}
                        />
                    </Grid>
                    
                    <Grid item xs={3}>
                        <CurrencyTextField
                        label="Quantidade Tratada"
                        decimalPlaces={2}
                        value={props.data.PlannedQuantity}
                        />
                    </Grid>

                </Grid>
            </Box>
        </>
    )
}