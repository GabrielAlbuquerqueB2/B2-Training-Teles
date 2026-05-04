import { normalizeCatalogCode } from '../../../../utils/normalizeCatalogCode'
import { getItemDetailsByCode, resolveUoMConversionFactor } from './XmlImportServices'

export const MATCH_STATUS = {
    MATCHED: 'matched',
    NOT_IN_ORDER: 'not_in_order',
    NOT_IN_XML: 'not_in_xml',
    PENDING: 'pending',
    LINKED: 'linked'
}

export const MATCH_METHOD = {
    BY_CATALOG: 'catalogo',
    BY_MANUAL_LINK: 'vinculo_manual',
    NONE: null
}

export const STATUS_COLORS = {
    [MATCH_STATUS.MATCHED]: '#E8F5E9',
    [MATCH_STATUS.NOT_IN_ORDER]: '#FFEBEE',
    [MATCH_STATUS.NOT_IN_XML]: '#ECEFF1',
    [MATCH_STATUS.PENDING]: '#FFF8E1',
    [MATCH_STATUS.LINKED]: '#E3F2FD'
}

export const MATCH_METHOD_LABELS = {
    [MATCH_METHOD.BY_CATALOG]: 'Catálogo',
    [MATCH_METHOD.BY_MANUAL_LINK]: 'Vínculo Manual'
}

export function findItemInCatalog(cProd, catalog) {
    const normalizedCProd = normalizeCatalogCode(cProd)
    const match = catalog.find(entry => 
        normalizeCatalogCode(entry.Substitute) === normalizedCProd
    )
    return match ? { ItemCode: match.ItemCode } : null
}

export async function matchXmlItemsWithOrder(xmlItems, orderLines, catalog) {
    const comparisonResults = []
    const matchedOrderLineNums = new Set()

    for (const xmlItem of xmlItems) {
        let status = MATCH_STATUS.NOT_IN_ORDER
        let matchedOrderLine = null
        let itemDetails = null
        let matchMethod = MATCH_METHOD.NONE

        const catalogMatch = findItemInCatalog(xmlItem.cProd, catalog)
        
        if (catalogMatch) {
            itemDetails = await getItemDetailsByCode(catalogMatch.ItemCode)
            
            const candidateLines = orderLines.filter(line => 
                line.ItemCode === catalogMatch.ItemCode && 
                !matchedOrderLineNums.has(line.LineNum)
            )

            if (candidateLines.length > 0) {
                matchedOrderLine = candidateLines.reduce((best, line) => {
                    const openQty = line.RemainingOpenQuantity ?? 0
                    const bestOpenQty = best.RemainingOpenQuantity ?? 0
                    const diff = Math.abs(openQty - xmlItem.qCom)
                    const bestDiff = Math.abs(bestOpenQty - xmlItem.qCom)
                    return diff < bestDiff ? line : best
                }, candidateLines[0])
                status = MATCH_STATUS.MATCHED
                matchMethod = MATCH_METHOD.BY_CATALOG
                matchedOrderLineNums.add(matchedOrderLine.LineNum)
            }
        }

        comparisonResults.push({
            xmlItem: {
                nItem: xmlItem.nItem,
                cProd: xmlItem.cProd,
                cEAN: xmlItem.cEAN,
                xProd: xmlItem.xProd,
                NCM: xmlItem.NCM,
                qCom: xmlItem.qCom,
                vUnCom: xmlItem.vUnCom,
                vProd: xmlItem.vProd,
                vDesc: xmlItem.vDesc || 0,
                vIPI: xmlItem.vIPI || 0,
                uCom: xmlItem.uCom,
                uTrib: xmlItem.uTrib,
                qTrib: xmlItem.qTrib,
                nItemPed: xmlItem.nItemPed
            },
            sapItem: itemDetails ? {
                ItemCode: itemDetails.itemCode,
                ItemName: itemDetails.itemName,
                MeasureUnit: itemDetails.measureUnit,
                UoMEntry: itemDetails.uoMEntry,
                UoMGroupEntry: itemDetails.uomGroupEntry
            } : null,
            orderLine: matchedOrderLine ? {
                LineNum: matchedOrderLine.LineNum,
                ItemCode: matchedOrderLine.ItemCode,
                ItemDescription: matchedOrderLine.ItemDescription,
                Quantity: matchedOrderLine.Quantity,
                OpenQty: matchedOrderLine.RemainingOpenQuantity ?? 0,
                LineStatus: matchedOrderLine.LineStatus,
                Price: matchedOrderLine.Price,
                WarehouseCode: matchedOrderLine.WarehouseCode,
                MeasureUnit: matchedOrderLine.MeasureUnit || '',
                UoMEntry: matchedOrderLine.UoMEntry,
                FreeText: matchedOrderLine.FreeText || ''
            } : null,
            status,
            matchMethod,
            matched: status === MATCH_STATUS.MATCHED
        })
    }

    const stats = {
        totalXmlItems: xmlItems.length,
        totalOrderItems: orderLines.length,
        matchedCount: comparisonResults.filter(r => r.status === MATCH_STATUS.MATCHED).length,
        notInOrderCount: comparisonResults.filter(r => r.status === MATCH_STATUS.NOT_IN_ORDER).length
    }

    return {
        comparisonResults,
        xmlItemsResults: comparisonResults,
        missingInXml: [],
        stats
    }
}

