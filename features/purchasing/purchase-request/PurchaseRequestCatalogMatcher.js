import { getVendorCatalog, getItemDetailsByCode } from './PurchaseRequestServices'
import { normalizeCatalogCode } from '../../../utils/normalizeCatalogCode'

export function findItemInCatalog(cProd, catalog) {
    const normalizedCProd = normalizeCatalogCode(cProd)
    const match = catalog.find(entry => normalizeCatalogCode(entry.Substitute) === normalizedCProd)
    return match ? { ItemCode: match.ItemCode } : null
}

export async function recheckCatalogForVendor(cardCode, documentLines) {
    const catalog = await getVendorCatalog(cardCode)

    const updatedLines = []
    let matchedCount = 0
    let unmatchedCount = 0
    let totalXmlLines = 0

    for (const line of documentLines) {
        if (!line.VendorItemCode) {
            updatedLines.push({ ...line })
            continue
        }

        totalXmlLines++

        if (line.xmlMatchStatus === 'generic' || line.catalogCreated) {
            updatedLines.push({ ...line })
            if (line.xmlMatchStatus === 'generic' || line.xmlMatchStatus === 'vinculado') {
                matchedCount++
            }
            continue
        }

        const match = findItemInCatalog(line.VendorItemCode, catalog)

        if (match) {
            const details = await getItemDetailsByCode(match.ItemCode)
            updatedLines.push({
                ...line,
                Item: { id: match.ItemCode, label: details.itemName || match.ItemCode },
                UoMEntry: details.uoMEntry || null,
                MeasureUnit: details.measureUnit || '',
                xmlMatchStatus: 'encontrado',
                catalogCreated: false
            })
            matchedCount++
        } else {
            updatedLines.push({
                ...line,
                Item: '',
                UoMEntry: null,
                MeasureUnit: '',
                xmlMatchStatus: 'nao_encontrado',
                catalogCreated: false
            })
            unmatchedCount++
        }
    }

    return { updatedLines, matchedCount, unmatchedCount, totalXmlLines }
}
