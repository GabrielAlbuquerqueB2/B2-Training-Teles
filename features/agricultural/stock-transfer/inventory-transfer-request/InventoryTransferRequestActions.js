import { useState } from 'react'
import { Stack } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save'
import { createInventoryTransferRequestObject, createStockTransferObject } from './InventoryTransferRequestModels'
import { createInventoryTransferRequests, createStockTransfer, updateInventoryTransferRequests } from './InventoryTransferRequestServices'

export default function InventoryTransferRequestActions(props) {

    const { isClosed } = props

    const [isClicked, setIsClicked] = useState(false)
    const [isGenerateClicked, setIsGenerateClicked] = useState(false)

    async function handleSubmit() {

        if(props.formMode.mode === 'CREATE') {
            await handleCreateInventoryTransferRequest()
        } else {
            await handleUpdateInventoryTransferRequest()
        }

    }

    async function handleCreateInventoryTransferRequest() {

        setIsClicked(true)
        try {
            const submitData = await createInventoryTransferRequestObject(props.data)
            const result = await createInventoryTransferRequests(submitData)
            alert('Pedido de Transferência Interna realizado com sucesso')
            props.router.push(`/agricultural/stock-transfer/inventory-transfer-request/${result.DocEntry}`)
        } catch (error) {
            alert(error)
        } finally {
            setIsClicked(false)
        }
    }

    async function handleUpdateInventoryTransferRequest() {

        setIsClicked(true)
        try {
            const submitData = await createInventoryTransferRequestObject(props.data)
            const result = await updateInventoryTransferRequests(submitData, props.data.DocEntry)
            alert('Pedido de Transferência Interna atualizado com sucesso')            
        } catch (error) {
            alert(error)
        } finally {
            setIsClicked(false)
        }
    }

    async function handleCreateStockTransfer() {

        setIsGenerateClicked(true)
        try {
            const submitData = await createStockTransferObject(props.data)
            console.log(submitData)
            const result = await createStockTransfer(submitData)
            console.log(result)
            alert('Transferência Interna realizada com sucesso')
            props.router.push('/agricultural/stock-transfer/inventory-transfer-request/list')
        } catch (error) {
            alert(error)
        } finally {
            setIsGenerateClicked(false)
        }
    }

    return (
        <>
            <Stack direction="row" spacing={2}>
                <LoadingButton
                    loading={isClicked}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                    disabled={isClosed}
                >
                    {props.formMode.buttonLabel}
                </LoadingButton>
                <LoadingButton
                    variant='outlined'
                    loading={isGenerateClicked}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    onClick={handleCreateStockTransfer}
                    disabled={isClosed || props.formMode.mode === 'CREATE'}
                >
                    Gerar Transferência Interna
                </LoadingButton>
            </Stack>
            <br />
        </>
    )
}