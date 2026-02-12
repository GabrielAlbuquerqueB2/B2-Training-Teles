import { useState } from 'react'
import { Stack } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { createWarehouseExitGenExitModel } from './WarehouseExitModels'
import { creatInventoryGenExit, closeWarehouseExitFieldInPurchasewDeliveryNote } from './WarehouseExitServices'
import SaveIcon from '@mui/icons-material/Save'
import WarehouseExitCopyFromButton from './WarehouseExitCopyFromButton'
import WarehouseExitCopyFromDialog from './WarehouseExitCopyFromDialog'

export default function FuelAndLubrificationActions(props) {

    const [isClicked, setIsClicked] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedPurchaseDeliveryNote, setSelectedPurchaseDeliveryNote] = useState({})

    async function handleSubmit() {
        setIsClicked(true)
        try {
            const submitData = await createWarehouseExitGenExitModel(props.data, props.equipment, props.employee)    
            const result = await persistInventoryGenExitsList(submitData) 
            await closeWarehouseExitFieldInPurchasewDeliveryNote(selectedPurchaseDeliveryNote)
            if (result?.DocEntry) {
                setIsGenerateDeliveryDisabled(true)
                setNfDocEntry(result.DocEntry)
            }
            props.setAlert({ visible: true, type: "success", message: `Saída de Almoxarifado realizado com sucesso` })
            setTimeout(() => {
                window.location = '/stockroom/warehouse-exit/list'
            }, 2000)
        } catch (error) {
            props.setAlert({ visible: true, type: "error", message: `${error}`})
        } finally {
            setIsClicked(false)
        }
    }

    async function persistInventoryGenExitsList(list) {
        const promises = list.map(async exit => {
            return await creatInventoryGenExit(exit)
        })

        return await Promise.all(promises)
    }

    return (
        <>
            <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
                <LoadingButton
                    loading={isClicked}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                >
                    Adicionar
                </LoadingButton>
                <WarehouseExitCopyFromButton 
                    data={props.data}
                    setIsDialogOpen={setIsDialogOpen}                    
                />
            </Stack>
            <br />
            <WarehouseExitCopyFromDialog 
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                setField={props.setField}
                selectedPurchaseDeliveryNote={selectedPurchaseDeliveryNote}
                setSelectedPurchaseDeliveryNote={setSelectedPurchaseDeliveryNote}
            />
        </>
    )
}