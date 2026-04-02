import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, Stepper, Step, StepLabel, Paper, Button } from '@mui/material'
import PageHeader from '../../../../components/ui/PageHeader'
import AlertMessage from '../../../../components/ui/AlertMessage'
import XmlUploader from '../../../../features/purchasing/purchase-delivery-notes/xml-import/XmlUploader'
import PurchaseOrderSelector from '../../../../features/purchasing/purchase-delivery-notes/xml-import/PurchaseOrderSelector'
import ItemComparisonGrid from '../../../../features/purchasing/purchase-delivery-notes/xml-import/ItemComparisonGrid'
import DivergenceSummary from '../../../../features/purchasing/purchase-delivery-notes/xml-import/DivergenceSummary'
import { parseXmlContent } from '../../../../features/purchasing/purchase-delivery-notes/xml-import/XmlParser'
import { findVendorByCNPJ, getOpenPurchaseOrdersByVendor, getPurchaseOrderByDocEntry, getVendorCatalog, createPurchaseDeliveryNote, getBranchByIE, getVendorAddresses } from '../../../../features/purchasing/purchase-delivery-notes/xml-import/XmlImportServices'
import { matchXmlItemsWithOrder, prepareDeliveryNoteLines, checkCriticalDivergences, MATCH_STATUS, MATCH_METHOD } from '../../../../features/purchasing/purchase-delivery-notes/xml-import/ItemMatcher'

const STEPS = [
    'Importar XML',
    'Selecionar Pedido',
    'Comparar Itens',
    'Confirmar'
]

function saveSessionState(data) {
    try { sessionStorage.setItem('xmlImportState', JSON.stringify(data)) } catch {}
}

function loadSessionState() {
    try {
        if (typeof window === 'undefined') return null
        const saved = sessionStorage.getItem('xmlImportState')
        return saved ? JSON.parse(saved) : null
    } catch { return null }
}

function clearSessionState() {
    try { sessionStorage.removeItem('xmlImportState') } catch {}
}

