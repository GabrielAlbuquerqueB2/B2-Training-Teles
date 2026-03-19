import { useState } from 'react'
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, CircularProgress, TextField, Grid, Autocomplete as MuiAutocomplete } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import WarningIcon from '@mui/icons-material/Warning'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import LinkIcon from '@mui/icons-material/Link'
import { MATCH_STATUS, STATUS_COLORS, MATCH_METHOD_LABELS, MATCH_METHOD } from './ItemMatcher'
import { createAlternateCatNum, getAlternateCatNumBySupplierAndCode, deleteAlternateCatNum } from './XmlImportServices'

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value || 0)
}

function formatNumber(value, decimals = 2) {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value || 0)
}

function getStatusInfo(status) {
    switch (status) {
        case MATCH_STATUS.MATCHED:
            return { icon: <CheckCircleIcon sx={{ color: '#4CAF50' }} fontSize="small" />, label: 'Encontrado', color: 'success' }
        case MATCH_STATUS.LINKED:
            return { icon: <LinkIcon sx={{ color: '#4CAF50' }} fontSize="small" />, label: 'Vinculado', color: 'info' }
        case MATCH_STATUS.NOT_IN_ORDER:
            return { icon: <ErrorIcon sx={{ color: '#F44336' }} fontSize="small" />, label: 'Não está no Pedido', color: 'error' }
        case MATCH_STATUS.NOT_IN_XML:
            return { icon: <RemoveCircleIcon sx={{ color: '#9E9E9E' }} fontSize="small" />, label: 'Não veio no XML', color: 'default' }
        default:
            return { icon: <WarningIcon sx={{ color: '#FF9800' }} fontSize="small" />, label: 'Pendente', color: 'warning' }
    }
}

function getRowBackground(item) {
    // Linha já totalmente recebida no SAP
    if (item.orderLine?.LineStatus === 'bost_Close') {
        return '#FFF3E0' // laranja claro
    }
    return STATUS_COLORS[item.status] || 'inherit'
}

