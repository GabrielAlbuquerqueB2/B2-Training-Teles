import { useState, useRef } from 'react'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import axios from 'axios'

export default function PurchaseRequestXmlImport({
    setData,
    data,
    setIsPurchaseMade,
    setField,
    setAlert,
    setVendor
}) {
    const [isLoading, setIsLoading] = useState(false)
    const fileInputRef = useRef(null)

    function handleButtonClick() {
        fileInputRef.current?.click()
    }

    async function handleFileSelect(event) {
        const file = event.target.files?.[0]
        if (!file) return

        event.target.value = ''
        setIsLoading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await axios.post('/api/purchase-request/import-xml', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            const result = response.data

            if (result.CardCode) {
                setVendor({ id: result.CardCode, label: result.CardName })
            }

            const lines = result.items.map(item => ({
                Item: item.itemCodeSAP ? { id: item.itemCodeSAP, label: item.itemNameSAP || item.itemCodeSAP } : '',
                FreeText: '',
                Quantity: item.qCom,
                UnitPrice: item.vUnCom,
                WarehouseCode: '',
                UoMEntry: item.uoMEntry || null,
                MeasureUnit: item.measureUnit || '',
                VendorItemCode: item.cProd,
                XmlDescription: item.xProd,
                xmlMatchStatus: item.status
            }))

            setData(prevData => ({
                ...prevData,
                U_TX_NDfe: result.nNF,
                DocumentLines: lines.length > 0 ? lines : [{ Item: '', WarehouseCode: '', FreeText: '' }]
            }))

            setIsPurchaseMade(true)

            let message = 'XML importado com sucesso!'
            if (!result.CardCode) {
                message += ' Fornecedor não encontrado pelo CNPJ. Selecione manualmente.'
            }
            if (result.unmatchedCount > 0) {
                message += ` ${result.unmatchedCount} de ${result.totalItems} item(ns) não encontrado(s) no catálogo do fornecedor.`
            }

            setAlert({
                visible: true,
                type: result.unmatchedCount > 0 || !result.CardCode ? 'warning' : 'success',
                message
            })

        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message || 'Erro desconhecido'
            setAlert({
                visible: true,
                type: 'error',
                message: `Erro ao importar XML: ${errorMsg}`
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <input
                type="file"
                accept=".xml"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
            <Button
                variant="outlined"
                startIcon={isLoading ? <CircularProgress size={20} /> : <UploadFileIcon />}
                onClick={handleButtonClick}
                disabled={isLoading}
            >
                {isLoading ? 'IMPORTANDO...' : 'IMPORTAR XML'}
            </Button>
            {isLoading && (
                <Typography variant="body2" color="text.secondary">
                    Processando XML...
                </Typography>
            )}
        </Box>
    )
}
