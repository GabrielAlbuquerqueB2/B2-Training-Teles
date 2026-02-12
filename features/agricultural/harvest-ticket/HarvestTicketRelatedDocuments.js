import { useState } from 'react'
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Typography, Grid, Stack, Button } from "@mui/material"
import { inventoryTransferObject, inventoryGenExitObject } from './HarvestTickectObjectModels'
import { createStockTransfer, creatInventoryGenExit } from './HarvestTicketServices'
import DeliveryNoteModal from './DeliveryNoteModal'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save'

export default function HarvestTicketRelatedDocuments(props) {

    const [isStockTransferClicked, setIsStockTransferClicked] = useState(false)
    const [isInventoryGenExitClicked, setIsInventoryGenExitClicked] = useState(false)
    const [open, setOpen] = useState(false)
    function handleClose() {
        setOpen(false)
    }

    async function createStockTransferObject() {
        setIsStockTransferClicked(true)
        if (validateQuantity()) {
            try {
                await props.doUpdateHarvestTicket()
                const submitData = await inventoryTransferObject(props.data)
                await createStockTransfer(submitData)
                props.setAlert({ visible: true, type: "success", message: "Transferência realizada com sucesso" })
                setTimeout(() => {
                    window.location = `/agricultural/harvest-ticket/${props.data.DocNum}`
                }, 3000)
            } catch (error) {
                props.setAlert({ visible: true, type: "error", message: `${error}` })
            } finally {
                setIsStockTransferClicked(false)
            }
        } else {
            alert('Verifique as quantidades das variedades informadas.')
            setIsStockTransferClicked(false)
        }
    }

    async function createInventoryGenExitObject() {
        setIsInventoryGenExitClicked(true)
        if (validateQuantity()) {
            try {
                await props.doUpdateHarvestTicket()
                const submitData = await inventoryGenExitObject(props.data)
                await creatInventoryGenExit(submitData)
                alert('Saída de mercadoria realizada com sucesso')
                props.router.push('/agricultural/harvest-ticket/list')
            } catch (error) {
                alert(error)
            } finally {
                setIsInventoryGenExitClicked(false)
            }
        } else {
            alert('Verifique as quantidades das variedades informadas.')
            setIsInventoryGenExitClicked(false)
        }
    }

    function validateQuantity() {
        return props.totalVarietySum.toFixed(3) === props.data.U_B2AG_LiquidWeight.toFixed(3)
    }

    return (
        <>
            <Typography variant="h6">Documentos Relacionados</Typography>
            <TableContainer disabled>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nº Documento</TableCell>
                            <TableCell>Tipo Documento</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.documents?.map(doc => {
                            return (
                                <TableRow>
                                    <TableCell>{doc.DocNum}</TableCell>
                                    <TableCell>{doc.Type}</TableCell>
                                </TableRow>
                            )
                        }) || []}
                    </TableBody>
                </Table>
            </TableContainer>
            <br />
            <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                    {
                        (props.data.U_B2AG_B2ObjectType === 'OwnWarehouse' || props.data.U_B2AG_B2ObjectType === 'ThirdPartyWarehouse') &&
                        <LoadingButton
                            loading={isStockTransferClicked}
                            loadingPosition="start"
                            startIcon={<SaveIcon />}
                            onClick={createStockTransferObject}
                            disabled={props.documents.some(doc => doc.Type === 'Transferência de Estoque') || props.formMode.mode === 'CREATE'}
                        >
                            Gerar Transferência de Estoque
                        </LoadingButton>
                    }
                    {
                        props.data.U_B2AG_B2ObjectType === 'SeedShipment' &&
                        <LoadingButton
                            loading={isInventoryGenExitClicked}
                            loadingPosition="start"
                            startIcon={<SaveIcon />}
                            onClick={createInventoryGenExitObject}
                            disabled={(props.documents.length > 0) || props.formMode.mode === 'CREATE'}
                        >
                            Gerar Saída de Mercadoria
                        </LoadingButton>
                    }
                    {
                        props.data.U_B2AG_B2ObjectType === 'ThirdPartyWarehouse' &&
                        <Button
                            onClick={() => setOpen(true)}
                            disabled={props.documents.some(doc => doc.Type === 'Nota Fiscal de Remessa') || props.formMode.mode === 'CREATE'}
                        >
                            Gerar NF Remessa
                        </Button>
                    }
                </Stack>
                <DeliveryNoteModal
                    open={open}
                    handleClose={handleClose}
                    router={props.router}
                    setRelatedDocuments={props.setRelatedDocuments}
                    data={props.data}
                    setAlert={props.setAlert}
                />
            </Grid>
        </>
    )
}