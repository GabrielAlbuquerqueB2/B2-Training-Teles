import axios from 'axios'
import Api from '../../../lib/api'
import { normalizeCatalogCode } from '../../../utils/normalizeCatalogCode'

async function doApiCall(query) {

    return axios.request(query)
        .then((response) => {
            if (response.data) {
                return response.data
            } else {
                return {}
            }
        }).catch((error) => {
            return (error.response)
        })
}

export function mapDataToSelectComponent(items) {
    if (!items) return;

    return items.map((item) => {
        return {
            value: item.Code,
            description: item.Name
        }
    })
}

export async function getAllCrops() {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/Crop')
        .get()

    const result = await doApiCall(query)
    const data = mapDataToSelectComponent(result.value)
    return data
}

export async function getItemGroups() {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/ItemGroups')
        .setParams({
            $select: 'Number,GroupName',
            $filter: `not contains(GroupName, 'T3')`,
            $orderby: 'GroupName'
        })
        .get()

    const result = await doApiCall(query)
    const data = result.value.map((item) => {

        return {
            value: item.Number,
            description: item.GroupName
        }
    })
    data.unshift({ value: '', description: 'Selecione uma opção' })

    return data
}

export async function createPurchaseRequest(purchaseRequests) {
    const query = new Api()
        .setMethod('POST')
        .setUrl('/PurchaseRequests')
        .setData(purchaseRequests)
        .get()

    const result = await doApiCall(query)
    if (result.status === 400) {
        const errorMessage = result ? result.data.message.value : 'Unknown error'
        throw new Error(errorMessage)
    }
    return result
}

export async function getPurchaseRequestById(DocNum) {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/PurchaseRequests')
        .setParams({
            $filter: `DocNum eq ${DocNum}`
        })
        .get()

    const data = await doApiCall(query)
    return data.value[0]
}


export async function editPurchaseRequest(id, purchaseRequests) {
    const query = new Api()
        .setMethod('PATCH')
        .setUrl(`/PurchaseRequests(${id})`)
        .setData(purchaseRequests)
        .get()

    const result = await doApiCall(query)
    if (result.status !== 'undefined') {
        if (result.status === 400) {
            const errorMessage = result ? result.data.message.value : 'Unknown error'
            throw new Error(errorMessage)
        }
        return result
    }
    return result
}

export async function getAllPurchaseRequests(branchesIds, filters = {}) {

    const branchesFilter = branchesIds.map(id => {
        return `BPL_IDAssignedToInvoice eq ${id}`
    }).join(' or ')

    let filterQuery = `(${branchesFilter}) and  DocDate ge '${filters.initalDate}' and DocDate le '${filters.finalDate}'`

    const query = new Api()
        .setMethod('GET')
        .setUrl('/PurchaseRequests')
        .setParams({
            $select: 'DocEntry,DocNum,Comments,DocDate,U_TX_NDfe,DocumentStatus,Cancelled',
            $filter: filterQuery,
            $orderby: 'DocEntry desc'
        })
        .get()

    const result = await doApiCall(query)
    return result.value
}

export async function cancelPurchaseRequest(id) {
    const query = new Api()
        .setMethod('POST')
        .setUrl(`/PurchaseRequests(${id})/Cancel`)
        .get()

    const data = await doApiCall(query)
    return data
}

export async function getRequesterById(Code) {

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/EmployeesInfo(${Code})`)
        .get()

    const data = await doApiCall(query)
    return data
}

export async function getVendorById(CardCode) {

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/BusinessPartners('${CardCode}')`)
        .get()

    const data = await doApiCall(query)
    return data
}

export async function createPurchaseOrder(purchaseOrder) {
    const query = new Api()
        .setMethod('POST')
        .setUrl('/PurchaseOrders')
        .setData(purchaseOrder)
        .get()

    const result = await doApiCall(query)
    if (result.status !== 'undefined') {
        if (result.status === 400) {
            const errorMessage = result ? result.data.message.value : 'Unknown error'
            throw new Error(errorMessage)
        }
        return result
    }
    return result
}

export async function getAttachmentsById(id) {

    const url = process.env.NEXT_PUBLIC_ATTACHMENTS

    const options = {
        method: 'GET',
        url: url + id
    }

    return axios.request(options).then(function (response) {

        return response.data
    }).catch(function (error) {

        return error
    })
}

export async function getAttachmentByFilename(id, fileName) {

    const url = process.env.NEXT_PUBLIC_ATTACHMENTS

    const options = {
        method: 'GET',
        url: `${url}${id}/${fileName}`
    }

    return axios.request(options).then(function (response) {

        return response.data
    }).catch(function (error) {

        return error
    })
}

export async function getPurchaseRequestReport(id) {
    const reportId = JSON.parse(sessionStorage.getItem("GeneralParams")).PurchaseRequestReport
    const apiGatewayData = {
        params: { DocCode: reportId },
        data: [{
            "name": "DocKey@",
            "type": "xsd:decimal",
            "value": [[id]]
        }
        ]
    }
    const response = await axios.post(`/api/apigateway`, apiGatewayData)
    return response.data
}

export async function getItemByCode(itemCode) {
    const query = new Api()
        .setMethod('GET')
        .setUrl('/Items')
        .setParams({
            $select: 'ItemCode,ItemName,InventoryUOM',
            $filter: `ItemCode eq '${itemCode}'`
        })
        .get()

    const result = await doApiCall(query)
    if (result.value && result.value.length > 0) {
        return result.value[0]
    }
    return null
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

function formatCNPJ(cnpj) {
    const digits = cnpj.replace(/\D/g, '')
    if (digits.length === 14) {
        return `${digits.slice(0,2)}.${digits.slice(2,5)}.${digits.slice(5,8)}/${digits.slice(8,12)}-${digits.slice(12,14)}`
    }
    return digits
}

function stripCNPJ(cnpj) {
    return cnpj.replace(/\D/g, '')
}

export async function findVendorByCNPJ(cnpj) {
    const raw = stripCNPJ(cnpj)
    const formatted = formatCNPJ(cnpj)

    const query = new Api()
        .setMethod('GET')
        .setUrl('/BusinessPartners')
        .setParams({
            $select: 'CardCode,CardName,FederalTaxID',
            $filter: `CardType eq 'cSupplier' and (FederalTaxID eq '${raw}' or FederalTaxID eq '${formatted}')`
        })
        .get()

    const result = await doApiCall(query)
    if (result.value && result.value.length > 0) {
        return result.value[0]
    }
    return null
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
        itemName: result.ItemName || itemCode,
        measureUnit: result.InventoryUOM || '',
        uoMEntry: result.DefaultPurchasingUoMEntry || result.InventoryUoMEntry || null,
    }
}