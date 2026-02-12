import { useState } from 'react'
import { TextField, Dialog, DialogContentText, DialogActions, DialogContent, Box, Grid, Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Select from '../../../components/ui/Select'
import { createPurchaseDeliveryNotesThirdModel } from './PurchaseDeliveryNotesObjectModels'
import { createPurchaseDeliveryNote } from './GoodsReceivedNoteServices'


export default function PurchaseDeliveryNotesModal(props) {

    const [isPurchaseDeliveryNotesClicked, setIsPurchaseDeliveryNotesClicked] = useState(false)
    const [invoiceData, setInvoiceData] = useState({ dateInvoice: '', quantity: props.data.U_B2AG_LiquidWeight, unitPrice: 0, closingRemarks: '', incoterms: '' })

    const [incotermsList] = useState([
        { value: '0', description: 'Frete por conta do Remetente (CIF)' },
        { value: '1', description: 'Frete por conta do Destinatário (FOB)' },
        { value: '2', description: 'Frete por conta de Terceiros' },
        { value: '3', description: 'Transporte Próprio por conta do Remetente' },
        { value: '4', description: 'Transporte Próprio por conta do Destinatário' },
        { value: '9', description: 'Sem Ocorrência de Transporte' }
    ])

    async function createPurchaseDeliveryNoteObject() {
        setIsPurchaseDeliveryNotesClicked(true)
        try {
            const submitData = await createPurchaseDeliveryNotesThirdModel(props.data, props.contract, invoiceData)
            if (submitData) {
                const result = await createPurchaseDeliveryNote(submitData)
                props.setAlert({ visible: true, type: "success", message: "Recebimento de mercadoria realizada com sucesso" })
                setTimeout(() => {
                    window.location = `/origin-and-dispatch/goods-received-note/${props.data.DocNum}`
                }, 3000)
            }
        } catch (error) {
            console.log(error)
            props.setAlert({ visible: true, type: "error", message: `${error}` })
        } finally {
            setIsPurchaseDeliveryNotesClicked(false)
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
                            <Grid item xs={6}>
                                <TextField
                                    label="Data NF"
                                    type='date'
                                    value={invoiceData.dateInvoice}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, dateInvoice: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Select
                                    label="Tipo de Frete"
                                    value={invoiceData.incoterms}
                                    setState={(e) => setInvoiceData({ ...invoiceData, incoterms: e })}
                                    list={incotermsList}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Nº NF"
                                    type='text'
                                    value={invoiceData.numberInvoice}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, numberInvoice: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Série NF"
                                    type='text'
                                    value={invoiceData.serialInvoice}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, serialInvoice: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Chave de Acesso NF"
                                    type='text'
                                    value={invoiceData.accessKeyInvoice}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, accessKeyInvoice: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Quantidade KG"
                                    type='number'
                                    value={invoiceData.quantity}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, quantity: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Preço KG"
                                    type='number'
                                    value={invoiceData.unitPrice}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, unitPrice: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Observações Fisco"
                                    multiline
                                    rows={3}
                                    value={invoiceData.closingRemarks}
                                    onChange={(e) => setInvoiceData({ ...invoiceData, closingRemarks: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        loading={isPurchaseDeliveryNotesClicked}
                        loadingPosition="start"
                        onClick={createPurchaseDeliveryNoteObject}
                    >
                        Gerar NF</LoadingButton>
                    <Button onClick={props.handleClose}>Fechar</Button>
                </DialogActions>

            </Dialog>
        </>
    )
}