import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PageHeader from '../../../components/ui/PageHeader'
import Tabs from '../../../components/ui/Tabs'
import { Box, TextField, Grid } from '@mui/material'
import getTranslation from '../../../locales/getTranslation'
import PurchaseDeliveryNotesHeader from '../../../features/purchasing/purchase-delivery-notes/PurchaseDeliveryNotesHeader'
import PurchaseDeliveryNotesItems from '../../../features/purchasing/purchase-delivery-notes/PurchaseDeliveryNotesItems'
import PurchaseDeliveryNotesExpenses from '../../../features/purchasing/purchase-delivery-notes/PurchaseDeliveryNotesExpenses'
import PurchaseDeliveryNotesActions from '../../../features/purchasing/purchase-delivery-notes/PurchaseDeliveryNotesActions'
import { getBPAddress } from '../../../features/purchasing/purchase-delivery-notes/PurchaseDeliveryNotesServices'
import { getOrder } from '../../../features/purchasing/purchase-delivery-notes/PurchaseOrderService'
import AlertMessage from '../../../components/ui/AlertMessage'
import CurrencyTextField from '../../../components/ui/CurrencyTextField'

export default function PurchaseRequest() {

    const router = useRouter()
    //const id = router.query.id
    const {type, id } = router.query
    const t = getTranslation()

    const [data, setData] = useState({ DocumentLines: [{ Item: '' }] })
    const [purchaseOrder, setPurchaseOrder] = useState({})
    const [addresses, setAddresses] = useState({})
    const [expenses, setExpenses] = useState([])
    const [status, setStatus] = useState('CREATE')
    const [alert, setAlert] = useState({ visible: false, type: '', message: '' })
    const [expensesSum, setExpensesSum] = useState(0)
    const [docTotal, setDocTotal] = useState(0)

    useEffect(() => {
        async function fetchData() {
            if (id) {
                const po = await getOrder(id)
                const mappedDocLines = mapDocLines(po.DocumentLines)
                const address = await getBPAddress(po.CardCode)
                const mappedAddress = mapAddressesToSelectField(address.BPAddresses)
                setPurchaseOrder(po)
                setAddresses(mappedAddress)
                setData({ PayToCode: po.PayToCode, DocumentLines: mappedDocLines })
            }
        }
        fetchData()
    }, [id])

    useEffect(() => {
        if (expenses) {
            const lines = expenses.reduce((acc, current) => {
                if(current) {
                    return acc + current.LineTotal
                } else {
                    return acc
                }
            }, 0)
            if (!isNaN(lines)) {
                setExpensesSum(lines)

            }
        }

    }, [expenses])

    useEffect(() => {
        if (data.DocumentLines) {
            const lines = data.DocumentLines.reduce((acc, current) => {
                return acc + current.LineTotal
            }, 0)
            if (!isNaN(lines)) {
                setDocTotal(lines)

            }
            if(!isNaN(expensesSum)) {
                setDocTotal(lines + expensesSum)
            }
        }

    }, [data, expenses])

    function mapDocLines(itemList) {

        return itemList.map(item => {

            let uoms = []
            for (const [key, value] of Object.entries(item.UoMList)) {
                uoms.push(value)
            }

            return {
                Item: {
                    id: item.ItemCode,
                    label: item.ItemDescription,
                    InventoryUOM: item.MeasureUnit
                },
                Quantity: item.RemainingOpenQuantity,
                RemainingOpenQuantity: item.RemainingOpenQuantity,
                U_B2AG_Batch: item.U_B2AG_Batch,
                Price: item.Price,
                LineNum: item.LineNum,
                MeasureUnit: item.MeasureUnit,
                UoM: item.UoMEntry,
                LineTotal: item.LineTotal,
                WhsCode: item.WarehouseCode,
                UoMList: uoms
            }
        })
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

    function mapAddressesToSelectField(bPAddresses) {

        const shipToAddresses = bPAddresses.filter(item => {
            return item.AddressType === 'bo_BillTo'
        })

        return shipToAddresses.map(item => {
            return {
                value: item.AddressName,
                description: `${item.AddressName} - ${item.City}`,
                U_FederalTaxId: item.U_FederalTaxId,
                U_AGRT_CnpjFornecedor: item.U_AGRT_CnpjFornecedor,
                U_TX_IE: item.U_TX_IE,
                State: item.State,
                County: item.County,
            }
        })
    }

    return (
        <>
            <PageHeader
                title={t["app.purchasing.purchase-delivery-notes.create"]}
            />
            <Tabs>
                <Box
                    index={1}
                    label="Dados Gerais"
                    component={
                        <>
                            <PurchaseDeliveryNotesHeader
                                data={data}
                                purchaseOrder={purchaseOrder}
                                addresses={addresses}
                                setField={setField}
                                setChildField={setChildField}
                            />
                            <PurchaseDeliveryNotesItems
                                data={data}
                                purchaseOrder={purchaseOrder}
                                setChildField={setChildField}
                                setData={setData}
                            />
                            <br />
                            <Grid container spacing={3}>
                                <Grid item xs={8}></Grid>
                                <Grid item xs={2}>
                                    <PurchaseDeliveryNotesExpenses
                                        expenses={expenses}
                                        setExpenses={setExpenses}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <CurrencyTextField
                                        label="Total Despesas Adicionais"
                                        value={expensesSum}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={10}></Grid>
                                <Grid item xs={2}>
                                    <CurrencyTextField
                                        label="Total Documento"
                                        value={docTotal}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="Comments"
                                        label="Observação"
                                        multiline
                                        rows={3}
                                        value={data.Comments}
                                        onChange={evt => setField('Comments', evt.target.value)}
                                    />
                                </Grid>
                            </Grid>
                            <br />
                            <PurchaseDeliveryNotesActions
                                data={data}
                                purchaseOrder={purchaseOrder}
                                expenses={expenses}
                                addresses={addresses}
                                router={router}
                                setAlert={setAlert}
                            />
                        </>
                    }
                />
                {/* <Box
                    index={2}
                    label="Anexos"
                    component={
                        <></>
                    }
                /> */}
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