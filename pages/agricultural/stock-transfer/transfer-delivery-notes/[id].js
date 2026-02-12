import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import getTranslation from '../../../../locales/getTranslation'
import { Box } from '@mui/material'
import PageHeader from '../../../../components/ui/PageHeader'
import Tabs from '../../../../components/ui/Tabs'
import TransferDeliveryNotesGeneralData from '../../../../features/agricultural/stock-transfer/transfer-delivery-notes/TransferDeliveryNotesGeneralData'
import { getBranchById, getTransferOrdersById } from '../../../../features/agricultural/stock-transfer/transfer-delivery-notes/TransferDeliveryNotesServices'
import { getYearMonthDateFormat } from '../../../../utils/formatDate'
import AlertMessage from '../../../../components/ui/AlertMessage'

export default function TransferDeliveryNotes() {

    const router = useRouter()
    const id = router.query.id
    const t = getTranslation()

    const [data, setData] = useState({})
    const [shipping, setShipping] = useState('')
    const [alert, setAlert] = useState({ visible: false, type: '', message: '' })

    useEffect(() => {
        if (id) {
            async function fetchData() {
                const result = await getTransferOrdersById(id)
                const branchData = await getDestinationBranch(result)
                setData({
                    ...result,
                    ...branchData,
                    U_B2AG_Date: getYearMonthDateFormat(result.U_B2AG_Date),
                    U_B2AG_Incoterms: result.U_B2AG_Incoterms ? result.U_B2AG_Incoterms.split(' - ')[0] : ''
                })
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

    async function getDestinationBranch(transferOrder) {
        if (transferOrder) {
            const branchId = transferOrder.U_B2AG_DestinationBranch.split(' - ')[0]
            const branchData = await getBranchById(branchId)
            return {
                DefaultCustomerID: branchData.DefaultCustomerID,
                BPLName: branchData.BPLName,
                U_B2AG_CustomerAddressId: branchData.U_B2AG_CustomerAddressId,
                State: branchData.State,
                County: branchData.County,
                FederalTaxID2: branchData.FederalTaxID2
            }
        }
    }

    return (
        <>
            <PageHeader
                title={t["app.agricultural.transfer-delivery-notes"]}
            />
            <Tabs>
                <Box
                    index={1}
                    label="Dados Gerais"
                    component={<TransferDeliveryNotesGeneralData
                        data={data}
                        setField={setField}
                        setChildField={setChildField}
                        shipping={shipping}
                        setShipping={setShipping}
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