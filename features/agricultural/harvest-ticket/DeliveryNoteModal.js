import { useState } from 'react'
import { TextField, Dialog, DialogContentText, DialogActions, DialogContent, Box, Grid, Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Select from '../../../components/ui/Select'
import { deliveryNoteObject } from './HarvestTickectObjectModels'
import { createDeliveryNote } from './HarvestTicketServices'

export default function DeliveryNoteModal(props) {

    const [isDeliveryNotesClicked, setIsDeliveryNotesClicked] = useState(false)
    const [incoterms, setIncoterms] = useState('0')
    const [unitPrice, setUnitPrice] = useState()
    const [quantity, setQuantity] = useState(props.data.U_B2AG_LiquidWeight)
    const [closingRemarks, setClosingRemarks] = useState('')

    const [incotermsList] = useState([
        { value: '0', description: 'Frete por conta do Remetente (CIF)' },
        { value: '1', description: 'Frete por conta do Destinatário (FOB)' },
        { value: '2', description: 'Frete por conta de Terceiros' },
        { value: '3', description: 'Transporte Próprio por conta do Remetente' },
        { value: '4', description: 'Transporte Próprio por conta do Destinatário' },
        { value: '9', description: 'Sem Ocorrência de Transporte' }
    ])

    async function createDeliveryNoteObject() {
        setIsDeliveryNotesClicked(true)
        try {
            const submitData = await deliveryNoteObject(props.data, quantity, incoterms, unitPrice, closingRemarks)
            if (submitData) {
                const result = await createDeliveryNote(submitData)
                props.setAlert({ visible: true, type: "success", message: "NF de entrega gerada com sucesso" })
                setTimeout(() => {
                    window.location = `/agricultural/harvest-ticket/${props.data.DocNum}`
                }, 3000)
            }
        } catch (error) {
            props.setAlert({ visible: true, type: "error", message: `${error}` })
        } finally {
            setIsDeliveryNotesClicked(false)
        }
    }

    return (
        <>
            <Dialog
                fullWidth={false}
                maxWidth={'xs'} // 'xs', 'sm', 'md', 'lg', 'xl' ou false
                open={props.open}
                onClose={props.handleClose}
            >
                <DialogContent>
                    <DialogContentText>
                        Propriedades da NF
                    </DialogContentText>
                </DialogContent>
                <DialogContent>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Select
                                    label="Tipo de Frete"
                                    value={incoterms}
                                    setState={(e) => setIncoterms(e)}
                                    list={incotermsList}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Quantidade KG"
                                    type='number'
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Preço KG"
                                    type='number'
                                    value={unitPrice}
                                    onChange={(e) => setUnitPrice(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Observações Fisco"
                                    multiline
                                    rows={3}
                                    value={closingRemarks}
                                    onChange={(e) => setClosingRemarks(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        loading={isDeliveryNotesClicked}
                        loadingPosition="start"
                        onClick={createDeliveryNoteObject}
                    >
                        Gerar NF</LoadingButton>
                    <Button onClick={props.handleClose}>Fechar</Button>
                </DialogActions>

            </Dialog>
        </>
    )
}