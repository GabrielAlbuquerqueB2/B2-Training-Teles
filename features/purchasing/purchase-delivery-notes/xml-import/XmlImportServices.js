import axios from 'axios'
import Api from '../../../../lib/api'
import { normalizeCatalogCode } from '../../../../utils/normalizeCatalogCode'

export async function getAlternateCatNumBySupplierAndCode(cardCode, vendorItemCode) {
    const normalizedCode = normalizeCatalogCode(vendorItemCode)
    const query = new Api()
        .setMethod('GET')
        .setUrl('/AlternateCatNum')
        .setParams({
            $filter: `CardCode eq '${cardCode}' and Substitute eq '${normalizedCode}'`,
            $select: 'ItemCode,CardCode,Substitute'
        })
        .get()
    const result = await doApiCall(query)
    return (result.value && result.value.length > 0) ? result.value[0] : null
}

export async function deleteAlternateCatNum(cardCode, vendorItemCode, itemCode) {
    const normalizedCode = normalizeCatalogCode(vendorItemCode)
    const url = `/AlternateCatNum(ItemCode='${itemCode}',CardCode='${cardCode}',Substitute='${normalizedCode}')`
    const query = new Api()
        .setMethod('DELETE')
        .setUrl(url)
        .get()
    const result = await doApiCall(query)
    return result
}

async function doApiCall(query) {
    return axios.request(query)
        .then((response) => {
            if (response.data) {
                return response.data
            } else {
                return {}
            }
        }).catch((error) => {
            return error.response
        })
}

function stripCNPJ(cnpj) {
    return cnpj.replace(/\D/g, '')
}

