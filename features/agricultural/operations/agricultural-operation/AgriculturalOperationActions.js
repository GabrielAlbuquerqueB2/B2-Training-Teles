import { useState } from 'react'
import { useRouter } from 'next/router'
import { LoadingButton } from '@mui/lab'
import { createAgriculturalOperationModel } from './AgriculturaOperationModel'
import { creatInventoryGenExit } from './AgriculturalOperationServices'
import SaveIcon from '@mui/icons-material/Save'

export default function AgriculturalOperationActions(props) {

    const router = useRouter()

    const [isClicked, setIsClicked] = useState(false)

    async function handleSubmit() {
        try {
            setIsClicked(true)
            const agriculturalOperation = await createAgriculturalOperationModel(props.data)
            const result = await persistInventoryGenExitsList(agriculturalOperation)
            props.setAlert({ visible: true, type: "success", message: `Operação registrada com sucesso` })            
            setTimeout(() => {
                router.push('/agricultural/operations/agricultural-operation/list')
            }, 3000)
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
            <LoadingButton
                onClick={handleSubmit}
                loading={isClicked}
                loadingPosition="start"
                startIcon={<SaveIcon />}
            >
                Adicionar
            </LoadingButton>
        </>
    )
}