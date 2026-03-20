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
                OpenQty: matchedOrderLine.RemainingOpenQuantity ?? 0,
                LineStatus: matchedOrderLine.LineStatus,
                Price: matchedOrderLine.Price,
                WarehouseCode: matchedOrderLine.WarehouseCode,
                UoMEntry: matchedOrderLine.UoMEntry
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

export function prepareDeliveryNoteLines(comparisonResults, orderDocEntry) {
    return comparisonResults
        .filter(item => (item.status === MATCH_STATUS.MATCHED || item.status === MATCH_STATUS.LINKED) && item.orderLine)
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