function formatCNPJ(cnpj) {
    const digits = cnpj.replace(/\D/g, '')
    if (digits.length === 14) {
        return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`
    }
    return digits
}

function isMatrizCNPJ(federalTaxID) {
    const digits = federalTaxID.replace(/\D/g, '')
    if (digits.length !== 14) return false
    return digits.slice(8, 12) === '0001'
}

export async function findVendorByCNPJ(cnpj) {
    const raw = stripCNPJ(cnpj)
    const formatted = formatCNPJ(cnpj)

    const query = new Api()
        .setMethod('GET')
        .setUrl('/BusinessPartners')
        .setParams({
            $select: 'CardCode,CardName,FederalTaxID',
            $filter: `CardType eq 'cSupplier' and Valid eq 'tYES' and (FederalTaxID eq '${raw}' or FederalTaxID eq '${formatted}')`
        })
        .get()

    const result = await doApiCall(query)
    if (result.value && result.value.length > 0) {
        const matriz = result.value.find(bp => isMatrizCNPJ(bp.FederalTaxID))
        return matriz || result.value[0]
    }

    // Verifica se existe como inativo para fornecer mensagem mais clara ao usuário
    const inactiveQuery = new Api()
        .setMethod('GET')
        .setUrl('/BusinessPartners')
        .setParams({
            $select: 'CardCode,CardName,FederalTaxID',
            $filter: `CardType eq 'cSupplier' and Valid eq 'tNO' and (FederalTaxID eq '${raw}' or FederalTaxID eq '${formatted}')`
        })
        .get()

    const inactiveResult = await doApiCall(inactiveQuery)
    if (inactiveResult.value && inactiveResult.value.length > 0) {
        return { ...inactiveResult.value[0], _inactive: true }
    }

    return null
}

export async function getBranchByIE(ie) {
    if (!ie) return null
    const cleanIE = ie.replace(/\D/g, '')
    if (!cleanIE) return null

    const query = new Api()
        .setMethod('GET')
        .setUrl('/BusinessPlaces')
        .setParams({
            $select: 'BPLID,BPLName',
        })
        .get()

    const result = await doApiCall(query)
    const places = result.value || []

    return places.find(bp => {
        const name = bp.BPLName || ''
        const ieMatch = name.match(/IE\.\s*([\d.\-]+)/)
        if (ieMatch) {
            const nameIE = ieMatch[1].replace(/\D/g, '')
            return nameIE === cleanIE
        }
        return false
    }) || null
}

export async function getVendorAddresses(cardCode) {
    const query = new Api()
        .setMethod('GET')
        .setUrl(`/BusinessPartners('${cardCode}')`)
        .setParams({
            $select: 'CardCode,BPAddresses',
        })
        .get()

    const result = await doApiCall(query)
    const bpAddresses = result.BPAddresses || []
    return bpAddresses
        .filter(addr => addr.AddressType === 'bo_BillTo')
        .map(addr => ({
            value: addr.AddressName,
            description: `${addr.AddressName} - ${addr.City || ''}`,
            U_FederalTaxId: addr.U_FederalTaxId,
            U_AGRT_CnpjFornecedor: addr.U_AGRT_CnpjFornecedor,
            U_TX_IE: addr.U_TX_IE,
            State: addr.State,
            County: addr.County,
        }))
}

export async function getOpenPurchaseOrdersByVendor(cardCode, branchId) {
    let filter = `CardCode eq '${cardCode}' and DocumentStatus eq 'bost_Open'`
    if (branchId) {
        filter += ` and BPL_IDAssignedToInvoice eq ${branchId}`
    }

    const query = new Api()
        .setMethod('GET')
        .setUrl('/PurchaseOrders')
        .setParams({
            $select: 'DocEntry,DocNum,DocDate,DocDueDate,CardCode,CardName,DocTotal,Comments,DocumentStatus,BPL_IDAssignedToInvoice,BPLName',
            $filter: filter,
            $orderby: 'DocDate desc'
        })
        .get()

    const result = await doApiCall(query)
    return result.value || []
}

export async function getPurchaseOrderByDocEntry(docEntry) {
    const query = new Api()
        .setMethod('GET')
        .setUrl(`/PurchaseOrders(${docEntry})`)
        .get()

    const result = await doApiCall(query)
    return result
}

export async function getVendorCatalog(cardCode) {
    const normalizedCardCode = String(cardCode).trim()

    const query = new Api()
        .setMethod('GET')
        .setUrl('/AlternateCatNum')
        .setParams({
            $filter: `CardCode eq '${normalizedCardCode}'`,
            $select: 'ItemCode,Substitute'
        })
        .get()

    const result = await doApiCall(query)
    return result.value || []
}

export async function getItemDetailsByCode(itemCode) {
    const query = new Api()
        .setMethod('GET')
        .setUrl(`/Items('${itemCode}')`)
        .setParams({
            $select: 'ItemCode,ItemName,InventoryUOM,DefaultPurchasingUoMEntry,InventoryUoMEntry'
        })
        .get()

    const result = await doApiCall(query)
    if (result.status === 400 || !result.ItemCode) {
        return { itemName: itemCode, measureUnit: '', uoMEntry: null }
    }
    return {
        itemCode: result.ItemCode,
        itemName: result.ItemName || itemCode,
        measureUnit: result.InventoryUOM || '',
        uoMEntry: result.DefaultPurchasingUoMEntry || result.InventoryUoMEntry || null
    }
}

export async function createPurchaseDeliveryNote(purchaseDeliveryNote) {
    const query = new Api()
        .setMethod('POST')
        .setUrl('/PurchaseDeliveryNotes')
        .setData(purchaseDeliveryNote)
        .get()

    const result = await doApiCall(query)
    if (result.status === 400) {
        const errorMessage = result?.data?.message?.value || 'Erro desconhecido'
        throw new Error(errorMessage)
    }
    return result
}

export async function createAlternateCatNum(cardCode, vendorItemCode, itemCode) {
    const normalizedCode = normalizeCatalogCode(vendorItemCode)

    const query = new Api()
        .setMethod('POST')
        .setUrl('/AlternateCatNum')
        .setData({
            ItemCode: itemCode,
            CardCode: cardCode,
            Substitute: normalizedCode,
        })
        .get()

    const result = await doApiCall(query)
    if (result.status === 400) {
        const sapMessage = result?.data?.message?.value || ''
        if (sapMessage.includes('already exists') || sapMessage.includes('já existe') || sapMessage.includes('1320000205')) {
            return { success: true, alreadyExists: true }
        }
        const errorMessage = sapMessage || 'Erro ao criar vínculo no SAP.'
        throw new Error(errorMessage)
    }
    return result
}
