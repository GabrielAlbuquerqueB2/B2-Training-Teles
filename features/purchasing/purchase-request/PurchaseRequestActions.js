import { useState } from 'react'
import { Stack } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save'
import { createPurchaseRequestModel, editPurchaseRequestModel, createPurchaseOrderModel } from './PurchaseRequestModel'
import { createPurchaseRequest, editPurchaseRequest, cancelPurchaseRequest, createPurchaseOrder, getPurchaseRequestReport } from './PurchaseRequestServices'
import { createAttachment, updateAttachment } from '../../../lib/attachments/AttachmentsService'
import PurchaseRequestXmlImport from './PurchaseRequestXmlImport'

export default function PurchaseRequestActions({ data, setData, requester, vendor, router, status, equipment, setAlert, setField, setIsPurchaseMade, fileList, setVendor }) {

    const [isLoading, setIsLoading] = useState(false)
    const [isCancelLoading, setIsCancelLoading] = useState(false)

    async function handleSubmit() {
        const unmatchedItems = data.DocumentLines.filter(line => line.xmlMatchStatus === 'nao_encontrado')
        if (unmatchedItems.length > 0) {
            const proceed = window.confirm(
                `Existem ${unmatchedItems.length} item(ns) não encontrado(s) no catálogo do fornecedor (destacados em vermelho). Deseja continuar mesmo assim?`
            )
            if (!proceed) return
        }

        setIsLoading(true)
        if (status === 'CREATE') {
            const attEntry = await handleAttachments()
            await handlePurchaseRequestCreation(attEntry)
        } else { // EDICAO
            let attEntry;
            if(data.AttachmentEntry) {
                attEntry = await handleAttachmentsUpdate()
            } else {
                attEntry = await handleAttachments()
            }
            await handlePurchaseRequestEdit(attEntry)
        }
        setIsLoading(false)
    }

    async function handleAttachments() {

        if (fileList.length > 0) {

            let formData = new FormData();

            await fileList.forEach((file, index) => {
                if(file.size > 0) {
                    console.log(file);
                    formData.append(`file_${index}`, file, file.name);
                }
            })

            return await createAttachment(formData)
                .then((result) => {
                    return result;
                })
                .catch((error) => {
                    throw new Error(error)
                })
        }
    }

    async function handleAttachmentsUpdate() {

        if (fileList.length > 0) {

            let formData = new FormData();

            await fileList.forEach((file, index) => {
                if(file.size > 0) {
                    formData.append(`file_${index}`, file, file.name);
                }
            })

            return await updateAttachment(formData, data.AttachmentEntry)
                .then((result) => {
                    return result;
                })
                .catch((error) => {
                    throw new Error(error)
                })
        }
    }

    async function handlePurchaseRequestCreation(attEntry) {
        const submitData = createPurchaseRequestModel(data, vendor, requester, equipment, attEntry)
        try {
            const result = await createPurchaseRequest(submitData)
            setAlert({ visible: true, type: "success", message: `Solicitação de compras cadastrada com sucesso` })
            setTimeout(() => {
                router.push('/purchasing/purchase-request/list')
            }, 3000)
        } catch (error) {
            setAlert({ visible: true, type: "error", message: `${error}` })
        } finally {
            setIsLoading(false)
        }
    }

    async function handlePurchaseRequestEdit(attEntry) {
        try {
            const submitData = editPurchaseRequestModel(data, vendor, requester, equipment, attEntry)
            await editPurchaseRequest(data.DocEntry, submitData)
            setAlert({ visible: true, type: "success", message: `Solicitação de compras atualizada com sucesso` })
            setTimeout(() => {
                router.push('/purchasing/purchase-request/list')
            }, 3000)
        } catch (error) {
            setAlert({ visible: true, type: "error", message: `${error}` })
        } finally {
            setIsLoading(false)
        }
    }

    async function handleCancel() {
        try {
            await cancelPurchaseRequest(data.DocEntry)
            alert('Solicitação de compras cancelada com sucesso')
            router.push('/purchasing/purchase-request/list')
        } catch (error) {
            alert(error)
        } finally {
            setIsLoading(false)
        }
    }

    async function handlePurchaseOrder() {
        try {
            const submitData = createPurchaseOrderModel(data, requester, vendor, equipment)
            console.log(submitData)
            const result = await createPurchaseOrder(submitData)
            alert('Pedido de compras criado com sucesso')
            router.push('/purchasing/purchase-request/list')
        } catch (error) {
            alert(error)
        } finally {
            setIsLoading(false)
        }
    }

    async function printPurchaseOrder() {
        const base64 = await getPurchaseRequestReport(data.DocEntry)

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
            <Stack direction="row" spacing={2}>
                <LoadingButton
                    loading={isLoading}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                >
                    {status === 'CREATE' ? 'ADICIONAR' : 'ATUALIZAR'}
                </LoadingButton>
                <LoadingButton
                    loading={isCancelLoading}
                    loadingPosition="start"
                    variant='outlined'
                    onClick={handleCancel}
                    disabled={status === 'CREATE'}
                >
                    CANCELAR SOLICITAÇÂO
                </LoadingButton>
                {/* <LoadingButton
                    loading={isCancelLoading}
                    loadingPosition="start"
                    variant='outlined'
                    onClick={handlePurchaseOrder}
                    disabled={status === 'CREATE' || data.DocumentStatus !== 'bost_Open'}
                >
                    GERAR PEDIDO DE COMPRA
                </LoadingButton> */}

                <LoadingButton
                    loading={isCancelLoading}
                    loadingPosition="start"
                    variant='outlined'
                    onClick={printPurchaseOrder}
                    disabled={status === 'CREATE'}
                >
                    IMPRIMIR SOLICITAÇÂO
                </LoadingButton>

                {status === 'CREATE' && (
                    <PurchaseRequestXmlImport
                        data={data}
                        setData={setData}
                        setIsPurchaseMade={setIsPurchaseMade}
                        setField={setField}
                        setAlert={setAlert}
                        setVendor={setVendor}
                    />
                )}
            </Stack>
            <br />
        </>
    )
}