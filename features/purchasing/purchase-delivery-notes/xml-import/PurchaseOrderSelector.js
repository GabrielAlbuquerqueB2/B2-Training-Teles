import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Radio, Button, Chip, Alert, Divider, Grid, TextField, Select } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value || 0)
}

function formatDate(dateString) {
    if (!dateString) return '-'
    try {
        return new Date(dateString).toLocaleDateString('pt-BR')
    } catch {
        return dateString
    }
}

export default function PurchaseOrderSelector({ 
    purchaseOrders = [], 
    selectedOrder, 
    onSelect, 
    onConfirm,
    onCancel,
    vendor,
    xmlData
}) {
    const hasOrders = purchaseOrders.length > 0

    return (
        <Box>
            <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    XML Importado
                </Typography>
                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary">NF-e</Typography>
                        <Typography variant="body1" fontWeight="bold">
                            {xmlData?.nNF || '-'} {xmlData?.serie ? `/ Série ${xmlData.serie}` : ''}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Fornecedor</Typography>
                        <Typography variant="body1">
                            {vendor?.CardCode} - {vendor?.CardName}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Valor Total</Typography>
                        <Typography variant="body1" fontWeight="bold">
                            {formatCurrency(xmlData?.vNF)}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Qtd Itens</Typography>
                        <Typography variant="body1">
                            {xmlData?.itens?.length || 0}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ShoppingCartIcon color="primary" />
                <Typography variant="h6">
                    Selecione o Pedido de Compras
                </Typography>
                <Chip 
                    label={`${purchaseOrders.length} pedido(s) encontrado(s)`} 
                    size="small" 
                    color={hasOrders ? 'primary' : 'default'}
                />
            </Box>

            {!hasOrders ? (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Nenhum pedido de compras aberto encontrado para este fornecedor.
                </Alert>
            ) : (
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                                <TableCell padding="checkbox" />
                                <TableCell>Nº Pedido</TableCell>
                                <TableCell>Data</TableCell>
                                <TableCell>Previsão</TableCell>
                                <TableCell>Filial</TableCell>
                                <TableCell align="right">Total</TableCell>
                                <TableCell>Observações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {purchaseOrders.map((order) => (
                                <TableRow 
                                    key={order.DocEntry}
                                    hover
                                    selected={selectedOrder?.DocEntry === order.DocEntry}
                                    onClick={() => onSelect(order)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell padding="checkbox">
                                        <Radio
                                            checked={selectedOrder?.DocEntry === order.DocEntry}
                                            onChange={() => onSelect(order)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography fontWeight="bold">{order.DocNum}</Typography>
                                    </TableCell>
                                    <TableCell>{formatDate(order.DocDate)}</TableCell>
                                    <TableCell>{formatDate(order.DocDueDate)}</TableCell>
                                    <TableCell>{order.BPLName || '-'}</TableCell>
                                    <TableCell align="right">{formatCurrency(order.DocTotal)}</TableCell>
                                    <TableCell>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                maxWidth: 200, 
                                                overflow: 'hidden', 
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                            title={order.Comments}
                                        >
                                            {order.Comments || '-'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={onCancel}>
                    Voltar
                </Button>
                <Button 
                    variant="contained" 
                    onClick={onConfirm}
                    disabled={!selectedOrder}
                >
                    Comparar com Pedido
                </Button>
            </Box>
        </Box>
    )
}
