import axios from 'axios'
import Api from '../../../lib/api'

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
    return axios.post('/api/purchase-request/create-alternate-catnum', {
        cardCode,
        vendorItemCode,
        itemCode,
    })
}