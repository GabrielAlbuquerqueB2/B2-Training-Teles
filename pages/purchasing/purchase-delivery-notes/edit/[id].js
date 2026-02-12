import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PageHeader from '../../../../components/ui/PageHeader'
import Tabs from '../../../../components/ui/Tabs'
import { Box, TextField, Grid } from '@mui/material'
import getTranslation from '../../../../locales/getTranslation'
import PurchaseDeliveryNotesHeader from '../../../../features/purchasing/purchase-delivery-notes/PurchaseDeliveryNotesHeader'
import PurchaseDeliveryNotesItems from '../../../../features/purchasing/purchase-delivery-notes/PurchaseDeliveryNotesItems'
import PurchaseDeliveryNotesExpenses from '../../../../features/purchasing/purchase-delivery-notes/PurchaseDeliveryNotesExpenses'
import PurchaseDeliveryNotesActions from '../../../../features/purchasing/purchase-delivery-notes/PurchaseDeliveryNotesActions'
import { getBPAddress } from '../../../../features/purchasing/purchase-delivery-notes/PurchaseDeliveryNotesServices'
import { getPurchaseDeliveryNotesById } from '../../../../features/purchasing/purchase-delivery-notes/PurchaseDeliveryNotesServices'
import AlertMessage from '../../../../components/ui/AlertMessage'
import CurrencyTextField from '../../../../components/ui/CurrencyTextField'

export default function PurchaseRequest() {

    const router = useRouter()
    //const id = router.query.id
    const t = getTranslation()
    const { type, id } = router.query

    const [data, setData] = useState({ DocumentLines: [{ Item: '' }] })
    const [purchaseOrder, setPurchaseOrder] = useState({})
    const [addresses, setAddresses] = useState({})
    const [expenses, setExpenses] = useState([])
    const [status, setStatus] = useState('UPDATE')
    const [alert, setAlert] = useState({ visible: false, type: '', message: '' })
    const [expensesSum, setExpensesSum] = useState(0)
    const [docTotal, setDocTotal] = useState(0)

    useEffect(() => {
        async function fetchData() {
            if (id) {
                const pdn = await getPurchaseDeliveryNotesById(id)
                const expesesList = pdn.DocumentAdditionalExpenses.map(item => {
                    return {
                        ExpenseCode: item.ExpenseCode,
                        LineTotal: item.LineTotal,
                    }
                })
                setExpenses(expesesList)
                const mappedDocLines = mapDocLines(pdn.DocumentLines)
                const address = await getBPAddress(pdn.CardCode)
                const mappedAddress = mapAddressesToSelectField(address.BPAddresses)
                setPurchaseOrder(pdn)
                setAddresses(mappedAddress)
                setData({
                    ...pdn,
                    Incoterms: pdn.TaxExtension.Incoterms,
                    Vehicle: pdn.TaxExtension.Vehicle,
                    VehicleState: pdn.TaxExtension.VehicleState,
                    DocumentLines: mappedDocLines
                })
                
            }
        }
        fetchData()
    }, [id])

    useEffect(() => {
        if (expenses) {
            const lines = expenses.reduce((acc, current) => {
                if (current) {
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
            if (!isNaN(expensesSum)) {
                setDocTotal(lines + expensesSum)
            }
        }

    }, [data, expenses])

    function mapDocLines(itemList) {

        return itemList.map(item => {

            return {
                Item: {
                    id: item.ItemCode,
                    label: item.ItemDescription,
                    InventoryUOM: item.MeasureUnit
                },
                Quantity: item.RemainingOpenQuantity,
                RemainingOpenQuantity: item.RemainingOpenQuantity,
                Price: item.Price,
                LineNum: item.LineNum,
                MeasureUnit: item.MeasureUnit,
                UoM: item.UoMEntry,
                LineTotal: item.LineTotal,
                WhsCode: item.WarehouseCode,
                UoMList: [
                    {
                        value: item.UoMEntry,
                        description: item.MeasureUnit
                    }
                ]
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
            return item.AddressType === 'bo_ShipTo'
        })

        return shipToAddresses.map(item => {
            return {
                value: item.AddressName,
                description: `${item.AddressName} - ${item.City}`,
                U_FederalTaxId: item.U_FederalTaxId,
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
                                status={status}
                            />
                            <PurchaseDeliveryNotesItems
                                data={data}
                                purchaseOrder={purchaseOrder}
                                setChildField={setChildField}
                                status={status}
                            />
                            <br />
                            <Grid container spacing={3}>
                                <Grid item xs={8}></Grid>
                                <Grid item xs={2}>
                                    <PurchaseDeliveryNotesExpenses
                                        expenses={expenses}
                                        setExpenses={setExpenses}
                                        status={status}
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
                                router={router}
                                setAlert={setAlert}
                                status={status}
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