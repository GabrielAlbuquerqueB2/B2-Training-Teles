import axios from 'axios'
import Api from '../../../../lib/api'

async function doApiCall(query) {

    return axios.request(query)
        .then((response) => {
            if (response.data) {
                return response.data
            } else {
                return {}
            }
        }).catch((error) => {
            console.log(error)
            return error
        })
}

export async function getInventoryTransferRequestById(id) {

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/InventoryTransferRequests(${id})`)
        .get()

    const data = await doApiCall(query)
    return data
}

export async function createInventoryTransferRequests(inventoryTransferRequest) {
    const query = new Api()
        .setMethod('POST')
        .setUrl('/InventoryTransferRequests')
        .setData(inventoryTransferRequest)
        .get()

    const data = await doApiCall(query)
    return data
}

export async function updateInventoryTransferRequests(inventoryTransferRequest, docEntry) {
    const query = new Api()
        .setMethod('PATCH')
        .setUrl(`/InventoryTransferRequests(${docEntry})`)
        .setData(inventoryTransferRequest)
        .get()

    const data = await doApiCall(query)
    return data
}

export async function createStockTransfer(stockTransfer) {
    const query = new Api()
        .setMethod('POST')
        .setUrl('/StockTransfers')
        .setData(stockTransfer)
        .get()

    const data = await doApiCall(query)
    return data
}

export async function getInventoryTransferRequest(filters = {}) {

    let filterQuery = `DocDate ge '${filters.initalDate}' and DocDate le '${filters.finalDate}'`

    const query = new Api()
        .setMethod('GET')
        .setUrl('/InventoryTransferRequests')
        .setParams({
            $select: 'DocEntry,DocNum,DocDate,FromWarehouse,ToWarehouse,BPLName,Comments,StockTransferLines',
            $filter: filterQuery,
            $orderby: 'DocEntry desc'
        })
        .get()

    const data = await doApiCall(query)
    return data.value
}