import { Dialog, DialogTitle, DialogActions, DialogContent, Button } from '@mui/material'
import WarehouseExitInventoryEntriesFind from './WarehouseExitInventoryEntriesFind'
import { getPurchaseDeliveryNotesById } from './WarehouseExitServices'

export default function WarehouseExitCopyFromDialog(props) {

    async function handleDeliveryNoteSelection() {
        const purchaseDelivery = await getPurchaseDeliveryNotesById(props.selectedPurchaseDeliveryNote)
        const mappedLines = mapLinesToGrid(purchaseDelivery.DocumentLines)
        props.setField('DocumentLines', mappedLines)
        props.setIsDialogOpen(false)
    }

    function mapLinesToGrid(lines) {
        const result = lines.map(line => {
            return {
                Item: {
                    id: line.ItemCode,
                    label: line.ItemDescription,
                    InventoryUOM: line.MeasureUnit
                },
                WhsCode: line.WarehouseCode,
                Quantity: line.Quantity
            }
        })

        console.log(result)
        return [{
            Item: {
                id: '',
                label: '',
                InventoryUOM: ''
            },
            WhsCode: '',
            Quantity: ''
        }, ...result]
    }

    return (
        <Dialog
            open={props.isDialogOpen}
            onClose={props.handleDialogClose}
            maxWidth="lg"
            fullWidth={true}
        >
            <DialogTitle>
                Selecione o Recebimento de Mercadoria:
            </DialogTitle>
            <DialogContent>
                <WarehouseExitInventoryEntriesFind
                    selectedPurchaseDeliveryNote={props.selectedPurchaseDeliveryNote}
                    setSelectedPurchaseDeliveryNote={props.setSelectedPurchaseDeliveryNote}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    variant='outlined'
                    onClick={() => {
                        props.setIsDialogOpen(false)
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleDeliveryNoteSelection}
                >
                    Copiar
                </Button>
            </DialogActions>
        </Dialog>
    )
}