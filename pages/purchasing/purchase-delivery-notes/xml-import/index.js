import { useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Stepper, Step, StepLabel, Paper, Typography, Alert, Button } from '@mui/material'
import PageHeader from '../../../../components/ui/PageHeader'
import AlertMessage from '../../../../components/ui/AlertMessage'
import XmlUploader from '../../../../features/purchasing/purchase-delivery-notes/xml-import/XmlUploader'
import PurchaseOrderSelector from '../../../../features/purchasing/purchase-delivery-notes/xml-import/PurchaseOrderSelector'
import ItemComparisonGrid from '../../../../features/purchasing/purchase-delivery-notes/xml-import/ItemComparisonGrid'
import DivergenceSummary from '../../../../features/purchasing/purchase-delivery-notes/xml-import/DivergenceSummary'
import { parseXmlContent } from '../../../../features/purchasing/purchase-delivery-notes/xml-import/XmlParser'
import { findVendorByCNPJ, getOpenPurchaseOrdersByVendor, getPurchaseOrderByDocEntry, getVendorCatalog, createPurchaseDeliveryNote } from '../../../../features/purchasing/purchase-delivery-notes/xml-import/XmlImportServices'
import { matchXmlItemsWithOrder, prepareDeliveryNoteLines, checkCriticalDivergences, MATCH_STATUS, MATCH_METHOD } from '../../../../features/purchasing/purchase-delivery-notes/xml-import/ItemMatcher'

const STEPS = [
    'Importar XML',
    'Selecionar Pedido',
    'Comparar Itens',
    'Confirmar'
]

