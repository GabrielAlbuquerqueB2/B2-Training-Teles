import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import PageHeader from '../../../components/ui/PageHeader'
import Tabs from '../../../components/ui/Tabs'
import PackingListGeneralData from '../../../features/agricultural/packing-list/PackingListGeneralData'
import PackingListInvoice from '../../../features/agricultural/packing-list/PackingListInvoice'
import getTranslation from '../../../locales/getTranslation'
import { createPackingListModel, createInvoiceModel } from '../../../features/agricultural/packing-list/PackingListModel'
import {
    getPackingListById, createPackingList, updatePackingList, getOpenOrders, getAnalysesByItemCode, createInvoice,
    closePackingListById, getOrderById, getPackingListReport, getWTDataByCombinationId, getAllBatches
} from '../../../features/agricultural/packing-list/PackingListServices'
import { getBPByCardCode } from '../../../components/ui/Autocomplete/BusinessPartnerAutocomplete/BusinessPartnerAutocompleteService'
import { getYearMonthDateFormat } from '../../../utils/formatDate'
import SaveIcon from '@mui/icons-material/Save'
import AlertMessage from '../../../components/ui/AlertMessage'

export default function PackinList() {

    const router = useRouter()
    const id = router.query.id
    const t = getTranslation()

    const [data, setData] = useState({ B2AG_SPK1Collection: [] })
    const [formMode, setFormMode] = useState({ mode: 'CREATE', buttonLabel: 'ADICIONAR' })
    const [shipping, setShipping] = useState('')
    const [orderList, setOrderList] = useState([])
    const [order, setOrder] = useState({})
    const [disabled, setDisabled] = useState(false)
    const [isClicked, setIsClicked] = useState(false)
    const [batchList, setBatchList] = useState([])
    const [alert, setAlert] = useState({ visible: false, type: '', message: '' })
    const [isInvoiceLoading, setIsInvoiceLoading] = useState(false)

    useEffect(() => {

        if (id !== 'new' && id) {
            setFormMode({ mode: 'UPDATE', buttonLabel: 'ATUALIZAR' })
            async function getData() {
                const packingList = await getPackingListById(id)
                const formatedDate = getYearMonthDateFormat(packingList.U_B2AG_Date)
                setData({ ...packingList, U_B2AG_Date: formatedDate })
                if (packingList.U_B2AG_ShippingCompany) {
                    const bp = await getBPByCardCode(packingList.U_B2AG_ShippingCompany)
                    setShipping(bp[0])
                }
            }
            getData()
        }
    }, [id])

    useEffect(() => {
        async function fetchData() {
            const orders = await getOpenOrders()
            setOrderList(orders)
        }
        fetchData()
    }, [])

    useEffect(async () => {
        if (formMode.mode === 'UPDATE' && data.U_B2AG_Order) {
            await updateOrder(data.U_B2AG_Order)
        }

    }, [data.U_B2AG_Order])

    useEffect(() => {

        if (data.Status === 'C') {
            setDisabled(true)
        }
    }, [data.Status])

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

    async function handleSubmit() {

        if (formMode.mode === 'CREATE') {
            await newPackingList()
            return
        }
        else if (formMode.mode === 'UPDATE') {
            await editPackingList()
            return
        }
    }

    async function newPackingList() {
        setIsClicked(true)
        try {
            const submitData = createPackingListModel(data, shipping)
            console.log(submitData)
            const result = await createPackingList(submitData)
            setAlert({ visible: true, type: "success", message: `Romaneio gerado com sucesso` })
            router.push('/agricultural/packing-list/list')
        } catch (error) {
            setAlert({ visible: true, type: "error", message: `${error}` })
        } finally {
            setIsClicked(false)
        }
    }

    async function editPackingList() {
        setIsClicked(true)
        try {
            const submitData = createPackingListModel(data, shipping)
            await updatePackingList(data.DocNum, submitData)
            setAlert({ visible: true, type: "success", message: `Romaneio atualizado com sucesso` })
            router.push('/agricultural/packing-list/list')
        } catch (error) {
            setAlert({ visible: true, type: "error", message: `${error}` })
        } finally {
            setIsClicked(false)
        }
    }

    async function updateOrder(order) {
        if (order) {
            const ord = await getOrderById(order)
            setOrder(ord)
            await updateAnalisysList(ord)
            await getBatchList(ord.DocumentLines[0].ItemCode)
        }
    }

    async function getBatchList(itemCode) {
        const batches = await getAllBatches(itemCode)
        setBatchList(batches)
    }

    async function updateAnalisysList(order) {
        if (order.DocumentLines && formMode.mode === 'CREATE') {
            const analisysList = await getAnalysesByItemCode(order.DocumentLines[0].ItemCode)
            setField('B2AG_SPK1Collection', analisysList)
        }
    }

    async function generateInvoice() {
        setIsInvoiceLoading(true)
        try {
            const wtData = await getWTDataByCombinationId(order.U_B2AG_WTCode)
            const obj = createInvoiceModel(data, shipping, order, wtData)

            const result = await createInvoice(obj)
            
            if (result.DocEntry) {
                await updatePackingList(data.DocEntry, {
                    U_B2AG_Invoice: result.DocEntry
                })
                setAlert({ visible: true, type: "success", message: `Nota Fiscal gerada com sucesso` })
                setTimeout(() => {
                    router.push('/agricultural/packing-list/list')
                }, 3000)          
            } else {
                setAlert({ visible: true, type: "error", message: `${error}` })
            }

        } catch (error) {
            setAlert({ visible: true, type: "error", message: `${error}` })
        } finally {
            setIsInvoiceLoading(false)
        }
    }

    async function closePackingList() {
        try {
            await closePackingListById(data.DocEntry)
            setAlert({ visible: true, type: "success", message: `Romaneio encerrado com sucesso` })
            router.push('/agricultural/packing-list/list')
        } catch (error) {
            setAlert({ visible: true, type: "error", message: `${error}` })
        }
    }

    async function printPackingList() {
        const base64 = await getPackingListReport(data.DocNum)

        const link = `data:application/pdf;base64,${base64}`;
        fetch(link)
            .then(res => res.blob())
            .then((blob) => {

                const fileURL = window.URL.createObjectURL(blob);
                window.open(fileURL);
            })
    }

    return (
        <>
            <PageHeader
                title={t["app.agricultural.packing-list.title"]}
            />
            <Tabs>
                <Box
                    index={1}
                    label="Dados Gerais"
                    component={
                        <PackingListGeneralData
                            data={data}
                            shipping={shipping}
                            setShipping={setShipping}
                            setField={setField}
                            setChildField={setChildField}
                            orderList={orderList}
                            setOrderList={setOrderList}
                            order={order}
                            setOrder={setOrder}
                            updateOrder={updateOrder}
                            isDisabled={disabled}
                            batchList={batchList}
                        />
                    }
                />
                <Box
                    index={2}
                    label="Nota Fiscal Eletrônica"
                    component={
                        <PackingListInvoice
                            data={data}
                            setChildField={setChildField}
                        />
                    }
                />
            </Tabs>
            <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                    <LoadingButton
                        loading={isClicked}
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        onClick={handleSubmit}
                        disabled={disabled}
                    >
                        {formMode.buttonLabel}
                    </LoadingButton>

                    <LoadingButton
                        loading={isInvoiceLoading}
                        loadingPosition="start"
                        //startIcon={<SaveIcon />}
                        onClick={generateInvoice}
                        disabled={disabled || (data.U_B2AG_Invoice) || formMode.mode === 'CREATE'}
                    >
                        Gerar Nota Fiscal
                    </LoadingButton>

                    <Button
                        variant="outlined"
                        onClick={closePackingList}
                        disabled={disabled || formMode.mode === 'CREATE'}
                    >
                        Encerrar Romaneio
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={printPackingList}
                        disabled={formMode.mode === 'CREATE'}
                    >
                        Imprimir
                    </Button>
                </Stack>
            </Grid>
            <br />
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