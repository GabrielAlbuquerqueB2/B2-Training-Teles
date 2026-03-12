import { useState } from 'react'
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, CircularProgress, TextField, Grid } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import WarningIcon from '@mui/icons-material/Warning'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import LinkIcon from '@mui/icons-material/Link'
import ItemAutocomplete from '../../../../components/ui/Autocomplete/ItemAutocomplete'
import CurrencyTextField from '../../../../components/ui/CurrencyTextField/CurrencyTextField'
import { MATCH_STATUS, STATUS_COLORS, MATCH_METHOD_LABELS, MATCH_METHOD } from './ItemMatcher'
import { createAlternateCatNum } from './XmlImportServices'

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

export default function ItemComparisonGrid({ comparisonResults = [], stats = {}, vendor = null, onItemLinked = () => {}, onReceivedQuantityChange = () => {}, setAlert = () => {} }) {
    
    const [linkingIndex, setLinkingIndex] = useState(null)
    const [selectedItems, setSelectedItems] = useState({})

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
            await createAlternateCatNum(vendor.CardCode, item.xmlItem.cProd, selectedItem.id)
            onItemLinked(index, selectedItem)
            setAlert({ visible: true, type: 'success', message: `Item "${item.xmlItem.xProd}" vinculado ao código SAP "${selectedItem.id}" com sucesso.` })
        } catch (error) {
            const msg = error.message || 'Erro ao criar vínculo.'
            setAlert({ visible: true, type: 'error', message: msg })
        } finally {
            setLinkingIndex(null)
        }
    }

    function handleItemSelect(index, newValue) {
        setSelectedItems(prev => ({
            ...prev,
            [index]: newValue
        }))
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Cód. Fornec.</TableCell>
                                <TableCell>Descrição XML</TableCell>
                                <TableCell>Qtd XML</TableCell>
                                <TableCell>Preço XML</TableCell>
                                <TableCell>Vincular</TableCell>
                                <TableCell>Item</TableCell>
                                <TableCell>Qtd Pedido</TableCell>
                                <TableCell>Preço Pedido</TableCell>
                                <TableCell>Qtd Parcial</TableCell>
                            </TableRow>
                        </TableHead>
                <TableBody>
                    {comparisonResults.map((item, index) => {
                        const statusInfo = getStatusInfo(item.status)
                        
                        return (
                            <TableRow 
                                key={index}
                                sx={{ backgroundColor: STATUS_COLORS[item.status] || 'inherit' }}
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
                                        <div>
                                            <ItemAutocomplete
                                                name={`Item`}
                                                value={selectedItems[index] || null}
                                                setValue={(newValue) => handleItemSelect(index, newValue)}
                                                disabled={linkingIndex === index}
                                            />
                                        </div>
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
                                        value={item.orderLine ? formatNumber(item.orderLine.RemainingOpenQuantity) : ''}
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
                                    {item.status === MATCH_STATUS.MATCHED ? (
                                        <CurrencyTextField
                                            value={item.receivedQuantity ?? 0}
                                            onChange={(evt, newValue) => {
                                                onReceivedQuantityChange(index, newValue)
                                            }}
                                            error={item.orderLine && item.receivedQuantity > item.orderLine.RemainingOpenQuantity}
                                        />
                                    ) : (
                                        <TextField
                                            type="text"
                                            value=""
                                            InputProps={{ readOnly: true }}
                                            placeholder="-"
                                            size="small"
                                        />
                                    )}
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
    )
}