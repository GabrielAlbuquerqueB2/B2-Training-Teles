import { useState } from 'react'
import { Stack, Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { createDeliveryNotesModel } from './TransferDeliveryNotesModels'
import { createDeliveryNote, getTransferDeliveryNoteReport } from './TransferDeliveryNotesServices'
import { getSessionData } from '../../../../utils/frontEndGetSessionData'
import SaveIcon from '@mui/icons-material/Save'

export default function TransferDeliveryNotesActions(props) {

    const [isGenerateDeliveryDisabled, setIsGenerateDeliveryDisabled] = useState(false)
    const [nfDocEntry, setNfDocEntry] = useState('')
    const [isClicked, setIsClicked] = useState(false)

    async function handleSubmit() {        
        setIsClicked(true)        
        try {
            const submitData = await createDeliveryNotesModel(props.data, props.shipping)
            const result = await createDeliveryNote(submitData)
            if (result?.DocEntry) {
                setIsGenerateDeliveryDisabled(true)
                setNfDocEntry(result.DocEntry)
            }
            props.setAlert({ visible: true, type: "success", message: `Remessa gerada com sucesso` })
        } catch (error) {
            props.setAlert({ visible: true, type: "error", message: `${error}`})
        } finally {
            setIsClicked(false)
        }
    }

    async function handlePrint() {
        let user = ''
        const sessionData = getSessionData()
        if (sessionData) {
            const userName = JSON.parse(sessionData).user
            user = userName
        }

        const base64 = await getTransferDeliveryNoteReport(nfDocEntry, user)

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
                    loading={isClicked}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                    disabled={isGenerateDeliveryDisabled}
                >
                    Gerar Entrega
                </LoadingButton>
                <Button
                    onClick={handlePrint}
                    disabled={!isGenerateDeliveryDisabled}
                >
                    Imprimir Romaneio
                </Button>
            </Stack>

            <br />
        </>
    )
}