export async function prepareDeliveryNoteLines(comparisonResults, orderDocEntry) {
    const lines = []

    for (const item of comparisonResults.filter(r =>
        (r.status === MATCH_STATUS.MATCHED || r.status === MATCH_STATUS.LINKED) && r.orderLine
    )) {
        const vProd    = item.xmlItem.vProd || 0
        const vDesc    = item.xmlItem.vDesc || 0
        const qCom     = item.xmlItem.qCom  || 1
        const qTrib    = item.xmlItem.qTrib  || 0
        const uCom     = (item.xmlItem.uCom  || '').trim().toUpperCase()
        const uTrib    = (item.xmlItem.uTrib || '').trim().toUpperCase()
        const sapUom   = (item.orderLine.MeasureUnit || '').trim().toUpperCase()
        const sapPrice = item.orderLine.Price || 0

        let deliveryQty = qCom

        if (uCom !== sapUom) {
            if (uTrib && uTrib === sapUom && qTrib > 0) {
                deliveryQty = qTrib
            } else {
                const factor = await resolveUoMConversionFactor(
                    item.xmlItem.uCom,
                    item.orderLine.UoMEntry,
                    item.sapItem?.UoMGroupEntry
                )
                if (factor !== null) {
                    deliveryQty = Math.round(qCom * factor * 1000000) / 1000000
                } else if (sapPrice > 0) {
                    deliveryQty = Math.round((vProd / sapPrice) * 10000) / 10000
                }
            }
        }

        const grossUnitPrice  = deliveryQty > 0 ? vProd / deliveryQty : sapPrice
        const discountPercent = vProd > 0 ? (vDesc / vProd) * 100 : 0

        lines.push({
            ItemCode: item.sapItem.ItemCode,
            Quantity: deliveryQty,
            UnitPrice: grossUnitPrice,
            DiscountPercent: discountPercent,
            WarehouseCode: item.orderLine.WarehouseCode,
            UoMEntry: item.orderLine.UoMEntry,
            BaseType: 22,
            BaseEntry: orderDocEntry,
            BaseLine: item.orderLine.LineNum
        })
    }

    return lines
}

export function checkCriticalDivergences(stats) {
    const warnings = []
    const errors = []

    if (stats.notInOrderCount > 0) {
        errors.push(`${stats.notInOrderCount} item(ns) do XML não vinculado(s). Vincule todos os itens antes de prosseguir.`)
    }

    if (stats.matchedCount === 0 && stats.totalXmlItems > 0) {
        errors.push('Nenhum item do XML corresponde ao Pedido de Compras')
    }

    return {
        hasErrors: errors.length > 0,
        hasWarnings: warnings.length > 0,
        errors,
        warnings,
        canProceed: errors.length === 0
    }
}
