import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import PageHeader from '../../../components/ui/PageHeader'
import AlertMessage from '../../../components/ui/AlertMessage'
import Tabs from '../../../components/ui/Tabs'
import getTranslation from '../../../locales/getTranslation'
import GoodsReceivedNoteHeader from '../../../features/origin-and-dispatch/goods-received-note/GoodsReceivedNoteHeader'
import GoodsReceivedNoteRecipient from '../../../features/origin-and-dispatch/goods-received-note/GoodsReceivedNoteRecipient'
import GoodsReceivedNoteVariety from '../../../features/origin-and-dispatch/goods-received-note/GoodsReceivedNoteVariety'
import GoodsReceivedNoteWeighing from '../../../features/origin-and-dispatch/goods-received-note/GoodsReceivedNoteWeighing'
import GoodsReceivedNoteAnalisys from '../../../features/origin-and-dispatch/goods-received-note/GoodsReceivedNoteAnalisys'
import GoodsReceivedNoteRelatedDocuments from '../../../features/origin-and-dispatch/goods-received-note/GoodsReceivedNoteRelatedDocuments'
import {
    getGoodsReceivedNoteById, createGoodsReceivedNote, updateGoodsReceivedNote, cancelGoodsReceivedNote, closeGoodsReceivedNote,
    getAnalysesByCultivation, getBranchByLocationId, getGoodsReceivedNoteReport, getAllContracts, getPurchaseDeliveryNotesById, getContractById
} from '../../../features/origin-and-dispatch/goods-received-note/GoodsReceivedNoteServices'
import { createGoodsReceivedNoteModel, editableGoodsReceivedNoteModel } from '../../../features/origin-and-dispatch/goods-received-note/GoodsReceivedNoteModel'
import { checkRequiredFields } from '../../../features/origin-and-dispatch/goods-received-note/GoodsReceivedNoteErrorHandler'
import { getBPByCardCode } from '../../../components/ui/Autocomplete/BusinessPartnerAutocomplete/BusinessPartnerAutocompleteService'
import { getYearMonthDateFormat } from '../../../utils/formatDate'
import { getSessionData } from '../../../utils/frontEndGetSessionData'
import SaveIcon from '@mui/icons-material/Save'

