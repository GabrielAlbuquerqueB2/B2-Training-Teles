import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Chip, Tooltip } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import WarningIcon from '@mui/icons-material/Warning'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { MATCH_STATUS, STATUS_COLORS } from './ItemMatcher'

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
            return {
                icon: <CheckCircleIcon sx={{ color: '#4CAF50' }} fontSize="small" />,
                label: 'Encontrado',
                color: 'success'
            }
        case MATCH_STATUS.NOT_IN_ORDER:
            return {
                icon: <ErrorIcon sx={{ color: '#F44336' }} fontSize="small" />,
                label: 'Não está no Pedido',
                color: 'error'
            }
        case MATCH_STATUS.NOT_IN_XML:
            return {
                icon: <RemoveCircleIcon sx={{ color: '#9E9E9E' }} fontSize="small" />,
                label: 'Não veio no XML',
                color: 'default'
            }
        default:
            return {
                icon: <WarningIcon sx={{ color: '#FF9800' }} fontSize="small" />,
                label: 'Pendente',
                color: 'warning'
            }
    }
}

export default function ItemComparisonGrid({ comparisonResults = [], stats = {} }) {
    
    return (
        <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 16, height: 16, backgroundColor: STATUS_COLORS[MATCH_STATUS.MATCHED], borderRadius: 1 }} />
                    <Typography variant="caption">Item encontrado no Pedido</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 16, height: 16, backgroundColor: STATUS_COLORS[MATCH_STATUS.NOT_IN_ORDER], borderRadius: 1 }} />
                    <Typography variant="caption">Item do XML não está no Pedido</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 16, height: 16, backgroundColor: STATUS_COLORS[MATCH_STATUS.NOT_IN_XML], borderRadius: 1 }} />
                    <Typography variant="caption">Item do Pedido não veio no XML</Typography>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#1976d2' }}>
                            <TableCell colSpan={4} sx={{ color: 'white', fontWeight: 'bold' }}>
                                Dados do XML (NF-e)
                            </TableCell>
                            <TableCell colSpan={3} sx={{ color: 'white', fontWeight: 'bold', borderLeft: '2px solid white' }}>
                                Dados do Pedido de Compras
                            </TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold', borderLeft: '2px solid white' }}>
                                Status
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                            <TableCell>Cód. Fornec.</TableCell>
                            <TableCell>Descrição XML</TableCell>
                            <TableCell align="right">Qtd XML</TableCell>
                            <TableCell align="right">Preço XML</TableCell>
                            <TableCell sx={{ borderLeft: '2px solid #1976d2' }}>Item SAP</TableCell>
                            <TableCell align="right">Qtd Pedido</TableCell>
                            <TableCell align="right">Preço Pedido</TableCell>
                            <TableCell sx={{ borderLeft: '2px solid #1976d2' }} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {comparisonResults.map((item, index) => {
                            const statusInfo = getStatusInfo(item.status)
                            
                            return (
                                <TableRow 
                                    key={index}
                                    sx={{ 
                                        backgroundColor: STATUS_COLORS[item.status] || 'inherit',
                                        '&:hover': { opacity: 0.9 }
                                    }}
                                >
                                    <TableCell>
                                        <Typography variant="body2" fontFamily="monospace">
                                            {item.xmlItem?.cProd || '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title={item.xmlItem?.xProd || '-'} arrow>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    maxWidth: 250, 
                                                    overflow: 'hidden', 
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {item.xmlItem?.xProd || '-'}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" fontWeight="bold">
                                            {item.xmlItem ? formatNumber(item.xmlItem.qCom) : '-'}
                                        </Typography>
                                        {item.xmlItem?.uCom && (
                                            <Typography variant="caption" color="text.secondary">
                                                {item.xmlItem.uCom}
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {item.xmlItem ? formatCurrency(item.xmlItem.vUnCom) : '-'}
                                    </TableCell>

                                    <TableCell sx={{ borderLeft: '2px solid #1976d2' }}>
                                        {item.sapItem ? (
                                            <Box>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {item.sapItem.ItemCode}
                                                </Typography>
                                                <Tooltip title={item.sapItem.ItemName || item.orderLine?.ItemDescription || ''} arrow>
                                                    <Typography 
                                                        variant="caption" 
                                                        color="text.secondary"
                                                        sx={{ 
                                                            display: 'block',
                                                            maxWidth: 200, 
                                                            overflow: 'hidden', 
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {item.sapItem.ItemName || item.orderLine?.ItemDescription}
                                                    </Typography>
                                                </Tooltip>
                                            </Box>
                                        ) : '-'}
                                    </TableCell>
                                    <TableCell align="right">
                                        {item.orderLine ? (
                                            <Box>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {formatNumber(item.orderLine.RemainingOpenQuantity || item.orderLine.Quantity)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    (Total: {formatNumber(item.orderLine.Quantity)})
                                                </Typography>
                                            </Box>
                                        ) : '-'}
                                    </TableCell>
                                    <TableCell align="right">
                                        {item.orderLine ? formatCurrency(item.orderLine.Price) : '-'}
                                    </TableCell>

                                    <TableCell sx={{ borderLeft: '2px solid #1976d2' }}>
                                        <Chip
                                            icon={statusInfo.icon}
                                            label={statusInfo.label}
                                            size="small"
                                            color={statusInfo.color}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        })}

                        {comparisonResults.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">
                                        Nenhum item para exibir
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}