export default function XmlImportPage() {
    const router = useRouter()
    const [activeStep, setActiveStep] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [xmlData, setXmlData] = useState(null)
    const [vendor, setVendor] = useState(null)
    const [purchaseOrders, setPurchaseOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [orderDetails, setOrderDetails] = useState(null)
    const [catalog, setCatalog] = useState([])
    const [comparisonResults, setComparisonResults] = useState([])
    const [stats, setStats] = useState({})
    const [divergenceCheck, setDivergenceCheck] = useState({})
    const [alert, setAlert] = useState({ visible: false, type: '', message: '' })

    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result)
            reader.onerror = () => reject(new Error('Erro ao ler arquivo.'))
            reader.readAsText(file, 'UTF-8')
        })
    }

    async function handleFileSelect(file) {
        setIsLoading(true)
        setAlert({ visible: false, type: '', message: '' })

        try {
            const xmlString = await readFileAsText(file)
            const parsedXml = parseXmlContent(xmlString)
            setXmlData(parsedXml)

            const foundVendor = await findVendorByCNPJ(parsedXml.cnpj)
            
            if (!foundVendor) {
                setAlert({
                    visible: true,
                    type: 'error',
                    message: `Fornecedor com CNPJ ${parsedXml.cnpj} não encontrado no SAP.`
                })
                setIsLoading(false)
                return
            }
            setVendor(foundVendor)

            const openOrders = await getOpenPurchaseOrdersByVendor(foundVendor.CardCode)
            setPurchaseOrders(openOrders)

            const vendorCatalog = await getVendorCatalog(foundVendor.CardCode)
            setCatalog(vendorCatalog)

            setActiveStep(1)

            setAlert({
                visible: true,
                type: 'success',
                message: `XML importado! Fornecedor: ${foundVendor.CardName}. ${openOrders.length} pedido(s) aberto(s) encontrado(s).`
            })

        } catch (error) {
            setAlert({
                visible: true,
                type: 'error',
                message: `Erro ao processar XML: ${error.message}`
            })
        } finally {
            setIsLoading(false)
        }
    }

    async function handleOrderConfirm() {
        setIsLoading(true)

        try {
            let orderLines = []

            if (selectedOrder) {
                const fullOrder = await getPurchaseOrderByDocEntry(selectedOrder.DocEntry)
                setOrderDetails(fullOrder)
                orderLines = fullOrder.DocumentLines || []
            }

            const matchResult = await matchXmlItemsWithOrder(
                xmlData.itens, 
                orderLines, 
                catalog
            )

            setComparisonResults(matchResult.comparisonResults)
            setStats(matchResult.stats)

            const check = checkCriticalDivergences(matchResult.stats)
            setDivergenceCheck(check)

            setActiveStep(2)

        } catch (error) {
            setAlert({
                visible: true,
                type: 'error',
                message: `Erro ao comparar itens: ${error.message}`
            })
        } finally {
            setIsLoading(false)
        }
    }

    function handleGoToConfirm() {
        setActiveStep(3)
    }

    async function handleCreateDeliveryNote() {
        setIsLoading(true)

        try {
            const documentLines = prepareDeliveryNoteLines(
                comparisonResults, 
                selectedOrder?.DocEntry
            )

            if (documentLines.length === 0) {
                throw new Error('Nenhum item válido para criar o recebimento.')
            }

            const deliveryNote = {
                CardCode: vendor.CardCode,
                DocDate: new Date().toISOString().split('T')[0],
                Comments: `Importado via XML - NF ${xmlData.nNF}`,
                BPL_IDAssignedToInvoice: selectedOrder?.BPL_IDAssignedToInvoice,
                DocumentLines: documentLines
            }

            const result = await createPurchaseDeliveryNote(deliveryNote)

            setAlert({
                visible: true,
                type: 'success',
                message: `Recebimento de Mercadoria ${result.DocNum} criado com sucesso!`
            })

            setTimeout(() => {
                router.push('/purchasing/purchase-delivery-notes/list')
            }, 2000)

        } catch (error) {
            setAlert({
                visible: true,
                type: 'error',
                message: `Erro ao criar recebimento: ${error.message}`
            })
        } finally {
            setIsLoading(false)
        }
    }

    function handleBack() {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1)
        }
    }

    function handleItemLinked(index, selectedItem) {
        setComparisonResults(prev => {
            const updated = [...prev]
            updated[index] = {
                ...updated[index],
                status: MATCH_STATUS.LINKED,
                matchMethod: MATCH_METHOD.BY_MANUAL_LINK,
                sapItem: {
                    ItemCode: selectedItem.id,
                    ItemName: selectedItem.label || selectedItem.id
                }
            }
            return updated
        })

        setStats(prev => ({
            ...prev,
            matched: (prev.matched || 0) + 1,
            notInOrder: Math.max((prev.notInOrder || 0) - 1, 0)
        }))
    }

    function handleReset() {
        setActiveStep(0)
        setXmlData(null)
        setVendor(null)
        setPurchaseOrders([])
        setSelectedOrder(null)
        setOrderDetails(null)
        setCatalog([])
        setComparisonResults([])
        setStats({})
        setDivergenceCheck({})
        setAlert({ visible: false, type: '', message: '' })
    }

    function renderStepContent() {
        switch (activeStep) {
            case 0:
                return (
                    <XmlUploader 
                        onFileSelect={handleFileSelect}
                        isLoading={isLoading}
                    />
                )

            case 1:
                return (
                    <PurchaseOrderSelector
                        purchaseOrders={purchaseOrders}
                        selectedOrder={selectedOrder}
                        onSelect={setSelectedOrder}
                        onConfirm={handleOrderConfirm}
                        onCancel={handleReset}
                        vendor={vendor}
                        xmlData={xmlData}
                    />
                )

            case 2:
                return (
                    <Box>
                        <ItemComparisonGrid 
                            comparisonResults={comparisonResults}
                            stats={stats}
                            vendor={vendor}
                            onItemLinked={handleItemLinked}
                            setAlert={setAlert}
                        />
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                            <Button variant='outlined' onClick={handleBack}>
                                Voltar
                            </Button>
                            <Button variant='contained' onClick={handleGoToConfirm}>
                                Próximo
                            </Button>
                        </Box>
                    </Box>
                )

            case 3:
                return (
                    <DivergenceSummary
                        stats={stats}
                        divergenceCheck={divergenceCheck}
                        onConfirm={handleCreateDeliveryNote}
                        onBack={handleBack}
                        isLoading={isLoading}
                        xmlData={xmlData}
                        selectedOrder={selectedOrder}
                    />
                )

            default:
                return null
        }
    }

    return (
        <>
            <PageHeader title="Importar XML de NF-e" />

            <Paper sx={{ p: 2, mb: 3 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {STEPS.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Paper>

            <Paper sx={{ p: 3 }}>
                {renderStepContent()}
            </Paper>

            <Box hidden={!alert.visible} sx={{ mt: 2 }}>
                <AlertMessage
                    alertOpen={alert.visible}
                    setAlertOpen={setAlert}
                    type={alert.type}
                    message={alert.message}
                />
            </Box>
        </>
    )
}