export default function XmlImportPage() {
    const router = useRouter()
    const saved = loadSessionState()
    const [activeStep, setActiveStep] = useState(saved?.activeStep ?? 0)
    const [isLoading, setIsLoading] = useState(false)
    const [xmlData, setXmlData] = useState(saved?.xmlData ?? null)
    const [vendor, setVendor] = useState(saved?.vendor ?? null)
    const [purchaseOrders, setPurchaseOrders] = useState(saved?.purchaseOrders ?? [])
    const [selectedOrder, setSelectedOrder] = useState(saved?.selectedOrder ?? null)
    const [orderDetails, setOrderDetails] = useState(saved?.orderDetails ?? null)
    const [catalog, setCatalog] = useState(saved?.catalog ?? [])
    const [comparisonResults, setComparisonResults] = useState(saved?.comparisonResults ?? [])
    const [stats, setStats] = useState(saved?.stats ?? {})
    const [divergenceCheck, setDivergenceCheck] = useState(saved?.divergenceCheck ?? {})
    const [docDate, setDocDate] = useState(saved?.docDate ?? '')
    const [payToCode, setPayToCode] = useState(saved?.payToCode ?? '')
    const [addresses, setAddresses] = useState(saved?.addresses ?? [])
    const [alert, setAlert] = useState({ visible: false, type: '', message: '' })

    useEffect(() => {
        if (activeStep === 0 && !xmlData) {
            clearSessionState()
            return
        }
        saveSessionState({
            activeStep,
            xmlData,
            vendor,
            purchaseOrders,
            selectedOrder,
            orderDetails,
            catalog,
            comparisonResults,
            stats,
            divergenceCheck,
            docDate,
            payToCode,
            addresses
        })
    }, [activeStep, xmlData, vendor, purchaseOrders, selectedOrder, orderDetails, catalog, comparisonResults, stats, divergenceCheck, docDate, payToCode, addresses])

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
                    message: `Fornecedor com CNPJ ${parsedXml.cnpj} não encontrado no SAP (ativo).`
                })
                setIsLoading(false)
                return
            }
            setVendor(foundVendor)

            let branchId = null
            if (parsedXml.destIE) {
                const branch = await getBranchByIE(parsedXml.destIE)
                if (branch) {
                    branchId = branch.BPLID
                }
            }

            const openOrders = await getOpenPurchaseOrdersByVendor(foundVendor.CardCode, branchId)
            setPurchaseOrders(openOrders)

            const [vendorCatalog, vendorAddresses] = await Promise.all([
                getVendorCatalog(foundVendor.CardCode),
                getVendorAddresses(foundVendor.CardCode)
            ])
            setCatalog(vendorCatalog)
            setAddresses(vendorAddresses)
            if (vendorAddresses.length === 1) {
                setPayToCode(vendorAddresses[0].value)
            }

            const xmlDocDate = parsedXml.dhEmi ? parsedXml.dhEmi.split('T')[0] : ''
            setDocDate(xmlDocDate)

            setActiveStep(1)

            let successMsg = `XML importado! Fornecedor: ${foundVendor.CardName}.`
            if (branchId) {
                successMsg += ` Filial identificada pela IE do destinatário.`
            }
            successMsg += ` ${openOrders.length} pedido(s) aberto(s) encontrado(s).`

            setAlert({
                visible: true,
                type: 'success',
                message: successMsg
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
        const overflowItem = comparisonResults.find(item =>
            (item.status === MATCH_STATUS.MATCHED || item.status === MATCH_STATUS.LINKED)
            && item.orderLine
            && item.xmlItem.qCom > item.orderLine.OpenQty
        )

        if (overflowItem) {
            const jaRecebido = overflowItem.orderLine.LineStatus === 'bost_Close'
            setAlert({
                visible: true,
                type: 'error',
                message: jaRecebido
                    ? `Os itens destacados em laranja já tiveram seu recebimento realizado no pedido e não possuem saldo em aberto.`
                    : `O item "${overflowItem.xmlItem.xProd}" tem quantidade do XML (${overflowItem.xmlItem.qCom}) maior que a quantidade em aberto do pedido (${overflowItem.orderLine.OpenQty}).`
            })
            return
        }

        const recalculated = {
            totalXmlItems: comparisonResults.filter(r => r.xmlItem).length,
            matchedCount: comparisonResults.filter(r => r.status === MATCH_STATUS.MATCHED || r.status === MATCH_STATUS.LINKED).length,
            notInOrderCount: comparisonResults.filter(r => r.status === MATCH_STATUS.NOT_IN_ORDER).length,
            notInXmlCount: comparisonResults.filter(r => r.status === MATCH_STATUS.NOT_IN_XML).length
        }
        setStats(recalculated)

        const check = checkCriticalDivergences(recalculated)
        setDivergenceCheck(check)

        if (!check.canProceed) {
            setAlert({
                visible: true,
                type: 'error',
                message: check.errors?.[0] || 'Existem divergências críticas que impedem o recebimento.'
            })
            return
        }

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

            const selectedAddress = addresses.find(a => a.value === payToCode)

            const deliveryNote = {
                CardCode: vendor.CardCode,
                DocDate: xmlData.dhEmi ? xmlData.dhEmi.split('T')[0] : new Date().toISOString().split('T')[0],
                TaxDate: docDate || new Date().toISOString().split('T')[0],
                Comments: `Importado via XML - NF ${xmlData.nNF}`,
                U_ChaveAcesso: xmlData.chaveAcesso || '',
                U_nfe_ChaveAcesso: xmlData.chaveAcesso || '',
                SequenceCode: -2,
                SequenceSerial: xmlData.nNF || '',
                SeriesString: xmlData.serie || '',
                PayToCode: payToCode || undefined,
                BPL_IDAssignedToInvoice: selectedOrder?.BPL_IDAssignedToInvoice,
                TaxExtension: {
                    Incoterms: xmlData.modFrete || undefined,
                    Vehicle: xmlData.placa || undefined,
                    VehicleState: xmlData.veicUF || undefined,
                    ...(selectedAddress ? {
                        State: selectedAddress.State,
                        County: selectedAddress.County,
                        TaxId0: selectedAddress.U_FederalTaxId || selectedAddress.U_AGRT_CnpjFornecedor,
                        TaxId1: selectedAddress.U_TX_IE
                    } : {})
                },
                DocumentLines: documentLines
            }

            const result = await createPurchaseDeliveryNote(deliveryNote)

            clearSessionState()

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

    function handleItemLinked(index, selectedItem, orderLine) {
        setComparisonResults(prev => {
            const updated = [...prev]
            updated[index] = {
                ...updated[index],
                status: MATCH_STATUS.LINKED,
                matchMethod: MATCH_METHOD.BY_MANUAL_LINK,
                sapItem: {
                    ItemCode: selectedItem.id,
                    ItemName: selectedItem.label || selectedItem.id
                },
                orderLine: orderLine ? {
                    LineNum: orderLine.LineNum,
                    ItemCode: orderLine.ItemCode,
                    ItemDescription: orderLine.ItemDescription,
                    Quantity: orderLine.Quantity,
                    OpenQty: orderLine.RemainingOpenQuantity ?? orderLine.Quantity,
                    LineStatus: orderLine.LineStatus,
                    Price: orderLine.Price,
                    WarehouseCode: orderLine.WarehouseCode,
                    UoMEntry: orderLine.UoMEntry
                } : null
            }
            return updated
        })

        setStats(prev => {
            const nextStats = {
                ...prev,
                matchedCount: (prev.matchedCount || 0) + 1,
                notInOrderCount: Math.max((prev.notInOrderCount || 0) - 1, 0)
            }
            setDivergenceCheck(checkCriticalDivergences(nextStats))
            return nextStats
        })
    }

    function handleReset() {
        clearSessionState()
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
        setDocDate('')
        setPayToCode('')
        setAddresses([])
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
                            orderDetails={orderDetails}
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
                        docDate={docDate}
                        onDocDateChange={setDocDate}
                        payToCode={payToCode}
                        onPayToCodeChange={setPayToCode}
                        addresses={addresses}
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