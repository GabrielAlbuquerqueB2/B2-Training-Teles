import React from 'react';
import { Modal, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { approvalAccepted, approvalRejected } from './ApprovalRequestsModel';
import { updateApprovalRequest } from './ApprovalRequestsServices';
import { getDateMonthYearFormat } from '../../utils/formatDate';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
};

export default function ApprovalRequestsModal({ open, onClose, draft, setAlert }) {    
    
    async function Accepted() {
        try {
            const data = approvalAccepted();
            await updateApprovalRequest(data, draft.Code);
            setAlert({ visible: true, type: 'success', message: 'Pedido aprovado com sucesso.' });
            onClose();
        } catch (error) {
            setAlert({ visible: true, type: 'error', message: error.message || 'Erro ao aprovar o pedido.' });
        }
    }
    async function Rejected() {
         try {
            const data = approvalRejected();
            await updateApprovalRequest(data, draft.Code);
            setAlert({ visible: true, type: 'error', message: 'Pedido foi rejeitado.' });
            onClose();
        } catch (error) {
            setAlert({ visible: true, type: 'error', message: error.message || 'Erro ao recusar o pedido.' });
        }
    }

    if (!draft) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" gutterBottom>Dados do Documento</Typography>
                <Typography variant="body2"><b>Data:</b> {getDateMonthYearFormat(draft.DocDate)}</Typography>
                <Typography variant="body2"><b>Fornecedor:</b> {draft.CardCode} - {draft.CardName}</Typography>
                <Typography variant="body2"><b>Endereço:</b> {draft.Address}</Typography>
                <Typography variant="body2"><b>CNPJ:</b> {draft.FederalTaxID}</Typography>
                <Typography variant="body2"><b>Total:</b> R$: {draft.DocTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                <br />
                <Typography variant="body2"><b>Filial:</b> {draft.BPLName}</Typography>
                <Typography variant="body2"><b>Equipamento:</b> {draft.U_B2AG_Equipment}</Typography>
                <Typography variant="body2"><b>Observação:</b> {draft.Comments}</Typography>
                <Typography variant="body2" sx={{ mt: 2, mb: 1 }}><b>Itens do Documento:</b></Typography>
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Código</TableCell>
                                <TableCell>Descrição</TableCell>
                                <TableCell>Quantidade</TableCell>
                                <TableCell>Preço</TableCell>
                                <TableCell>Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {draft.DocumentLines && draft.DocumentLines.map((line, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{line.ItemCode}</TableCell>
                                    <TableCell>{line.ItemDescription}</TableCell>
                                    <TableCell>{line.Quantity}</TableCell>
                                    <TableCell>{line.Price?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                    <TableCell>{line.LineTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="contained" color="success" onClick={Accepted}>Aceitar</Button>
                    <Button variant="contained" color="error" onClick={Rejected}>Recusar</Button>
                </Box>
            </Box>
        </Modal>
    );
}
