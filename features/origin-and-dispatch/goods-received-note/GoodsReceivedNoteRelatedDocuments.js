import { useState, useEffect } from 'react'
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Typography, Grid, Stack } from "@mui/material"
import Select from '../../../components/ui/Select'
import { createPurchaseDeliveryNotesModel } from './PurchaseDeliveryNotesObjectModels'
import { createPurchaseDeliveryNote, getTransferNotesByBranchAndPn, closePurchaseDeliveryNote } from './GoodsReceivedNoteServices'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save'
import PurchaseDeliveryNotesModal from './PurchaseDeliveryNotesModal'

export default function GoodsReceivedNoteRelatedDocuments(props) {

    const [transferNotesList, setTranferNotesList] = useState([])
    const [transferNotes, setTranferNotes] = useState('')
    const [isClicked, setIsClicked] = useState(false)
    const [open, setOpen] = useState(false)
    function handleClose() {
        setOpen(false)
    }

    useEffect(() => {
        async function getData() {
            const transfers = await getTransferNotesByBranchAndPn(props.contract.U_B2AG_Branch, props.contract.U_B2AG_BPCardCode)
            const mappedTransfers = mapTransferNotesToSelect(transfers)
            setTranferNotesList(mappedTransfers)
        }
        getData()
    }, [])

    function mapTransferNotesToSelect(transfers) {
        return transfers.map(item => {
            return {
                value: item.PurchaseDeliveryNotes.DocEntry,
                description: `${item.PurchaseDeliveryNotes.SequenceSerial} - ${item["PurchaseDeliveryNotes/TaxExtension"].Vehicle}`
            }
        })
    }


    async function createPurchaseDelivery() {
            setOpen(true)
    }

    function validateQuantity() {
        return props.totalVarietySum.toFixed(3) === props.data.U_B2AG_LiquidWeight.toFixed(3)
    }

    return (
        <>
            {/* <Typography variant="h6">Nota de Trânsito</Typography>
            <Select
                label="Nota"
                list={transferNotesList}
                value={transferNotes}
                disabled={props.documents.length > 0 || props.formMode.mode === 'CREATE'}
                setState={setTranferNotes}
            /> */}
            <Typography variant="h6">Documentos Relacionados</Typography>
            <TableContainer disabled>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nº Documento</TableCell>
                            <TableCell>Tipo Documento</TableCell>
                            <TableCell>NF</TableCell>
                            {/* <TableCell>NF Transito</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.documents?.map(doc => {
                            return (
                                <TableRow>
                                    <TableCell>{doc.DocNum}</TableCell>
                                    <TableCell>{doc.Type}</TableCell>
                                    <TableCell>{doc.NF}</TableCell>
                                    {/* <TableCell>{doc.NFTransito}</TableCell> */}
                                </TableRow>
                            )
                        }) || []}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid item xs={12}>
                <br />
                <Stack direction="row" spacing={2}>
                    <LoadingButton
                        loading={isClicked}
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        onClick={createPurchaseDelivery}
                        disabled={props.documents.length > 0 || props.formMode.mode === 'CREATE' || (props.contract.U_B2AG_InvoiceIssuance != 0 ? false : !transferNotes)}
                    >
                        Gerar Recebimento de Mercadoria
                    </LoadingButton>
                </Stack>
            </Grid>
            <PurchaseDeliveryNotesModal
                open={open}
                handleClose={handleClose}
                router={props.router}
                data={props.data}
                contract={props.contract}
                setAlert={props.setAlert}
            />
        </>
    )
}