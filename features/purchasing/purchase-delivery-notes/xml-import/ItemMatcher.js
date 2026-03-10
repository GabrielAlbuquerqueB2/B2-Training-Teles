import { normalizeCatalogCode } from '../../../../utils/normalizeCatalogCode'
import { getItemDetailsByCode } from './XmlImportServices'

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

        // ========== ESTRATÉGIA: Por Catálogo (AlternateCatNum) ==========
        const catalogMatch = findItemInCatalog(xmlItem.cProd, catalog)
        
        if (catalogMatch) {
            itemDetails = await getItemDetailsByCode(catalogMatch.ItemCode)
            
            matchedOrderLine = orderLines.find(line => 
                line.ItemCode === catalogMatch.ItemCode && 
                !matchedOrderLineNums.has(line.LineNum)
            )

            if (matchedOrderLine) {
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
                uCom: xmlItem.uCom,
                nItemPed: xmlItem.nItemPed
            },
            sapItem: itemDetails ? {
                ItemCode: itemDetails.itemCode,
                ItemName: itemDetails.itemName,
                MeasureUnit: itemDetails.measureUnit,
                UoMEntry: itemDetails.uoMEntry
            } : null,
            orderLine: matchedOrderLine ? {
                LineNum: matchedOrderLine.LineNum,
                ItemCode: matchedOrderLine.ItemCode,
                ItemDescription: matchedOrderLine.ItemDescription,
                Quantity: matchedOrderLine.Quantity,
                RemainingOpenQuantity: matchedOrderLine.RemainingOpenQuantity,
                Price: matchedOrderLine.Price,
                WarehouseCode: matchedOrderLine.WarehouseCode,
                UoMEntry: matchedOrderLine.UoMEntry
            } : null,
            status,
            matchMethod,
            matched: status === MATCH_STATUS.MATCHED
        })
    }

    const unmatchedOrderLines = orderLines.filter(line => 
        !matchedOrderLineNums.has(line.LineNum) && 
        line.RemainingOpenQuantity > 0
    )

    const missingInXml = unmatchedOrderLines.map(line => ({
        xmlItem: null,
        sapItem: {
            ItemCode: line.ItemCode,
            ItemName: line.ItemDescription,
            MeasureUnit: line.MeasureUnit
        },
        orderLine: {
            LineNum: line.LineNum,
            ItemCode: line.ItemCode,
            ItemDescription: line.ItemDescription,
            Quantity: line.Quantity,
            RemainingOpenQuantity: line.RemainingOpenQuantity,
            Price: line.Price,
            WarehouseCode: line.WarehouseCode,
            UoMEntry: line.UoMEntry
        },
        status: MATCH_STATUS.NOT_IN_XML,
        matchMethod: MATCH_METHOD.NONE,
        matched: false
    }))

    const stats = {
        totalXmlItems: xmlItems.length,
        totalOrderItems: orderLines.length,
        matchedCount: comparisonResults.filter(r => r.status === MATCH_STATUS.MATCHED).length,
        notInOrderCount: comparisonResults.filter(r => r.status === MATCH_STATUS.NOT_IN_ORDER).length,
        notInXmlCount: missingInXml.length
    }

    return {
        comparisonResults: [...comparisonResults, ...missingInXml],
        xmlItemsResults: comparisonResults,
        missingInXml,
        stats
    }
}

export function prepareDeliveryNoteLines(comparisonResults, orderDocEntry) {
    return comparisonResults
        .filter(item => item.status === MATCH_STATUS.MATCHED && item.orderLine)
        .map(item => ({
            ItemCode: item.sapItem.ItemCode,
            Quantity: item.xmlItem.qCom,
            UnitPrice: item.xmlItem.vUnCom,
            WarehouseCode: item.orderLine.WarehouseCode,
            UoMEntry: item.orderLine.UoMEntry,
            BaseType: 22,
            BaseEntry: orderDocEntry,
            BaseLine: item.orderLine.LineNum
        }))
}

export function checkCriticalDivergences(stats) {
    const warnings = []
    const errors = []

    if (stats.notInOrderCount > 0) {
        warnings.push(`${stats.notInOrderCount} item(ns) do XML não encontrado(s) no Pedido de Compras`)
    }

    if (stats.notInXmlCount > 0) {
        warnings.push(`${stats.notInXmlCount} item(ns) do Pedido não vieram no XML (entrega parcial)`)
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
