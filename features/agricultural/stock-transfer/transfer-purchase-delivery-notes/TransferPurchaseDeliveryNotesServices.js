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
            return (error.response)
        })
}

export async function getTransferOrdersById(id) {

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/TransferOrders(${id})`)
        .get()

    const data = await doApiCall(query)
    return data
}

export function getFederalUnities() {
    return [
        { value: "AC", description: "Acre" },
        { value: "AL", description: "Alagoas" },
        { value: "AP", description: "Amapá" },
        { value: "AM", description: "Amazonas" },
        { value: "BA", description: "Bahia" },
        { value: "CE", description: "Ceará" },
        { value: "DF", description: "Distrito Federal" },
        { value: "ES", description: "Espírito Santo" },
        { value: "GO", description: "Goiás" },
        { value: "MA", description: "Maranhão" },
        { value: "MT", description: "Mato Grosso" },
        { value: "MS", description: "Mato Grosso do Sul" },
        { value: "MG", description: "Minas Gerais" },
        { value: "PA", description: "Pará" },
        { value: "PB", description: "Paraíba" },
        { value: "PR", description: "Paraná" },
        { value: "PE", description: "Pernambuco" },
        { value: "PI", description: "Piauí" },
        { value: "RJ", description: "Rio de Janeiro" },
        { value: "RN", description: "Rio Grande do Norte" },
        { value: "RS", description: "Rio Grande do Sul" },
        { value: "RO", description: "Rondônia" },
        { value: "RR", description: "Roraima" },
        { value: "SC", description: "Santa Catarina" },
        { value: "SP", description: "São Paulo" },
        { value: "SE", description: "Sergipe" },
        { value: "TO", description: "Tocantins" }
    ]
}

export async function getBranchById(id) {

    if (id) {
        const query = new Api()
            .setMethod('GET')
            .setUrl(`/BusinessPlaces(${id})`)
            .get()

        const data = await doApiCall(query)
        return data
    }
}

export async function getItemAveragePriceInWarehouse(itemCode, warehouseCode) {
    const query = new Api()
        .setMethod('POST')
        .setUrl('/QueryService_PostQuery')
        .setData({
            QueryPath: "$crossjoin(Items,Items/ItemWarehouseInfoCollection)",
            QueryOption: `$expand=Items($select=ItemCode),Items/ItemWarehouseInfoCollection($select=StandardAveragePrice)&$filter=Items/ItemCode eq Items/ItemWarehouseInfoCollection/ItemCode and Items/ItemCode eq '${itemCode}' and Items/ItemWarehouseInfoCollection/WarehouseCode eq '${warehouseCode}'`
        })
        .get()

    const data = await doApiCall(query)
    return data.value[0]["Items/ItemWarehouseInfoCollection"].StandardAveragePrice

}

export function getIncotermsOptions() {
    return [
        { value: '0', description: 'Contratação do Frete por conta do Remetente (CIF)' },
        { value: '1', description: 'Contratação do Frete por conta do Destinatário (FOB)' },
        { value: '2', description: 'Contratação do Frete por conta de Terceiros' },
        { value: '3', description: 'Transporte Próprio por conta do Remetente' },
        { value: '4', description: 'Transporte Próprio por conta do Destinatário' },
        { value: '9', description: 'Sem Ocorrência de Transporte' },
    ]
}

export async function createPurchaseDeliveryNote(purchaseDeliveryNote) {
    const query = new Api()
        .setMethod('POST')
        .setUrl('/PurchaseDeliveryNotes')
        .setData(purchaseDeliveryNote)
        .get()

        const result = await doApiCall(query)
        if (result.status === 400 || result.status === 404) {
            const errorMessage = result ? result.data.message.value : 'Unknown error'
            throw new Error(errorMessage)
        }
        return result
}

export async function getTransferPurchaseDeliveryNoteReport(id, user) {

    const apiGatewayData = {
        params: { DocCode: 'PDN20007' },
        data: [{
            "name": "DocKey@",
            "type": "xsd:decimal",
            "value": [[id]]
        },
        {
            "name": "UserCode@",
            "type": "xsd:string",
            "value": [[user]]
        }
        ]
    }

    const response = await axios.post(`/api/apigateway`, apiGatewayData)
    return response.data

}

export async function getOpenTransferOrders(filters = {}) {

    let filterQuery = `Status eq 'O' and U_B2AG_Date ge '${filters.initalDate}' and U_B2AG_Date le '${filters.finalDate}'`

    const query = new Api()
        .setMethod('GET')
        .setUrl('/TransferOrders')
        .setParams({
            $select: 'DocEntry,U_B2AG_OriginBranch,U_B2AG_DestinationBranch,U_B2AG_Description,U_B2AG_Date',
            $filter: filterQuery,
            $orderby: 'DocEntry desc'
        })
        .get()

    const data = await doApiCall(query)
    return data.value
}

export async function getOpenDeliveryNotesByTransferId(id) {

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/DeliveryNotes?$filter=U_B2AG_B2ObjectType eq 'TransferOrders' and U_B2AG_ObjectEntry eq ${id} and DocumentStatus eq 'bost_Open'&$orderby=DocNum desc`)
        .get()

    const result = await doApiCall(query)
    const list = result.value.map(item => {
        return {
            ...item,
            value: item.DocEntry,
            description: `${item.DocNum} - ${item.BPLName} - ${item.TaxExtension.Vehicle} - NF: ${item.SequenceSerial}`
        }
    })
    return list
}

export async function closeDeliveryNote(id) {
    const query = new Api()
        .setMethod('POST')
        .setUrl(`/DeliveryNotes(${id})/Close`)
        .get()

    const data = await doApiCall(query)
    return data
}