export default function ItemComparisonGrid({ comparisonResults = [], stats = {}, vendor = null, orderDetails = null, onItemLinked = () => {}, setAlert = () => {} }) {
    const [linkingIndex, setLinkingIndex] = useState(null)
    const [selectedItems, setSelectedItems] = useState({})
    const [confirmDialog, setConfirmDialog] = useState({ open: false, oldItem: null, newItem: null, itemIndex: null, cProd: null })

    const usedLineNums = new Set(
        comparisonResults
            .filter(r => (r.status === MATCH_STATUS.MATCHED || r.status === MATCH_STATUS.LINKED) && r.orderLine)
            .map(r => r.orderLine.LineNum)
    )

    const orderItemOptions = (orderDetails?.DocumentLines || [])
        .filter(line => !usedLineNums.has(line.LineNum))
        .map(line => ({
            id: line.ItemCode,
            label: line.ItemDescription,
            orderLine: line
        }))

    function canLink(item, index) {
        const selectedItem = selectedItems[index]
        return item.status === MATCH_STATUS.NOT_IN_ORDER 
            && item.xmlItem?.cProd 
            && vendor?.CardCode
            && selectedItem?.id
            && linkingIndex !== index
    }

    async function handleCreateLink(item, index) {
        const selectedItem = selectedItems[index]
        if (!selectedItem?.id || !item.xmlItem?.cProd || !vendor?.CardCode) return

        setLinkingIndex(index)
        try {
            // Double check: buscar vínculo existente
            const existing = await getAlternateCatNumBySupplierAndCode(vendor.CardCode, item.xmlItem.cProd)
            if (existing && existing.ItemCode !== selectedItem.id) {
                // Precisa confirmar troca
                setConfirmDialog({
                    open: true,
                    oldItem: existing.ItemCode,
                    newItem: selectedItem.id,
                    itemIndex: index,
                    cProd: item.xmlItem.cProd
                })
                setLinkingIndex(null)
                return
            }
            // Se não existe ou já está correto, segue com POST
            await createAlternateCatNum(vendor.CardCode, item.xmlItem.cProd, selectedItem.id)
            onItemLinked(index, selectedItem, selectedItem.orderLine)
            setAlert({ visible: true, type: 'success', message: `Item "${item.xmlItem.xProd}" vinculado ao código SAP "${selectedItem.id}" com sucesso.` })
        } catch (error) {
            const msg = error.message || 'Erro ao criar vínculo.'
            setAlert({ visible: true, type: 'error', message: msg })
        } finally {
            setLinkingIndex(null)
        }
    }

    // Confirmação do usuário para troca de vínculo
    async function handleConfirmReplace() {
        setLinkingIndex(confirmDialog.itemIndex)
        try {
            // Deleta vínculo antigo
            await deleteAlternateCatNum(vendor.CardCode, confirmDialog.cProd, confirmDialog.oldItem)
            // Cria novo vínculo
            await createAlternateCatNum(vendor.CardCode, confirmDialog.cProd, confirmDialog.newItem)
            // Auditoria (console.log, pode ser adaptado para log real)
            console.log({
                action: 'UPDATE_CATALOGO',
                codigo: confirmDialog.cProd,
                fornecedor: vendor.CardCode,
                de: confirmDialog.oldItem,
                para: confirmDialog.newItem,
                usuario: (typeof window !== 'undefined' && window.sessionStorage) ? window.sessionStorage.getItem('user') : '',
                data: new Date().toISOString()
            })
            // Atualiza UI
            const selectedItem = selectedItems[confirmDialog.itemIndex]
            onItemLinked(confirmDialog.itemIndex, selectedItem, selectedItem.orderLine)
            setAlert({ visible: true, type: 'success', message: `Vínculo atualizado: código "${confirmDialog.cProd}" estava em "${confirmDialog.oldItem}" e agora está em "${confirmDialog.newItem}".` })
        } catch (error) {
            setAlert({ visible: true, type: 'error', message: error.message || 'Erro ao atualizar vínculo.' })
        } finally {
            setLinkingIndex(null)
            setConfirmDialog({ open: false, oldItem: null, newItem: null, itemIndex: null, cProd: null })
        }
    }

    function handleCancelReplace() {
        setConfirmDialog({ open: false, oldItem: null, newItem: null, itemIndex: null, cProd: null })
    }

    function handleItemSelect(index, newValue) {
        setSelectedItems(prev => ({
            ...prev,
            [index]: newValue
        }))
    }

    return (
        <>
            {/* Confirmação de troca de vínculo */}
            {confirmDialog.open && (
                <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2000, background: 'rgba(0,0,0,0.2)' }}>
                    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 20, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h6" color="warning.main" gutterBottom>
                            Atenção: Vínculo já existente
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            O código de catálogo "{confirmDialog.cProd}" já está vinculado ao item "{confirmDialog.oldItem}".<br />
                            Deseja substituir pelo item "{confirmDialog.newItem}"?
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-end' }}>
                            <Button variant="outlined" onClick={handleCancelReplace}>Cancelar</Button>
                            <Button variant="contained" color="warning" onClick={handleConfirmReplace}>Confirmar</Button>
                        </Box>
                    </Box>
                </Box>
            )}
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Cód. Item XML</TableCell>
                                    <TableCell>Descrição XML</TableCell>
                                    <TableCell>Qtd XML</TableCell>
                                    <TableCell>Preço XML</TableCell>
                                    <TableCell>Vincular</TableCell>
                                    <TableCell>Item</TableCell>
                                    <TableCell>Qtd Pedido</TableCell>
                                    <TableCell>Preço Pedido</TableCell>
                                    <TableCell>Qtd Pendente</TableCell>
                                </TableRow>
                            </TableHead>
                    <TableBody>
                        {comparisonResults.map((item, index) => {
                            const statusInfo = getStatusInfo(item.status)
                            
                            return (
                                <TableRow 
                                    key={index}
                                    sx={{ backgroundColor: getRowBackground(item) }}  // ← trocar aqui
                                >
                                    <TableCell width="6.8%" sx={{ padding: '3px' }}>
                                        <TextField
                                            type="text"
                                            value={item.xmlItem?.cProd ?? ''}
                                            InputProps={{ readOnly: true }}
                                            placeholder="-"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell width="18%" sx={{ padding: '3px' }}>
                                        <TextField
                                            type="text"
                                            value={item.xmlItem?.xProd ?? ''}
                                            InputProps={{ readOnly: true }}
                                            placeholder="-"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell width="7%" sx={{ padding: '3px' }}>
                                        <TextField
                                            type="text"
                                            value={item.xmlItem ? formatNumber(item.xmlItem.qCom) : ''}
                                            InputProps={{ readOnly: true }}
                                            placeholder="-"
                                            size="small"
                                            error={
                                                (item.status === MATCH_STATUS.MATCHED || item.status === MATCH_STATUS.LINKED)
                                                && item.orderLine
                                                && item.orderLine.LineStatus !== 'bost_Close'  // ← adicionar essa linha
                                                && item.xmlItem.qCom > (item.orderLine.OpenQty ?? 0)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell width="8%" sx={{ padding: '3px' }}>
                                        <TextField
                                            type="text"
                                            value={item.xmlItem ? formatCurrency(item.xmlItem.vUnCom) : ''}
                                            InputProps={{ readOnly: true }}
                                            placeholder="-"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell width="3%" sx={{ padding: '3px' }}>
                                        {item.status === MATCH_STATUS.NOT_IN_ORDER && item.xmlItem?.cProd ? (
                                            <span>
                                                <Button
                                                    variant='outlined'
                                                    color='primary'
                                                    onClick={() => handleCreateLink(item, index)}
                                                    disabled={!canLink(item, index)}
                                                    size='small'
                                                    sx={{ minHeight: '40px', width: '100%' }}
                                                >
                                                    {linkingIndex === index ? <CircularProgress size={20} /> : <LinkIcon />}
                                                </Button>
                                            </span>
                                        ) : null}
                                    </TableCell>
                                    <TableCell width="20%" sx={{ padding: '3px' }}>
                                        {item.status === MATCH_STATUS.NOT_IN_ORDER && item.xmlItem?.cProd ? (
                                            <MuiAutocomplete
                                                options={orderItemOptions}
                                                getOptionLabel={(option) => option.id ? `${option.id} - ${option.label}` : ''}
                                                value={selectedItems[index] || null}
                                                onChange={(event, newValue) => handleItemSelect(index, newValue)}
                                                disabled={linkingIndex === index}
                                                size="small"
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                renderInput={(params) => <TextField {...params} label="Item" />}
                                            />
                                        ) : (
                                            <TextField
                                                type="text"
                                                value={item.sapItem ? `${item.sapItem.ItemCode} - ${item.sapItem.ItemName || item.orderLine?.ItemDescription || ''}` : ''}
                                                InputProps={{ readOnly: true }}
                                                placeholder="-"
                                                size="small"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell width="8%" sx={{ padding: '3px' }}>
                                        <TextField
                                            type="text"
                                            value={item.orderLine ? formatNumber(item.orderLine.Quantity) : ''}
                                            InputProps={{ readOnly: true }}
                                            placeholder="-"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell width="8%" sx={{ padding: '3px' }}>
                                        <TextField
                                            type="text"
                                            value={item.orderLine ? formatCurrency(item.orderLine.Price ?? 0) : ''}
                                            InputProps={{ readOnly: true }}
                                            placeholder="-"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell width="8%" sx={{ padding: '3px' }}>
                                        <TextField
                                            type="text"
                                            value={item.orderLine ? formatNumber(item.orderLine.OpenQty ?? 0) : ''}
                                            InputProps={{ readOnly: true }}
                                            placeholder="-"
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        })}

                        {comparisonResults.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">
                                        Nenhum item para exibir
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}