import { useState, useEffect } from 'react'
import { Box, Grid, TextField } from '@mui/material'
import Select from '../../../components/ui/Select'
import BusinessPartnerAutocomplete from '../../../components/ui/Autocomplete/BusinessPartnerAutocomplete'
import {
    getAllCrops, getFederalUnities, mapDataToSelectComponent, getAllCultivations, getBatchesByCultivation, getCultivationById, getBranchByLocationId
} from './GoodsReceivedNoteServices'

export default function GoodsReceivedNoteHeader(props) {

    const [crops, setCrops] = useState([])
    const [federalUnities] = useState(getFederalUnities())
    const [cultivations, setCultivartion] = useState([])
    const [batches, setBatches] = useState([])

    useEffect(() => {
        async function getData() {
            const cropsList = await getAllCrops()
            setCrops(cropsList)
        }
        getData()
    }, [])

    useEffect(() => {
        async function getData() {
            const cultivationList = await getAllCultivations()
            setCultivartion(mapDataToSelectComponent(cultivationList))
        }
        getData()
    }, [])

    useEffect(() => {
        async function getData() {
            const cultivationList = await getAllCultivations()
            setCultivartion(mapDataToSelectComponent(cultivationList))
        }
        getData()
    }, [])


    async function handleCultivationSelection() {
        await handleBatches()
        if (props.id === 'new') {
            await handleAnalysisByCultivation()
            await props.getAnalysisTypesByCultivation(props.data.U_B2AG_Cultivation)
        }
    }

    async function handleBatches() {
        setBatches([])
        const batchesList = await getBatchesByCultivation(props.data.U_B2AG_Cultivation)
        const mappedBatches = batchesList.map(batch => {
            return {
                value: batch.BatchNumberDetails.Batch,
                description: batch.BatchNumberDetails.Batch
            }
        })
        setBatches(mappedBatches)
    }

    async function handleAnalysisByCultivation() {
        const cultivation = await getCultivationById(props.data.U_B2AG_Cultivation)
        if (cultivation) {
            props.setField('B2AG_GRN2Collection', cultivation.B2AG_CLT1Collection)
        }
    }

    function mapContractDataToSelectComponent(items) {
        return items.map((item) => {
            return {
                value: item.DocNum,
                description: `${item.DocNum} - ${item.CardName} ${item.NumAtCard ? ' - ' + item.NumAtCard : ''}`
            }
        })
    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={9}></Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="DocNum"
                            disabled
                            value={props.data.DocNum}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Select
                            name="U_B2AG_Contract"
                            label="Contrato"
                            list={mapContractDataToSelectComponent(props.contractList)}
                            value={props.data.U_B2AG_Contract}
                            setState={props.setField}
                            disabled={props.data.Status === 'C'}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="U_B2AG_Date"
                            label="Data"
                            type="date"
                            value={props.data.U_B2AG_Date}
                            onChange={evt => props.setField('U_B2AG_Date', evt.target.value)}
                            disabled={props.data.Status === 'C'}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="U_B2AG_Time"
                            label="Hora"
                            type="time"
                            value={props.data.U_B2AG_Time}
                            onChange={evt => props.setField('U_B2AG_Time', evt.target.value)}
                            disabled={props.data.Status === 'C'}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Status"
                            disabled
                            value={props.data.Status}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Select
                            name="U_B2AG_Crop"
                            label="Safra"
                            list={crops}
                            value={props.data.U_B2AG_Crop}
                            setState={props.setField}
                            disabled={props.data.Status === 'C'}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="U_B2AG_CCG"
                            label="CCG"
                            value={props.data.U_B2AG_CCG}
                            onChange={evt => props.setField('U_B2AG_CCG', evt.target.value)}
                            disabled={props.data.Status === 'C'}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="U_B2AG_TicketNumber"
                            label="Numero Ticket"
                            value={props.data.U_B2AG_TicketNumber}
                            onChange={evt => props.setField('U_B2AG_TicketNumber', evt.target.value)}
                            disabled={props.data.Status === 'C'}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            id="CardName"
                            label="Produtor"
                            value={props.contract.CardName}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="PayToCode"
                            label="Origem"
                            value={props.contract.PayToCode}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            id="BPLName"
                            label="Filial"
                            value={props.contract.BPLName}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <Select
                            name="U_B2AG_Cultivation"
                            label="Cultura"
                            list={cultivations}
                            value={props.data.U_B2AG_Cultivation}
                            setState={props.setField}
                            onBlur={handleCultivationSelection}
                            disabled={props.data.Status === 'C'}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Select
                            name="U_B2AG_Batch"
                            label="Lote"
                            list={batches}
                            value={props.data.U_B2AG_Batch}
                            setState={props.setField}
                            disabled={batches.length === 0 || props.data.Status === 'C'}
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <TextField
                            id="U_B2AG_Driver"
                            label="Motorista"
                            value={props.data.U_B2AG_Driver}
                            onChange={evt => props.setField('U_B2AG_Driver', evt.target.value)}
                            disabled={props.data.Status === 'C'}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="U_B2AG_DriverDocument"
                            label="CPF Motorista"
                            value={props.data.U_B2AG_DriverDocument}
                            onChange={evt => props.setField('U_B2AG_DriverDocument', evt.target.value)}
                            disabled={props.data.Status === 'C'}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <BusinessPartnerAutocomplete
                            name="Transportadora"
                            value={props.shipping}
                            setValue={props.setShipping}
                            disabled={props.data.Status === 'C'}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id="U_B2AG_LicensePlate"
                            label="Placa"
                            value={props.data.U_B2AG_LicensePlate}
                            onChange={evt => props.setField('U_B2AG_LicensePlate', evt.target.value)}
                            disabled={props.data.Status === 'C'}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Select
                            name="U_B2AG_PlateFederalUnit"
                            label="UF"
                            list={federalUnities}
                            value={props.data.U_B2AG_PlateFederalUnit}
                            setState={props.setField}
                            disabled={props.data.Status === 'C'}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="U_B2AG_Comments"
                            label="Observação"
                            multiline
                            rows={3}
                            value={props.data.U_B2AG_Comments}
                            onChange={evt => props.setField('U_B2AG_Comments', evt.target.value)}
                            disabled={props.data.Status === 'C'}
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}