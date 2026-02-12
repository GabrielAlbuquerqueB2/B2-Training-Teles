import { useState } from 'react'
import { Stack } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save'
import {createProductionAnalisys, editProductionAnalisys} from './ProductionAnalisysServices'
import {createProductionAnalisysModel} from './ProductionAnalisysModel'

export default function ProductionAnalisysActions(props) {

    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit() {
        setIsLoading(true)
        if (props.status === 'CREATE') {
            
            await handleProductionAnalisysCreation()
        } else {
            await handleProductionAnalisysEdit()
        }
        setIsLoading(false)
    }

    async function handleProductionAnalisysCreation() {
        const submitData = createProductionAnalisysModel(props.data)
        try {
            const result = await createProductionAnalisys(submitData)
            props.setAlert({ visible: true, type: "success", message: `Análise atualizada com sucesso` })
            setTimeout(() => {
                window.location = '/agricultural/field-control/production-analisys/new'
            }, 3000)
        } catch (error) {
            props.setAlert({ visible: true, type: "error", message: `${error}`})
        } finally {
            setIsLoading(false)
        }
    }

    async function handleProductionAnalisysEdit() {
        const submitData = createProductionAnalisysModel(props.data)
        try {
            const result = await editProductionAnalisys(props.data.DocEntry, submitData)
            props.setAlert({ visible: true, type: "success", message: `Análise cadastrada com sucesso` })
            /* setTimeout(() => {
                window.location = '/agricultural/field-control/production-analisys/new'
            }, 3000) */
        } catch (error) {
            props.setAlert({ visible: true, type: "error", message: `${error}`})
        } finally {
            setIsLoading(false)
        }
    }

    return(
        <>
        <Stack direction="row" spacing={2}>
        <LoadingButton
                    loading={isLoading}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                >
                    {props.status === 'CREATE' ? 'ADICIONAR' : 'ATUALIZAR'}
                </LoadingButton>
        </Stack>
        </>
    )
}