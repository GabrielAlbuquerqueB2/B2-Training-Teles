import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import PageHeader from '../../../components/ui/PageHeader'
import AlertMessage from '../../../components/ui/AlertMessage'
import Tabs from '../../../components/ui/Tabs'
import getTranslation from '../../../locales/getTranslation'
import HarvestTicketHeader from '../../../features/agricultural/harvest-ticket/HarvestTicketHeader'
import HarvestTicketRecipient from '../../../features/agricultural/harvest-ticket/HarvestTicketRecipient'
import HarvestTicketVariety from '../../../features/agricultural/harvest-ticket/HarvestTicketVariety'
import HarvestTicketWeighing from '../../../features/agricultural/harvest-ticket/HarvestTicketWeighing'
import HarvestTicketAnalisys from '../../../features/agricultural/harvest-ticket/HarvestTicketAnalisys'
import HarvestTicketRelatedDocuments from '../../../features/agricultural/harvest-ticket/HarvestTicketRelatedDocuments'
import {
    getHarvestTicketById, createHarvestTicket, updateHarvestTicket, cancelHarvestTicket, closeHarvestTicket,
    getWarehousesByLocation, getAllProductionUnits, getFieldsByProductionUnit, getAnalysesByCultivation,
    getBranchByLocationId, getHarvestTicketReport, getStockTransferByRef2, getInventoryGenExitByRef2, getDeliveryNoteByRef2, getBatchesByCultivation
} from '../../../features/agricultural/harvest-ticket/HarvestTicketServices'
import { createHarvestTicketModel, editableHarvestTicketModel } from '../../../features/agricultural/harvest-ticket/HarvestTicketModel'
import { checkRequiredFields } from '../../../features/agricultural/harvest-ticket/HarvestTicketErrorHandler'
import { getBPByCardCode } from '../../../components/ui/Autocomplete/BusinessPartnerAutocomplete/BusinessPartnerAutocompleteService'
import { getYearMonthDateFormat } from '../../../utils/formatDate'
import { getSessionData } from '../../../utils/frontEndGetSessionData'
import SaveIcon from '@mui/icons-material/Save'

