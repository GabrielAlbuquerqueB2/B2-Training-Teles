import { useState, useRef } from 'react'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { parseNFeXml } from './PurchaseRequestXmlParser'

export default function PurchaseRequestXmlImport({
    setData,
    data,
    setIsPurchaseMade,
    setField,
    setAlert
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
            const xmlText = await readFileAsText(file)

            let parsedXml
            try {
                parsedXml = parseNFeXml(xmlText)
            } catch (parseError) {
                setAlert({ visible: true, type: 'error', message: parseError.message })
                setIsLoading(false)
                return
            }

            const lines = parsedXml.itens.map(item => ({
                Item: '',
                FreeText: '',
                Quantity: item.qCom,
                UnitPrice: item.vUnCom,
                WarehouseCode: '',
                VendorItemCode: item.cProd,
                XmlDescription: item.xProd,
            }))

            setData(prevData => ({
                ...prevData,
                U_TX_NDfe: parsedXml.nNF,
                DocumentLines: lines.length > 0 ? lines : [{ Item: '', WarehouseCode: '', FreeText: '' }]
            }))

            setIsPurchaseMade(true)

            setAlert({
                visible: true,
                type: 'success',
                message: `XML importado com sucesso!`
            })

        } catch (error) {
            setAlert({
                visible: true,
                type: 'error',
                message: `Erro ao importar XML: ${error.message || error}`
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
                    Lendo XML...
                </Typography>
            )}
        </Box>
    )
}

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'))
        reader.readAsText(file, 'UTF-8')
    })
}
