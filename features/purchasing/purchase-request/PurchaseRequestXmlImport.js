import { useState, useRef } from 'react'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { parseXmlContent } from './PurchaseRequestXmlParser'
import { findVendorByCNPJ, getVendorCatalog, getItemDetailsByCode } from './PurchaseRequestServices'
import { normalizeCatalogCode } from '../../../utils/normalizeCatalogCode'

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

    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result)
            reader.onerror = () => reject(new Error('Erro ao ler arquivo.'))
            reader.readAsText(file, 'UTF-8')
        })
    }

    function findItemInCatalog(cProd, catalog) {
        const normalizedCProd = normalizeCatalogCode(cProd)
        const match = catalog.find(entry => normalizeCatalogCode(entry.Substitute) === normalizedCProd)
        return match ? { ItemCode: match.ItemCode } : null
    }

    async function handleFileSelect(event) {
        const file = event.target.files?.[0]
        if (!file) return

        event.target.value = ''
        setIsLoading(true)

        try {
            const xmlString = await readFileAsText(file)
            const { cnpj, nomeEmitente, nNF, itens } = parseXmlContent(xmlString)

            const vendor = await findVendorByCNPJ(cnpj)

            let cardCode = null
            let cardName = null
            if (vendor) {
                cardCode = vendor.CardCode
                cardName = vendor.CardName
            }

            let catalog = []
            if (cardCode) {
                catalog = await getVendorCatalog(cardCode)
            }

            const processedItems = []
            for (const item of itens) {
                let itemCodeSAP = null
                let itemNameSAP = null
                let measureUnit = ''
                let uoMEntry = null
                let status = 'nao_encontrado'

                if (cardCode) {
                    const match = findItemInCatalog(item.cProd, catalog)
                    if (match) {
                        itemCodeSAP = match.ItemCode
                        const details = await getItemDetailsByCode(match.ItemCode)
                        itemNameSAP = details.itemName
                        measureUnit = details.measureUnit
                        uoMEntry = details.uoMEntry
                        status = 'encontrado'
                    }
                }

                processedItems.push({
                    cProd: item.cProd,
                    xProd: item.xProd,
                    qCom: item.qCom,
                    vUnCom: item.vUnCom,
                    itemCodeSAP,
                    itemNameSAP,
                    measureUnit,
                    uoMEntry,
                    status
                })
            }

            if (cardCode) {
                setVendor({ id: cardCode, label: cardName })
            }

            const unmatchedCount = processedItems.filter(i => i.status === 'nao_encontrado').length

            const lines = processedItems.map(item => ({
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
                U_TX_NDfe: nNF,
                DocumentLines: lines.length > 0 ? lines : [{ Item: '', WarehouseCode: '', FreeText: '' }]
            }))

            setIsPurchaseMade(true)

            let message = 'XML importado com sucesso!'
            if (!cardCode) {
                message += ' Fornecedor não encontrado pelo CNPJ. Selecione manualmente.'
            }
            if (unmatchedCount > 0) {
                message += ` ${unmatchedCount} de ${processedItems.length} item(ns) não encontrado(s) no catálogo do fornecedor.`
            }

            setAlert({
                visible: true,
                type: unmatchedCount > 0 || !cardCode ? 'warning' : 'success',
                message
            })

        } catch (error) {
            setAlert({
                visible: true,
                type: 'error',
                message: `Erro ao importar XML: ${error.message || 'Erro desconhecido'}`
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
