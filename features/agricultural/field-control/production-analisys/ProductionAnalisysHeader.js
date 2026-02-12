import { useState, useEffect } from 'react'
import { Box, Grid, TextField } from '@mui/material'
import Select from '../../../../components/ui/Select'
import { getAllCrops, getAllCultivations, getAllProductionUnits, mapDataToSelectComponent, mapFieldsToSelectComponent, getStageOfCulture } from './ProductionAnalisysServices'

export default function ProductionAnalisysHeader(props) {

    const [crops, setCrops] = useState([])
    const [cultivations, setCultivations] = useState([])
    const [productionUnits, setProductionUnits] = useState([])
    const stageOfCulture = getStageOfCulture()

    useEffect(() => {
        async function getData() {
            const cropsList = await getAllCrops()
            setCrops(cropsList)
            const cultivationList = await getAllCultivations()
            setCultivations(cultivationList)
            const productionUnits = await getAllProductionUnits()
            setProductionUnits(productionUnits)
        }
        getData()
    }, [])

    async function handleProductionUnitSelect() {
        const un = productionUnits.filter(unit => unit.Code === `${props.data.U_B2AG_ProductionUnitCode}`)
        if (un.length <= 0) return
        props.setFields(un[0].B2AG_PDU1Collection)
    }

    async function handleFieldSelection() {
        const fld = props.fields.filter(field => field.U_B2AG_Code === props.data.U_B2AG_Field)
        if (fld.length <= 0) return
        props.setField('U_B2AG_TotalArea', fld[0].U_B2AG_AreaHa)
    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={9} />
                    <Grid item xs={3}>
                        <TextField
                            label="Doc Num"
                            value={props.data.DocNum}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={9} />
                    <Grid item xs={3}>
                        <TextField
                            label="Status"
                            value={props.data.Status}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={9} />
                    <Grid item xs={3}>
                        <TextField
                            label="Data"
                            type="date"
                            value={props.data.U_B2AG_Date}
                            onChange={(event) => {
                                props.setField('U_B2AG_Date', event.target.value)
                            }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Select
                            name="U_B2AG_Crop"
                            label="Safra"
                            list={crops}
                            value={props.data.U_B2AG_Crop}
                            setState={props.setField}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Select
                            name="U_B2AG_CultivationCode"
                            label="Cultura"
                            list={cultivations}
                            value={props.data.U_B2AG_CultivationCode}
                            setState={props.setField}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Select
                            name="U_B2AG_ProductionUnitCode"
                            label="Unidade de Produção"
                            list={mapDataToSelectComponent(productionUnits)}
                            value={props.data.U_B2AG_ProductionUnitCode}
                            setState={props.setField}
                            onBlur={handleProductionUnitSelect}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Select
                            name="U_B2AG_Field"
                            label="Talhão"
                            list={mapFieldsToSelectComponent(props.fields)}
                            value={props.data.U_B2AG_Field}
                            setState={props.setField}
                            onBlur={handleFieldSelection}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Área Talhão"
                            value={props.data.U_B2AG_TotalArea ? props.data.U_B2AG_TotalArea + ' ha' : ''}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Área Plantio"
                            value={ '0 ha'}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Select
                            name="U_B2AG_StageOfCulture"
                            label="Estágio"
                            list={stageOfCulture}
                            value={props.data.U_B2AG_StageOfCulture}
                            setState={props.setField}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Estimativa SC/ha"
                            value={props.data.U_B2AG_ProductionEstimate}
                            onChange={(event) => {
                                props.setField('U_B2AG_ProductionEstimate', event.target.value)
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Observação"
                            multiline
                            rows={3}
                            value={props.data.Remark}
                            onChange={(event) => {
                                props.setField('Remark', event.target.value)
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}