export default function GoodsReceivedNote() {

    const router = useRouter()
    const id = router.query.id
    const t = getTranslation()

    const [data, setData] = useState({})
    const [contract, setContract] = useState({})
    const [contractList, setContractList] = useState([])
    const [warehousesByLocation, setWarehousesByLocation] = useState([])
    const [shipping, setShipping] = useState('')
    const [totalVarietySum, setTotalVarietySum] = useState(0)
    const [totalAnalisysSum, setTotalAnalisysSum] = useState(0)
    const [formMode, setFormMode] = useState({ mode: 'CREATE', buttonLabel: 'ADICIONAR' })
    const [isThirdPartTicket, setIsThirdPartTicket] = useState(false)
    const [analisysTypes, setAnalisysTypes] = useState([])
    const [deliveryPlaces, setDeliveryPlaces] = useState([])
    const [branches, setBranches] = useState([])
    const [relatedDocuments, setRelatedDocuments] = useState([])
    const [isClicked, setIsClicked] = useState(false)
    const [alert, setAlert] = useState({ visible: false, type: '', message: '' })

    useEffect(() => {

        if (id !== 'new' && id) {
            setFormMode({ mode: 'UPDATE', buttonLabel: 'ATUALIZAR' })
            async function getData() {
                const GoodsReceivedNote = await getGoodsReceivedNoteById(id)
                if (GoodsReceivedNote.U_B2AG_ShippingCompany) {
                    await fillShippingCompany(GoodsReceivedNote.U_B2AG_ShippingCompany)
                }
                if (GoodsReceivedNote.U_B2AG_Contract) {
                    const ct = await getContractById(GoodsReceivedNote.U_B2AG_Contract)
                    setContract(ct)
                }
                await fillContractById(GoodsReceivedNote.U_B2AG_Contract)
                await getAnalysisTypesByCultivation(GoodsReceivedNote.U_B2AG_Cultivation)
                await fillRelatedDocuments(GoodsReceivedNote.U_B2AG_B2ObjectType, id)
                const formatedDate = getYearMonthDateFormat(GoodsReceivedNote.U_B2AG_Date)
                setData({ ...GoodsReceivedNote, U_B2AG_Date: formatedDate })
            }

            getData()
        } else {
            setData({
                B2AG_GRN1Collection: [{ U_B2AG_Field: '', U_B2AG_Variety: '' }]
            })
        }
    }, [id])

    useEffect(() => {
        async function getData() {
            const contracts = await getAllContracts()
            setContractList(contracts)
        }
        getData()
    }, [])

    /* useEffect(() => {
        const selectedContract = contractList.filter(ct => {
            return ct.DocNum === data.U_B2AG_Contract
        })
        if (selectedContract.length > 0) {
            setContract(selectedContract[0])
        }
    }, [data.U_B2AG_Contract]) */

    async function fillShippingCompany(shippingCardCode) {
        const bp = await getBPByCardCode(shippingCardCode)
        setShipping(bp[0])
    }

    async function fillContractById(contractId) {
        const ct = await getContractById(contractId)
        console.log(ct)
        setContract(ct)
    }

    useEffect(() => {
        if (data.U_B2AG_B2ObjectType === 'ThirdPartyWarehouse') {
            setIsThirdPartTicket(true)
        } else {
            setIsThirdPartTicket(false)
        }
    }, [data.U_B2AG_B2ObjectType])

    async function handleSubmit() {

        const messages = checkRequiredFields(data)
        if (messages.length > 0) {
            setAlert({ visible: true, type: "error", message: messages })
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
            console.log('new')
            const submitData = createGoodsReceivedNoteModel(data, shipping)
            console.log(submitData)
            const result = await createGoodsReceivedNote(submitData)
            setAlert({ visible: true, type: "success", message: "Romaneio gerado com sucesso" })
            router.push(`/origin-and-dispatch/goods-received-note/${result.DocNum}`)
        } catch (error) {
            setAlert({ visible: true, type: "error", message: `${error}` })
        } finally {
            setIsClicked(false)
        }
    }

    async function editHarvestTicket() {
        setIsClicked(true)
        try {
            await doUpdateHarvestTicket()
            setAlert({ visible: true, type: "success", message: "Romaneio Atualizado com sucesso" })
            router.push(`/origin-and-dispatch/goods-received-note/${data.DocNum}`)
        } catch (error) {
            setAlert({ visible: true, type: "error", message: `${error}` })
        } finally {
            setIsClicked(false)
        }
    }

    async function doUpdateHarvestTicket() {
        const submitData = editableGoodsReceivedNoteModel(data, shipping)
        await updateGoodsReceivedNote(data.DocNum, submitData)
    }

    async function handleCancelTicket() {

        try {
            const result = await cancelGoodsReceivedNote(data.DocNum)
            setAlert({ visible: true, type: "success", message: "Romaneio Cancelado com sucesso" })
            router.push('/origin-and-dispatch/goods-received-note/list')
        } catch (error) {
            setAlert({ visible: true, type: "error", message: `${error}` })
        }
    }

    async function getDeliveryPlaces() {
        if (isThirdPartTicket && data.U_B2AG_DestinationWhs) {
            const deliveryPlaces = await getDeliveryPlacesByWarehouseCode(data.U_B2AG_DestinationWhs)
            setDeliveryPlaces(deliveryPlaces)
        }
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
        newData['B2AG_GRN1Collection'] = [...newData['B2AG_GRN1Collection'], []]
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

    async function printGoodsReceivedNote() {
        let user = ''
        const sessionData = getSessionData()
        if (sessionData) {
            const userName = JSON.parse(sessionData).user
            user = userName
        }
        const base64 = await getGoodsReceivedNoteReport(data.DocNum, user)

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
        const seed = await getPurchaseDeliveryNotesById(id)
        if (seed.length > 0) {
            docs = [{ DocNum: seed[0]?.DocNum, NF: `${seed[0]?.SequenceSerial} - ${seed[0]?.SeriesString}`, NFTransito: seed[0]?.DocumentReferences[0]?.Number, Type: 'Recebimento de Mercadoria' }]
        }
        setRelatedDocuments(docs)
    }

    async function handleCloseTicket() {
        try {
            const result = await closeGoodsReceivedNote(data.DocNum)
            setAlert({ visible: true, type: "success", message: "Romaneio encerrado com sucesso" })
            setTimeout(() => {
                window.location = `/origin-and-dispatch/goods-received-note/${data.DocNum}`
            }, 3000)
        } catch (error) {
            setAlert({ visible: true, type: "error", message: `${error}` })
        }
    }

    return (
        <>
            <PageHeader
                title={t["app.origin-and-dispatch.goods-received-note.title"]}
            />
            <Tabs>
                <Box
                    index={1}
                    label="Dados Gerais"
                    component={
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <GoodsReceivedNoteHeader
                                        id={id}
                                        data={data}
                                        setField={setField}
                                        warehouses={warehousesByLocation}
                                        setWarehouses={setWarehousesByLocation}
                                        shipping={shipping}
                                        setShipping={setShipping}
                                        setAnalisysTypes={setAnalisysTypes}
                                        getDeliveryPlaces={getDeliveryPlaces}
                                        getAnalysisTypesByCultivation={getAnalysisTypesByCultivation}
                                        branches={branches}
                                        setBranches={setBranches}
                                        formMode={formMode}
                                        contract={contract}
                                        setContract={setContract}
                                        contractList={contractList}
                                        setContractList={setContractList}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <GoodsReceivedNoteRecipient
                                        data={data}
                                        setField={setField}
                                        warehouses={warehousesByLocation}
                                        isThirdPartTicket={isThirdPartTicket}
                                        deliveryPlaces={deliveryPlaces}
                                    />
                                </Grid>
                                <Typography variant="h6">Dados de Análise</Typography>
                                <Grid item xs={12}>
                                    <GoodsReceivedNoteAnalisys
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
                                    <GoodsReceivedNoteWeighing
                                        data={data}
                                        setField={setField}
                                        isThirdPartTicket={isThirdPartTicket}
                                        handleAnalisysValue={handleAnalisysValue}
                                        setChildField={setChildField}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <GoodsReceivedNoteVariety
                                        data={data}
                                        setField={setField}
                                        setChildField={setChildField}
                                        addLineToVariety={addLineToVariety}
                                        totalVarietySum={totalVarietySum}
                                        setTotalVarietySum={setTotalVarietySum}
                                        contract={contract}
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
                                        {/*<Button
                                            variant="outlined"
                                            disabled={relatedDocuments.length > 0}
                                            onClick={handleCancelTicket}
                                        >
                                            Cancelar Recebimento
                                        </Button> */}
                                        <Button
                                            variant="outlined"
                                            onClick={printGoodsReceivedNote}
                                            disabled={formMode.mode === 'CREATE'}
                                        >
                                            Imprimir
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            disabled={relatedDocuments.length === 0 || data.Status === 'C'}
                                            onClick={handleCloseTicket}
                                        >
                                            Encerrar Recebimento
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
                        <GoodsReceivedNoteRelatedDocuments
                            data={data}
                            setAlert={setAlert}
                            contract={contract}
                            router={router}
                            documents={relatedDocuments}
                            totalVarietySum={totalVarietySum}
                            doUpdateHarvestTicket={doUpdateHarvestTicket}
                            formMode={formMode}
                        />}
                />
            </Tabs>
            <Grid item xs={12}>
                <AlertMessage
                    alertOpen={alert.visible}
                    setAlertOpen={setAlert}
                    type={alert.type}
                    message={alert.message}
                />
            </Grid>

        </>
    )
}