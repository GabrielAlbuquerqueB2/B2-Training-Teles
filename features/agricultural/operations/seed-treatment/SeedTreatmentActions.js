import { useState } from 'react'
import { Stack } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save'

export default function SeedTreatmentActions(props) {

    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit() {
        console.log(props.data)
    }

    return (
        <Stack spacing={2} direction="row">
            <LoadingButton
                onClick={handleSubmit}
                loading={isLoading}
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
            >
                {props.status === 'CREATE' ? 'Adicionar' : 'Editar'}
            </LoadingButton>
        </Stack>
    )
}