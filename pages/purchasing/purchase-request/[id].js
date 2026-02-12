import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PageHeader from '../../../components/ui/PageHeader'
import Tabs from '../../../components/ui/Tabs'
import AlertMessage from '../../../components/ui/AlertMessage'
import PurchaseRequestGrid from '../../../features/purchasing/purchase-request/PurchaseRequestGrid'
import { getPurchaseRequestById, getRequesterById, getVendorById, getAttachmentsById, getAllCrops, getItemGroups, getAttachmentByFilename } from '../../../features/purchasing/purchase-request/PurchaseRequestServices'
import getTranslation from '../../../locales/getTranslation'
import PurchaseRequestHeader from '../../../features/purchasing/purchase-request/PurchaseRequestHeader'
import { getYearMonthDateFormat } from '../../../utils/formatDate'
import PurchaseRequestActions from '../../../features/purchasing/purchase-request/PurchaseRequestActions'
import { TextField, Box } from '@mui/material'
import Attachment from '../../../components/ui/Attachment'

export default function PurchaseRequest() {

    const router = useRouter()
    const id = router.query.id
    const t = getTranslation()

    const [data, setData] = useState({ DocumentLines: [{ Item: '', WarehouseCode: '', FreeText: '' }] })
    const [status, setStatus] = useState('CREATE')
    const [isPurchaseMade, setIsPurchaseMade] = useState(false)
    const [vendor, setVendor] = useState('')
    const [requester, setRequester] = useState('')
    const [equipment, setEquipment] = useState('')
    const [alert, setAlert] = useState({ visible: false, type: '', message: '' })
    const [crops, setCrops] = useState([])
    const [itemGroups, setItemGroups] = useState([])

    const [fileList, setFileList] = useState([]);
    
    useEffect(() => {
        async function fetchData() {
            const cropsList = await getAllCrops()
            setCrops(cropsList)
            const itemGroupsList = await getItemGroups()
            setItemGroups(itemGroupsList)

            if (id !== 'new' && id) {
                const result = await getPurchaseRequestById(id)
                if (result.AttachmentEntry) {
                    const attach = await getAttachmentsById(result.AttachmentEntry)
                    if (attach) {
                        setAttachList(attach.Attachments2_Lines)
                    }
                }
                const lines = result.DocumentLines.map(item => {
                    return {
                        Item: {
                            id: item.ItemCode,
                            label: item.ItemDescription
                        },
                        FreeText: item.FreeText,
                        Quantity: item.Quantity,
                        UnitPrice: item.UnitPrice,
                        WarehouseCode: item.WarehouseCode,
                        LineNum: item.LineNum,
                        LineVendor: item.LineVendor
                    }
                })
                if (result) {
                    setData({
                        ...result,
                        DocumentLines: lines,
                        DocDate: getYearMonthDateFormat(result.DocDate),
                        DocDueDate: getYearMonthDateFormat(result.DocDueDate),
                        RequriedDate: getYearMonthDateFormat(result.RequriedDate),
                        Usage: result.DocumentLines[0].Usage,
                        DocumentStatus: result.DocumentStatus
                    })
                    const requesterData = await getRequesterById(result.Requester)
                    setRequester({
                        id: requesterData.EmployeeID,
                        label: requesterData.FirstName + ' ' + requesterData.LastName
                    })
                    if (result.DocumentLines.length > 0) {
                        const vendorData = await getVendorById(result.DocumentLines[0].LineVendor)
                        setVendor({
                            id: vendorData.CardCode,
                            label: vendorData.CardName
                        })
                    }
                    if (result.U_B2AG_Equipment) {
                        const splitedEquipment = result.U_B2AG_Equipment.split(' - ')
                        setEquipment({
                            id: splitedEquipment[0],
                            label: splitedEquipment[1] + ' - ' + splitedEquipment[2]
                        })
                    }
                    setStatus('EDIT')
                    result.U_TX_NDfe ? setIsPurchaseMade(true) : ''
                }
            } else {
                setStatus('CREATE')
            }
        }

        fetchData()
    }, [id])

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

    function handleNewLine() {
        let newData = { ...data }
        newData.DocumentLines.push({ Item: '' })
        setData(newData)
    }

    function handleDeleteLine(index) {
        if (data.DocumentLines.length <= 1) return;
        let newData = { ...data }
        newData.DocumentLines.splice(index, 1)
        setData(newData)
    }

    function setAttachList(list) {
        const attach = list.map(item => {
            return {
                ...item,
                name: item.FileName + '.' + item.FileExtension
            }
        })
        setFileList(attach)
    }

    async function getFile(index) {

        const url = process.env.NEXT_PUBLIC_ATTACHMENTS
        location.href = `${url}${data.AttachmentEntry}/${fileList[index].FileName}.${fileList[index].FileExtension}`

    }

    return (
        <>
            <PageHeader
                title={t["app.purchasing.purchase-request.title"]}
            />
            <Tabs>
                <Box
                    index={1}
                    label="Dados Gerais"
                    component={<>
                        <PurchaseRequestHeader
                            data={data}
                            crops={crops}
                            setField={setField}
                            isPurchaseMade={isPurchaseMade}
                            setIsPurchaseMade={setIsPurchaseMade}
                            vendor={vendor}
                            setVendor={setVendor}
                            requester={requester}
                            setRequester={setRequester}
                            status={status}
                            equipment={equipment}
                            setEquipment={setEquipment}
                            itemGroups={itemGroups}
                        />
                        
                        <PurchaseRequestGrid
                            data={data}
                            setChildField={setChildField}
                            handleNewLine={handleNewLine}
                            handleDeleteLine={handleDeleteLine}
                        />
                        <br />
                        <TextField
                            label="Observações"
                            multiline
                            rows={3}
                            value={data.Comments ?? ''}
                            onChange={(evt) => setField('Comments', evt.target.value)}
                        />
                    </>}
                />
                <Box
                    index={2}
                    label="Anexos"
                    component={<>
                        <Attachment
                            fileList={fileList}
                            setFileList={setFileList}
                            getFile={getFile}
                        />
                    </>}
                />
            </Tabs>
            <br />
            <PurchaseRequestActions
                data={data}
                setData={setData}
                t={t}
                vendor={vendor}
                requester={requester}
                router={router}
                status={status}
                isPurchaseMade={isPurchaseMade}
                setIsPurchaseMade={setIsPurchaseMade}
                equipment={equipment}
                setAlert={setAlert}
                setField={setField}
                fileList={fileList}
            />
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