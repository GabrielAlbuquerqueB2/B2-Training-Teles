import { useState } from 'react'
import { Stack } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save'
import { createWeatherNoteModel } from "./WeatherNoteModel"
import { createWeatherNote, editWeatherNote } from "./WeatherNoteServices"


export default function WeatherNoteActions(props) {

    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit() {
        setIsLoading(true)
        if (props.status === 'CREATE') {
            
            await handleWeatherNoteCreation()
        } else {
            await handleWeatherNoteEdit()
        }
        setIsLoading(false)
    }

    async function handleWeatherNoteCreation() {
        const submitData = createWeatherNoteModel(props.data)
        try {
            const result = await createWeatherNote(submitData)
            props.setAlert({ visible: true, type: "success", message: `Registro criado com sucesso` })
            setTimeout(() => {
                window.location = '/agricultural/field-control/weather-note/new'
            }, 3000)
        } catch (error) {
            props.setAlert({ visible: true, type: "error", message: `${error}`})
        } finally {
            setIsLoading(false)
        }
    }

    async function handleWeatherNoteEdit() {
        const submitData = createWeatherNoteModel(props.data)
        try {
            const result = await editWeatherNote(props.data.DocEntry, submitData)
            props.setAlert({ visible: true, type: "success", message: `Registro atualizado com sucesso` })
            /* setTimeout(() => {
                window.location = '/agricultural/field-control/production-analisys/new'
            }, 3000) */
        } catch (error) {
            props.setAlert({ visible: true, type: "error", message: `${error}`})
        } finally {
            setIsLoading(false)
        }
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
                    {props.status === 'CREATE' ? 'ADICIONAR' : 'ATUALIZAR'}
                </LoadingButton>
            </Stack>
        </>
    )
}