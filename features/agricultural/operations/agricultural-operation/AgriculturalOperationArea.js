
import { useState, useEffect } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import Select from '../../../../components/ui/Select'
import CurrencyTextField from '../../../../components/ui/CurrencyTextField'
import { getAllCultivations, mapFieldsToSelectComponent, mapDataToSelectComponent, mapWarehousesToSelectComponent } from './AgriculturalOperationServices'
import { getWarehousesByLocation } from '../../../../utils/getUserLocationsByAssignment'
import  UserLocationsSelect  from '../../../../components/ui/Select/UserLocationsSelect'

export default function AgriculturalOperationArea(props) {

    const [cultivations, setCultivartion] = useState([])

    useEffect(() => {
        async function getData() {
            const cultivationList = await getAllCultivations()
            setCultivartion(cultivationList)
        }
        getData()
    }, [])

    async function handleFieldSelection() {
        const fld = props.fields.filter(field => field.U_B2AG_Code === props.data.U_B2AG_Field)
        if (fld.length <= 0) return
        props.setField('U_B2AG_TotalArea', fld[0].U_B2AG_AreaHa)
    }

    async function handleProductionUnitSelect() {
        const un = props.productionUnits.filter(unit => unit.Code === `${props.data.U_B2AG_ProductionUnitCode}`)
        if (un.length <= 0) return
        props.setField('U_B2AG_Branch', un[0].Name)
        props.setFields(un[0].B2AG_PDU1Collection)
        await setWarehousesListByLocation(un[0].Code)
    }

    async function setWarehousesListByLocation(unitCode) {       
        const whs = await getWarehousesByLocation(unitCode)         
        props.setWarehouses(mapWarehousesToSelectComponent(whs))
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant='h6'>Área</Typography>
                </Grid>
                <Grid item xs={8}>
                    <UserLocationsSelect
                        name="U_B2AG_ProductionUnitCode"
                        label="Unidade de Produção"
                        value={props.data.U_B2AG_ProductionUnitCode}
                        setState={props.setField}
                        onBlur={handleProductionUnitSelect}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Select
                        name="U_B2AG_Field"
                        label="Talhão"
                        list={mapFieldsToSelectComponent(props.fields)}
                        value={props.data.U_B2AG_Field}
                        setState={props.setField}
                        onBlur={handleFieldSelection}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Select
                        name="U_B2AG_Cultivation"
                        label="Cultura"
                        list={cultivations}
                        value={props.data.U_B2AG_Cultivation}
                        setState={props.setField}
                    />
                </Grid>
                <Grid item xs={3}>
                    <CurrencyTextField
                        label="Área Total"
                        value={props.data.U_B2AG_TotalArea}
                        disabled
                    />
                </Grid>
                <Grid item xs={3}>
                    <CurrencyTextField
                        label="Área Realizada"
                        value={props.data.U_B2AG_PerformedArea}
                        onChange={(evt, newValue) => props.setField('U_B2AG_PerformedArea', newValue)}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}
