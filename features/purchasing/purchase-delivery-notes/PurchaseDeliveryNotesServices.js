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

export async function getOpenPurchaseOrdersAndApReserveInvoices() {

    const purchaseOrdersQuery = new Api()
        .setMethod('GET')
        .setUrl('/PurchaseOrders')
        .setParams({
            $select: 'DocEntry,DocNum,DocDate,CardCode,CardName,DocTotal,Comments,DocumentStatus,BPL_IDAssignedToInvoice,BPLName,ImportFileNum,ReserveInvoice',
            $orderby: 'DocNum desc',
            $filter: `DocumentStatus eq 'bost_Open'`
        })
        .get()

    const apReserveInvoicesQuery = new Api()
        .setMethod('GET')
        .setUrl('/PurchaseInvoices')
        .setParams({
            $select: 'DocEntry,DocNum,DocDate,CardCode,CardName,DocTotal,Comments,DocumentStatus,BPL_IDAssignedToInvoice,BPLName,ImportFileNum,ReserveInvoice',
            $orderby: 'DocNum desc',
            $filter: `DocumentStatus eq 'bost_Open' and ReserveInvoice eq 'tYES'`
        })
        .get()

    const data = await Promise.all([
        doApiCall(purchaseOrdersQuery),
        doApiCall(apReserveInvoicesQuery)
    ])

    const joinnedData = data
        .reduce((elem1, elem2) => elem1.value.concat(elem2.value))
        .sort((elem1, elem2) => new Date(elem1.DocDate) - new Date(elem2.DocDate))
        .reverse()


    return joinnedData
}

export async function createPurchaseDeliveryNotes(purchaseDeliveryNote) {
    const query = new Api()
        .setMethod('POST')
        .setUrl('/PurchaseDeliveryNotes')
        .setData(purchaseDeliveryNote)
        .get()

    const result = await doApiCall(query)
    if (result.status === 400) {
        const errorMessage = result ? result.data.message.value : 'Unknown error'
        throw new Error(errorMessage)
    }
    return result
}

export async function updatePurchaseDeliveryNotes(purchaseDeliveryNote, DocEntry) {
    const query = new Api()
        .setMethod('PATCH')
        .setUrl(`/PurchaseDeliveryNotes(${DocEntry})`)
        .setData(purchaseDeliveryNote)
        .get()

    const result = await doApiCall(query)
    if (result.status === 400) {
        const errorMessage = result ? result.data.message.value : 'Unknown error'
        throw new Error(errorMessage)
    }
    return result
}

export async function getAllPurchaseDeliveryNotesByBranches(branchesIds, filters = {}) {

    const branchesFilter = branchesIds.map(id => {
        return `BPL_IDAssignedToInvoice eq ${id}`
    }).join(' or ')

    let filterQuery = `(${branchesFilter}) and DocDate ge '${filters.initalDate}' and DocDate le '${filters.finalDate}'`

    const query = new Api()
        .setMethod('GET')
        .setUrl('/PurchaseDeliveryNotes')
        .setParams({
            $select: 'DocEntry,DocNum,CardName,Comments,DocDate,SequenceSerial,DocumentStatus,Cancelled',
            $filter: filterQuery,
            $orderby: 'DocEntry desc'
        })
        .get()

    const result = await doApiCall(query)
    return result.value
}

export async function getPurchaseDeliveryNotesById(DocNum) {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/PurchaseDeliveryNotes')
        .setParams({
            $filter: `DocNum eq ${DocNum}`
        })
        .get()

    const data = await doApiCall(query)
    return data.value[0]
}

export function getIncotermsList() {
    return [
        {
            value: '0',
            description: '0 - Frete por conta do Remetente (CIF)'
        },
        {
            value: 1,
            description: '1 - Frete por conta do Destinatário (FOB)'
        },
        {
            value: 2,
            description: '2 - Frete por conta de Terceiros'
        },
        {
            value: 3,
            description: '3 - Transporte Próprio por conta do Remetente'
        },
        {
            value: 4,
            description: '4 - Transporte Próprio por conta do Destinatário'
        },
        {
            value: 9,
            description: '9 - Sem Ocorrência de Transporte'
        }
    ]
}

export function getVehicleStateList() {

    return [
        { value: 'AC', description: 'Acre' },
        { value: 'AL', description: 'Alagoas' },
        { value: 'AP', description: 'Amapá' },
        { value: 'AM', description: 'Amazonas' },
        { value: 'BA', description: 'Bahia' },
        { value: 'CE', description: 'Ceará' },
        { value: 'DF', description: 'Distrito Federal' },
        { value: 'ES', description: 'Espírito Santo' },
        { value: 'GO', description: 'Goiás' },
        { value: 'MA', description: 'Maranhão' },
        { value: 'MT', description: 'Mato Grosso' },
        { value: 'MS', description: 'Mato Grosso do Sul' },
        { value: 'MG', description: 'Minas Gerais' },
        { value: 'PA', description: 'Pará' },
        { value: 'PB', description: 'Paraíba' },
        { value: 'PR', description: 'Paraná' },
        { value: 'PE', description: 'Pernambuco' },
        { value: 'PI', description: 'Piauí' },
        { value: 'RJ', description: 'Rio de Janeiro' },
        { value: 'RN', description: 'Rio Grande do Norte' },
        { value: 'RS', description: 'Rio Grande do Sul' },
        { value: 'RO', description: 'Rondônia' },
        { value: 'RR', description: 'Roraima' },
        { value: 'SC', description: 'Santa Catarina' },
        { value: 'SP', description: 'São Paulo' },
        { value: 'SE', description: 'Sergipe' },
        { value: 'TO', description: 'Tocantins' },
    ]
}

export async function getPurchaseOrderById(DocNum) {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/PurchaseOrders')
        .setParams({
            $filter: `DocNum eq ${DocNum}`,
        })
        .get()

    const data = await doApiCall(query)
    return data.value[0]
}

export async function getBPAddress(cardCode) {

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/BusinessPartners('${cardCode}')`)
        .setParams({
            $select: 'CardCode,CardName,BPAddresses',
        })
        .get()

    const data = await doApiCall(query)
    return data
}

export async function getAdditionalExpenses() {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/AdditionalExpenses')
        .setParams({
            $select: 'ExpensCode,Name',
            $orderby: 'ExpensCode'
        })
        .get()

    const data = await doApiCall(query)
    return data.value
}