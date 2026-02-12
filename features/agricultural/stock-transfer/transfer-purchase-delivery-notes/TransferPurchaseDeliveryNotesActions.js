import { useState } from 'react'
import { Stack, Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { createPurchaseDeliveryNotesModel } from './TransferPurchaseDeliveryNotesModels'
import { createPurchaseDeliveryNote, getTransferPurchaseDeliveryNoteReport, closeDeliveryNote } from './TransferPurchaseDeliveryNotesServices'
import { getSessionData } from '../../../../utils/frontEndGetSessionData'
import SaveIcon from '@mui/icons-material/Save'

export default function TransferPurchaseDeliveryNotesActions(props) {

    const [isGenerateDeliveryDisabled, setIsGenerateDeliveryDisabled] = useState(false)
    const [nfDocEntry, setNfDocEntry] = useState('')
    const [isClicked, setIsClicked] = useState(false)

    async function handleSubmit() {
        setIsClicked(true)
        if (props.data.U_B2AG_Date) {
            try {
                const submitData = await createPurchaseDeliveryNotesModel(props.data, props.deliveryNote)
                const result = await createPurchaseDeliveryNote(submitData)
                if (result?.DocEntry) {
                    await closeDeliveryNote(props.deliveryNote.DocEntry)
                    setIsGenerateDeliveryDisabled(true)
                    setNfDocEntry(result.DocEntry)
                }
                props.setAlert({ visible: true, type: "success", message: `Recebimento realizado com sucesso` })
            } catch (error) {
                props.setAlert({ visible: true, type: "error", message: `${error}` })
            } finally {
                setIsClicked(false)
            }
        } else {
            alert('Favor preencher a data do recebimento.')
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

        const base64 = await getTransferPurchaseDeliveryNoteReport(nfDocEntry, user)

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
                    Gerar Recebimento
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