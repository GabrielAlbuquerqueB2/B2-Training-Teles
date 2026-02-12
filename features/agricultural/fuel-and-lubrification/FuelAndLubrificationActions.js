import { useState } from 'react'
import { Stack } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { createFuelInventoryGenExitModel } from './FuelAndLubrificationsModels'
import { creatInventoryGenExit } from './FuelAndLubrificationsServices'
import SaveIcon from '@mui/icons-material/Save'

export default function FuelAndLubrificationActions(props) {

    const [isClicked, setIsClicked] = useState(false)

    async function handleSubmit() {
        setIsClicked(true)
        const submitData = await createFuelInventoryGenExitModel(props.data, props.equipment, props.employee, props.item)            
        try {
            const result = await creatInventoryGenExit(submitData)
            props.setAlert({ visible: true, type: "success", message: `Apontamento realizado com sucesso` })
            setTimeout(() => {
                props.router.push('/agricultural/fuel-and-lubrification/list')
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
                    Adicionar
                </LoadingButton>
            </Stack>
            <br />
        </>
    )
}