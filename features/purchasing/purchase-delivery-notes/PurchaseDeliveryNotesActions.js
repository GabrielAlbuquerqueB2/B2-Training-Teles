import { useState } from 'react'
import { Stack } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save'
import { createPurchaseDeliveryNotesModel, updatePurchaseDeliveryNotesModel } from './PurchaseDeliveryNotesModels'
import { createPurchaseDeliveryNotes, updatePurchaseDeliveryNotes } from './PurchaseDeliveryNotesServices'

export default function PurchaseDeliveryNotesActions(props) {

    const [isClicked, setIsClicked] = useState(false)

    async function handleSubmit() {
        if(props.status === 'UPDATE') {
            await handleUpdatePurchaseDeliveryNote()
        } else {
            await handleCreatePurchaseDeliveryNote()
        }
    }

    async function handleCreatePurchaseDeliveryNote() {
        setIsClicked(true)
        try {
            const obj = createPurchaseDeliveryNotesModel(props.data, props.purchaseOrder, props.expenses, props.addresses)
            const result = await createPurchaseDeliveryNotes(obj)
            props.setAlert({ visible: true, type: "success", message: `Recebimento de mercadorias cadastrado com sucesso` })
            setTimeout(() => {
                props.router.push('/purchasing/purchase-delivery-notes/list')
            }, 2000)
        } catch (error) {
            props.setAlert({ visible: true, type: "error", message: `${error}`})
        } finally {
            setIsClicked(false)
        }
    }

    async function handleUpdatePurchaseDeliveryNote() {
        setIsClicked(true)
        try {
            const obj = updatePurchaseDeliveryNotesModel(props.data)
            const result = await updatePurchaseDeliveryNotes(obj, props.data.DocEntry)
            props.setAlert({ visible: true, type: "success", message: `Recebimento de mercadorias atualizado com sucesso` })
            setTimeout(() => {
                props.router.push('/purchasing/purchase-delivery-notes/list')
            }, 3000) 
        } catch (error) {
            props.setAlert({ visible: true, type: "error", message: `${error}`})
        } finally {
            setIsClicked(false)
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
                >
                   { props.status === 'UPDATE' ? 'Atualizar' : 'Adicionar' }
                </LoadingButton>
            </Stack>
            <br />
        </>
    )
}