export default function HarvestTicket() {

    const router = useRouter()
    const id = router.query.id
    const t = getTranslation()

    const [data, setData] = useState({})
    const [productionUnits, setProductionUnits] = useState([])
    const [warehousesByLocation, setWarehousesByLocation] = useState([])
    const [shipping, setShipping] = useState('')
    const [fieldsList, setFieldsList] = useState([])
    const [totalVarietySum, setTotalVarietySum] = useState(0)
    const [totalAnalisysSum, setTotalAnalisysSum] = useState(0)
    const [formMode, setFormMode] = useState({ mode: 'CREATE', buttonLabel: 'ADICIONAR' })
    const [isError, setIsError] = useState({ error: false, message: '' })
    const [alert, setAlert] = useState({ visible: false, type: '', message: '' })
    const [isThirdPartTicket, setIsThirdPartTicket] = useState(false)
    const [analisysTypes, setAnalisysTypes] = useState([])
    const [deliveryPlaces, setDeliveryPlaces] = useState([])
    const [branches, setBranches] = useState([])
    const [relatedDocuments, setRelatedDocuments] = useState([])
    const [isClicked, setIsClicked] = useState(false)
    const [batches, setBatches] = useState([])

    useEffect(() => {

        if (id !== 'new' && id) {
            setFormMode({ mode: 'UPDATE', buttonLabel: 'ATUALIZAR' })
            async function getData() {
                const harvestTicket = await getHarvestTicketById(id)
                if (harvestTicket.U_B2AG_B2ObjectType === 'ThirdPartyWarehouse') {
                    setIsThirdPartTicket(true)
                }
                if (harvestTicket.U_B2AG_ShippingCompany) {
                    await fillShippingCompany(harvestTicket.U_B2AG_ShippingCompany)
                }
                if (harvestTicket.U_B2AG_Batch) {
                    const batchesList = await getBatchesByCultivation(harvestTicket.U_B2AG_Cultivation)
                    const mappedBatches = batchesList.map(batch => {
                        return {
                            value: batch.BatchNumberDetails.Batch,
                            description: batch.BatchNumberDetails.Batch
                        }
                    })
                    setBatches(mappedBatches)
                }
                await fillWarehousesListByLocation(harvestTicket.U_B2AG_ProductionUnitCode)
                await fillFieldsByProductionUnit(harvestTicket.U_B2AG_ProductionUnitCode)

                await getAnalysisTypesByCultivation(harvestTicket.U_B2AG_Cultivation)

                /* if (harvestTicket.U_B2AG_B2ObjectType !== 'ThirdPartyWarehouse') {
                    await getAnalysisTypesByCultivation(harvestTicket.U_B2AG_Cultivation)
                } */
                await fillBranchesByProductionUnit(harvestTicket.U_B2AG_ProductionUnitCode)
                await fillRelatedDocuments(harvestTicket.U_B2AG_B2ObjectType, id)
                const formatedDate = getYearMonthDateFormat(harvestTicket.U_B2AG_Date)
                setData({ ...harvestTicket, U_B2AG_Date: formatedDate })

            }

            getData()
        } else {
            setData({
                B2AG_PKL1Collection: [{ U_B2AG_Field: '', U_B2AG_Variety: '' }]
            })
        }
    }, [id])

    async function fillShippingCompany(shippingCardCode) {
        const bp = await getBPByCardCode(shippingCardCode)
        setShipping(bp[0])
    }

    async function fillFieldsByProductionUnit(productionUnitCode) {
        const productionUnit = await getFieldsByProductionUnit(productionUnitCode)
        setFieldsByProductionUnit(productionUnit.B2AG_PDU1Collection)
    }

    async function fillBranchesByProductionUnit(productionUnitCode) {
        const brcs = await getBranchByLocationId(productionUnitCode)
        setBranches(brcs)
    }

    useEffect(() => {
        if (data.U_B2AG_B2ObjectType === 'ThirdPartyWarehouse') {
            setIsThirdPartTicket(true)
        } else {
            setIsThirdPartTicket(false)
        }
    }, [data.U_B2AG_B2ObjectType])

    useEffect(() => {
        async function getData() {
            const productionUnitsList = await getAllProductionUnits()
            setProductionUnits(productionUnitsList)
        }
        getData()
    }, [])

    async function handleSubmit() {

        const messages = checkRequiredFields(data)
        if (messages.length > 0) {
            setAlert({ visible: true, type: 'error', message: messages })
            return
        }

        if (formMode.mode === 'CREATE') {
            await newHarvestTicket()
            return
        }
        else if (formMode.mode === 'UPDATE') {
            await editHarvestTicket()
            return
        }

    }

    async function newHarvestTicket() {
        setIsClicked(true)
        try {
            const submitData = createHarvestTicketModel(data, shipping)
            const result = await createHarvestTicket(submitData)
            setAlert({ visible: true, type: 'success', message: 'Romaneio criado com sucesso' })
            router.push(`/agricultural/harvest-ticket/${result.DocNum}`)
        } catch (error) {
            setAlert({ visible: true, type: 'error', message: error })
        } finally {
            setIsClicked(false)
        }
    }

    async function editHarvestTicket() {
        setIsClicked(true)
        try {
            await doUpdateHarvestTicket()
            setAlert({ visible: true, type: 'success', message: 'Romaneio atualizado com sucesso' })
            router.push(`/agricultural/harvest-ticket/${data.DocNum}`)
        } catch (error) {
            setAlert({ visible: true, type: 'error', message: error })
        } finally {
            setIsClicked(false)
        }
    }

    async function doUpdateHarvestTicket() {
        const submitData = editableHarvestTicketModel(data, shipping)
        await updateHarvestTicket(data.DocNum, submitData)
    }

    async function handleCancelTicket() {

        try {
            const result = await cancelHarvestTicket(data.DocNum)
            alert('Romaneio cancelado com sucesso')
            router.push('/agricultural/harvest-ticket/list')
        } catch (error) {
            alert(error)
        }
    }

    async function handleCloseTicket() {

        try {
            await closeHarvestTicket(data.DocNum)
            setAlert({ visible: true, type: 'success', message: 'Romaneio encerrado com sucesso' })
            router.push(`/agricultural/harvest-ticket/list`)
        } catch (error) {
            setAlert({ visible: true, type: 'error', message: error })
        }
    }

    async function getDeliveryPlaces() {
        if (isThirdPartTicket && data.U_B2AG_DestinationWhs) {
            const deliveryPlaces = ''//await getDeliveryPlacesByWarehouseCode(data.U_B2AG_DestinationWhs)
            setDeliveryPlaces(deliveryPlaces)
        }
    }

    async function fillWarehousesListByLocation(unitCode) {
        const warehouses = await getWarehousesByLocation(unitCode)
        setWarehousesByLocation(warehouses)
    }

    function setFieldsByProductionUnit(unitList) {
        const mappedFields = unitList.map(field => {
            return ({
                value: field.U_B2AG_Code,
                description: field.U_B2AG_Code
            })
        })

        const uniqueFields = mappedFields.filter((thing, index, self) =>
            index === self.findIndex((t) => (
                t.value === thing.value
            ))
        )

        setFieldsList(uniqueFields)
    }

    async function getAnalysisTypesByCultivation(cultivationCode) {
        const analisys = await getAnalysesByCultivation(cultivationCode)
        if (analisys) {
            setAnalisysTypes(analisys)
        }
    }

    function setField(field, newValue) {
        let newData = { ...data }
        newData[field] = newValue
        setData(newData)
    }

    function setChildField(father, field, index, newValue) {
        let newData = { ...data }
        newData[father][index][field] = newValue
        setData(newData)
    }

    function addLineToVariety() {
        let newData = { ...data }
        newData['B2AG_PKL1Collection'] = [...newData['B2AG_PKL1Collection'], []]
        setData(newData)
    }

    function handleAnalisysValue(analisysCode, value) {
        if (analisysCode && value && analisysTypes.length > 0) {
            const type = analisysTypes.filter(item => {
                return item.Code === analisysCode
            })

            const discount = type[0].B2AG_ANL1Collection.filter(item => {
                return value >= item.U_B2AG_AnalisysFrom && value <= item.U_B2AG_AnalisysTo
            })
            return discount[0].U_B2AG_Discount
        }
    }

    async function printHarvestTicket() {
        let user = ''
        const sessionData = getSessionData()
        if (sessionData) {
            const userName = JSON.parse(sessionData).user
            user = userName
        }
        const base64 = await getHarvestTicketReport(data.DocNum, user)

        const link = `data:application/pdf;base64,${base64}`;
        fetch(link)
            .then(res => res.blob())
            .then((blob) => {

                const fileURL = window.URL.createObjectURL(blob);
                window.open(fileURL);
            })

    }

    async function fillRelatedDocuments(type, id) {

        let docs = []
        switch (type) {
            case 'OwnWarehouse':
                const own = await getStockTransferByRef2(id)
                if (own.length > 0) {
                    docs = [{ DocNum: own[0]?.DocNum, Type: 'Transferência de Estoque' }]
                }
                break;
            case 'ThirdPartyWarehouse':
                const third = await getStockTransferByRef2(id)
                if (third.length > 0) {
                    docs = [...docs, { DocNum: third[0]?.DocNum, Type: 'Transferência de Estoque' }]
                }
                const delivery = await getDeliveryNoteByRef2(id)
                if (delivery.length > 0) {
                    docs = [...docs, { DocNum: delivery[0]?.DocNum, Type: 'Nota Fiscal de Remessa' }]
                }
                break;
            case 'SeedShipment':
                const seed = await getInventoryGenExitByRef2(id)
                if (seed.length > 0) {
                    docs = [{ DocNum: seed[0]?.DocNum, Type: 'Saída de Mercadoria' }]
                }
                break;
        }
        setRelatedDocuments(docs)
    }

    return (
        <>
            <PageHeader
                title={t["app.agricultural.harvest-ticket.title"]}
            />
            <Tabs>
                <Box
                    index={1}
                    label="Dados Gerais"
                    component={
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <HarvestTicketHeader
                                        id={id}
                                        data={data}
                                        batches={batches}
                                        setBatches={setBatches}
                                        productionUnits={productionUnits}
                                        setField={setField}
                                        warehouses={warehousesByLocation}
                                        setWarehouses={setWarehousesByLocation}
                                        shipping={shipping}
                                        setShipping={setShipping}
                                        setFieldsList={setFieldsList}
                                        setFieldsByProductionUnit={setFieldsByProductionUnit}
                                        setAnalisysTypes={setAnalisysTypes}
                                        getDeliveryPlaces={getDeliveryPlaces}
                                        getAnalysisTypesByCultivation={getAnalysisTypesByCultivation}
                                        branches={branches}
                                        setBranches={setBranches}
                                        formMode={formMode}
                                    />
                                </Grid>
                                {/* <Grid item xs={12}>
                                    <HarvestTicketRecipient
                                        data={data}
                                        setField={setField}
                                        warehouses={warehousesByLocation}
                                        isThirdPartTicket={isThirdPartTicket}
                                        deliveryPlaces={deliveryPlaces}
                                    />
                                </Grid> */}
                                <Typography variant="h6">Dados de Análise</Typography>
                                <Grid item xs={12}>
                                    <HarvestTicketAnalisys
                                        data={data}
                                        setField={setField}
                                        setChildField={setChildField}
                                        totalAnalisysSum={totalAnalisysSum}
                                        setTotalAnalisysSum={setTotalAnalisysSum}
                                        isThirdPartTicket={isThirdPartTicket}
                                        analisysTypes={analisysTypes}
                                        handleAnalisysValue={handleAnalisysValue}
                                    />
                                </Grid>
                                <Typography variant="h6">Dados de Pesagem</Typography>
                                <Grid item xs={12}>
                                    <HarvestTicketWeighing
                                        data={data}
                                        setField={setField}
                                        isThirdPartTicket={isThirdPartTicket}
                                        handleAnalisysValue={handleAnalisysValue}
                                        setChildField={setChildField}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <HarvestTicketVariety
                                        data={data}
                                        setField={setField}
                                        setChildField={setChildField}
                                        fieldsList={fieldsList}
                                        addLineToVariety={addLineToVariety}
                                        totalVarietySum={totalVarietySum}
                                        setTotalVarietySum={setTotalVarietySum}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack direction="row" spacing={2}>
                                        <LoadingButton
                                            loading={isClicked}
                                            loadingPosition="start"
                                            startIcon={<SaveIcon />}
                                            onClick={handleSubmit}
                                            disabled={data.Status === 'C'}
                                        >
                                            {formMode.buttonLabel}
                                        </LoadingButton>
                                        <Button
                                            variant="outlined"
                                            //disabled={relatedDocuments.length > 0}
                                            disabled
                                            onClick={handleCancelTicket}
                                        >
                                            Cancelar Romaneio
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            disabled={relatedDocuments.length === 0 || data.Status === 'C'}
                                            onClick={handleCloseTicket}
                                        >
                                            Encerrar Romaneio
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={printHarvestTicket}
                                            disabled={formMode.mode === 'CREATE'}
                                        >
                                            Imprimir
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>

                        </Box>
                    }
                />
                <Box
                    index={2}
                    label="Documentos Relacionados"
                    component={
                        <HarvestTicketRelatedDocuments
                            data={data}
                            router={router}
                            setAlert={setAlert}
                            documents={relatedDocuments}
                            setRelatedDocuments={setRelatedDocuments}
                            totalVarietySum={totalVarietySum}
                            doUpdateHarvestTicket={doUpdateHarvestTicket}
                            formMode={formMode}
                        />}
                />
            </Tabs>
            <Box hidden={!alert.visible}>
                <AlertMessage
                    alertOpen={alert.visible}
                    setAlertOpen={setAlert}
                    type={alert.type}
                    message={alert.message}
                />
            </Box>

        </>
    )
}