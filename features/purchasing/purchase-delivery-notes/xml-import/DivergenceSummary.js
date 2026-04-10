import { Box, Typography, Paper, Button, Alert, AlertTitle, Divider, Grid, Chip, TextField } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import Select from '../../../../components/ui/Select'
import { getIncotermsList } from '../PurchaseDeliveryNotesServices'

export default function DivergenceSummary({ 
    stats = {}, 
    divergenceCheck = {},
    onConfirm, 
    onBack,
    isLoading = false,
    xmlData,
    selectedOrder,
    docDate = '',
    onDocDateChange,
    payToCode = '',
    onPayToCodeChange,
    addresses = []
}) {
    const incotermsList = getIncotermsList()
    const incotermLabel = incotermsList.find(i => String(i.value) === String(xmlData?.modFrete))?.description || xmlData?.modFrete || '-'
    const { 
        totalXmlItems = 0, 
        totalOrderItems = 0, 
        matchedCount = 0, 
        notInOrderCount = 0 
    } = stats

    const { hasErrors, hasWarnings, errors = [], warnings = [], canProceed } = divergenceCheck

    const getOverallStatus = () => {
        if (hasErrors) return 'error'
        if (hasWarnings) return 'warning'
        return 'success'
    }

    const overallStatus = getOverallStatus()

    return (
        <Box>
            <Paper 
                sx={{ 
                    p: 3, 
                    mb: 3, 
                    backgroundColor: overallStatus === 'success' ? '#E8F5E9' : 
                                    overallStatus === 'warning' ? '#FFF8E1' : '#FFEBEE'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    {overallStatus === 'success' && <CheckCircleOutlineIcon sx={{ fontSize: 40, color: '#4CAF50' }} />}
                    {overallStatus === 'warning' && <WarningAmberIcon sx={{ fontSize: 40, color: '#FF9800' }} />}
                    {overallStatus === 'error' && <ErrorOutlineIcon sx={{ fontSize: 40, color: '#F44336' }} />}
                    <Box>
                        <Typography variant="h6">
                            {overallStatus === 'success' && 'Comparação concluída com sucesso!'}
                            {overallStatus === 'warning' && 'Comparação concluída com divergências'}
                            {overallStatus === 'error' && 'Problemas encontrados na comparação'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {matchedCount} de {totalXmlItems} item(ns) do XML correspondem ao Pedido
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {errors.length > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    <AlertTitle>Erros que impedem a criação</AlertTitle>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </Alert>
            )}

            {warnings.length > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    <AlertTitle>Atenção</AlertTitle>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                        ))}
                    </ul>
                </Alert>
            )}

            {canProceed && matchedCount > 0 && (
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <ReceiptLongIcon color="primary" />
                        <Typography variant="h6">
                            Recebimento de Mercadoria a ser criado
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                            <TextField label="NF-e" size="small" fullWidth disabled value={xmlData?.nNF || '-'} InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <TextField label="Pedido Base" size="small" fullWidth disabled value={selectedOrder?.DocNum || 'Nenhum'} InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <TextField label="Itens a Receber" size="small" fullWidth disabled value={matchedCount} InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <TextField 
                                label="Status" 
                                size="small" 
                                fullWidth 
                                disabled 
                                value={canProceed ? 'Pronto para criar' : 'Bloqueado'} 
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    sx: { 
                                        color: canProceed ? 'success.main' : 'error.main',
                                        fontWeight: 'bold',
                                        '& .MuiInputBase-input.Mui-disabled': {
                                            WebkitTextFillColor: canProceed ? '#2e7d32' : '#d32f2f',
                                        }
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ mt: 0 }}>
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Data de Lançamento"
                                type="date"
                                size="small"
                                fullWidth
                                value={docDate}
                                onChange={(e) => onDocDateChange?.(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField label="Data do Documento (XML)" size="small" fullWidth disabled value={xmlData?.dhEmi ? xmlData.dhEmi.split('T')[0].split('-').reverse().join('/') : '-'} InputLabelProps={{ shrink: true }} />
                        </Grid>
                        {xmlData?.chaveAcesso && (
                            <Grid item xs={12} md={6}>
                                <TextField label="Chave de Acesso" size="small" fullWidth disabled value={xmlData.chaveAcesso} InputLabelProps={{ shrink: true }} />
                            </Grid>
                        )}
                    </Grid>
                    <Grid container spacing={2} sx={{ mt: 0 }}>
                        <Grid item xs={12} md={3}>
                            <TextField label="Incoterms (Frete)" size="small" fullWidth disabled value={incotermLabel} InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField label="Placa" size="small" fullWidth disabled value={xmlData?.placa || '-'} InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField label="UF Veículo" size="small" fullWidth disabled value={xmlData?.veicUF || '-'} InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Select
                                name="PayToCode"
                                label="Endereço de Cobrança"
                                list={addresses}
                                value={payToCode}
                                setState={(name, value) => onPayToCodeChange?.(value)}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {notInOrderCount > 0 && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    <AlertTitle>Itens não incluídos no recebimento</AlertTitle>
                    <Typography variant="body2">
                        Os {notInOrderCount} item(ns) do XML que não foram encontrados no Pedido de Compras 
                        <strong> não serão incluídos</strong> no Recebimento de Mercadoria.
                    </Typography>
                </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 4 }}>
                <Button 
                    variant="outlined" 
                    startIcon={<ArrowBackIcon />}
                    onClick={onBack}
                    disabled={isLoading}
                >
                    Voltar
                </Button>
                <Button 
                    variant="contained" 
                    color={canProceed ? 'primary' : 'error'}
                    endIcon={<ArrowForwardIcon />}
                    onClick={onConfirm}
                    disabled={!canProceed || isLoading || matchedCount === 0}
                >
                    {isLoading ? 'Criando...' : 'Criar Recebimento de Mercadoria'}
                </Button>
            </Box>
        </Box>
    )
}
