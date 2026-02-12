import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import getTranslation from '../../../../locales/getTranslation'
import { Box } from '@mui/material'
import PageHeader from '../../../../components/ui/PageHeader'
import Tabs from '../../../../components/ui/Tabs'
import TransferPurchaseDeliveryNotesGeneralData from '../../../../features/agricultural/stock-transfer/transfer-purchase-delivery-notes/TransferPurchaseDeliveryNotesGeneralData'
import { getBranchById, getTransferOrdersById } from '../../../../features/agricultural/stock-transfer/transfer-purchase-delivery-notes/TransferPurchaseDeliveryNotesServices'
import { getYearMonthDateFormat } from '../../../../utils/formatDate'
import { getOpenDeliveryNotesByTransferId } from '../../../../features/agricultural/stock-transfer/transfer-purchase-delivery-notes/TransferPurchaseDeliveryNotesServices'
import { getBPByCardCode } from '../../../../components/ui/Autocomplete/BusinessPartnerAutocomplete/BusinessPartnerAutocompleteService'
import AlertMessage from '../../../../components/ui/AlertMessage'

export default function TransferPurchaseDeliveryNotes() {

    const router = useRouter()
    const id = router.query.id
    const t = getTranslation()

    const [data, setData] = useState({})    
    const [deliveryNote, setDeliveryNote] = useState()
    const [deliveryNotesList, setDeliveryNotesList] = useState([])
    const [alert, setAlert] = useState({ visible: false, type: '', message: '' })

    useEffect(() => {
        if (id) {
            async function fetchData() {
                const result = await getTransferOrdersById(id)
                const branchData = await getOriginBranch(result)
                setData({
                    ...result,
                    ...branchData,
                    U_B2AG_Date: ''
                })
                const delivery = await getOpenDeliveryNotesByTransferId(id)
                setDeliveryNotesList(delivery)
            }
            fetchData()
        }
    }, [id])

    useEffect(() => {
        if (data.GrossWeight, data.TareWeight) {
            const sum = data.GrossWeight - data.TareWeight
            setField('LiquidWeight', sum)
        } else {
            setField('LiquidWeight', 0)
        }
    }, [data.GrossWeight, data.TareWeight])

    useEffect(async () => {
        const selectedDelivery = deliveryNotesList.filter(item => {
            return item.DocEntry === data.DeliveryNoteCode
        })
        setDeliveryNote(selectedDelivery[0])
    }, [data.DeliveryNoteCode])

    useEffect(async () => {
        if(deliveryNote) {
            const shippingData = await getBPByCardCode(deliveryNote.TaxExtension?.Carrier)
            if (shippingData) {
                setField('Carrier', `${shippingData[0].id} - ${shippingData[0].label}`)
            } 
        }
    }, [deliveryNote])

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

    async function getOriginBranch(transferOrder) {
        if (transferOrder) {
            const branchId = transferOrder.U_B2AG_OriginBranch.split(' - ')[0]
            const branchData = await getBranchById(branchId)
            return {
                DefaultVendorID: branchData.DefaultVendorID,
                BPLName: branchData.BPLName,
                U_B2AG_SupplierAddressId: branchData.U_B2AG_SupplierAddressId,
                State: branchData.State,
                County: branchData.County
            }
        }
    }

    return (
        <>
            <PageHeader
                title={'Recebimento de Transferência'}
            />
            <Tabs>
                <Box
                    index={1}
                    label="Dados Gerais"
                    component={<TransferPurchaseDeliveryNotesGeneralData
                        data={data}
                        setField={setField}
                        setChildField={setChildField}                        
                        deliveryNote={deliveryNote}
                        setDeliveryNote={setDeliveryNote}
                        deliveryNotesList={deliveryNotesList}
                        setAlert={setAlert}
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