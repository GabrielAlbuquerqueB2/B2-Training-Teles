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

export async function getOpenOrders() {

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/Orders?$select=DocEntry,DocNum,CardCode,CardName,TaxExtension,U_Contrato,ImportFileNum&$filter=DocumentStatus eq 'bost_Open'&$orderby=DocNum`)
        .get()

    const data = await doApiCall(query)
    return mapOrderToSelectComponent(data.value)
}

export function mapOrderToSelectComponent(items) {
    return items.map((item) => {
        return {
            value: item.DocEntry,
            description: `${item.DocNum} - ${item.CardCode} - ${item.CardName} - ${item.TaxExtension.TaxId0} - CTR: ${item.U_Contrato ? item.U_Contrato : (item.ImportFileNum ? item.ImportFileNum : 'N/A')}`,
            order: item
        }
    })
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

export async function getPackingListById(id) {
    const query = new Api()
        .setMethod('GET')
        .setUrl(`/PackingList(${id})`)
        .get()

    const data = await doApiCall(query)
    return data
}

export async function createPackingList(packingList) {
    const query = new Api()
        .setMethod('POST')
        .setUrl('/PackingList')
        .setData(packingList)
        .get()

    const data = await doApiCall(query)
    return data
}

export async function updatePackingList(id, packingList) {
    const query = new Api()
        .setMethod('PATCH')
        .setUrl(`/PackingList(${id})`)
        .setData(packingList)
        .get()

        const result = await doApiCall(query)
        if (result.status === 400) {
            const errorMessage = result ? result.data.message.value : 'Unknown error'
            throw new Error(errorMessage)
        }
        return result
}

export async function getAnalysesByItemCode(id) {

    if (id) {
        const query = new Api()
            .setMethod('GET')
            .setUrl(`/$crossjoin(Cultivation,AnalisysType)?$expand=Cultivation($select=Code,U_B2AG_ItemCode),AnalisysType($select=Code,Name)&$filter=Cultivation/Code eq AnalisysType/U_B2AG_Cultivation and Cultivation/U_B2AG_ItemCode eq '${id}'`)
            .get()

        const items = await doApiCall(query)
        const data = mapAnalysesToList(items.value)
        return data
    }
}

export function mapAnalysesToList(items) {
    return items.map((item) => {
        return {
            U_B2AG_Code: item.AnalisysType.Code,
            U_B2AG_Description: item.AnalisysType.Name,
        }
    })
}

export async function createInvoice(invoice) {
    const query = new Api()
        .setMethod('POST')
        .setUrl('/Invoices')
        .setData(invoice)
        .get()

        const result = await doApiCall(query)
        if (result.status === 400) {
            const errorMessage = result ? result.data.message.value : 'Unknown error'
            throw new Error(errorMessage)
        }
        return result
}

export async function closePackingListById(id) {
    const query = new Api()
        .setMethod('POST')
        .setUrl(`/PackingList(${id})/Close`)
        .get()

    const data = await doApiCall(query)
    return data
}


export async function getAllPackingList(branchesIds, filters = {}) {
    let filterQuery = `PackingList/U_B2AG_Order eq Orders/DocEntry and Orders/DocEntry eq Orders/DocumentLines/DocEntry and PackingList/U_B2AG_Date ge '${filters.initalDate}' and PackingList/U_B2AG_Date le '${filters.finalDate}'`
    
    const query = new Api()
        .setMethod('POST')
        .setUrl('/QueryService_PostQuery')
        .setData({
            QueryPath: `$crossjoin(PackingList,Orders,Orders/DocumentLines)`,
            QueryOption: `$expand=PackingList($select=DocEntry,U_B2AG_Order,Status,Canceled,U_B2AG_LiquidWeight,U_B2AG_Date,U_B2AG_LicensePlate,U_B2AG_Driver),Orders($select=CardCode,CardName,BPLName),Orders/DocumentLines($select=ItemCode,ItemDescription)&$filter=${filterQuery}&$orderby=PackingList/DocEntry desc`
        })
        .get()

    const data = await doApiCall(query)
    const mappedData = mapPackingList(data)
    return mappedData
}

function mapPackingList(data) {
    if (!data || !data.value || !Array.isArray(data.value)) {
        return []
    }
    return data.value.map(item => {
        return {
            ...item.PackingList,
            ...item.Orders,
            ...item['Orders/DocumentLines']
        }
    })
}

export async function getOrderById(id) {
    const query = new Api()
        .setMethod('GET')
        .setUrl(`/Orders(${id})`)
        .get()

    const data = await doApiCall(query)
    return data
}

export async function batchVerify(ItemCode) {
    const query = new Api()
        .setMethod('GET')
        .setUrl(`/Items('${ItemCode}')?$select=ManageBatchNumbers`)
        .get()

        const data = await doApiCall(query)
        return data.ManageBatchNumbers
}

export async function getAllBatches(ItemCode) {
    const query = new Api()
        .setMethod('GET')
        .setUrl(`/BatchNumberDetails?$select=Batch,ItemDescription,DocEntry&$filter=ItemCode eq '${ItemCode}'`)
        .get()
    
    const ManageBatchNumbers = await batchVerify(ItemCode)

    const data = await doApiCall(query)
    if (ManageBatchNumbers == 'tYES' && data && data.value && Array.isArray(data.value)) {
        return data.value.map(batch => ({
            value: batch.Batch,
            description: batch.Batch
        }))
    } else {
        return []
    }
}


export async function getPackingListReport(id) {
    const reportId = JSON.parse(sessionStorage.getItem("GeneralParams")).PackingListReport
    const apiGatewayData = {
        params: { DocCode: reportId },
        data: [{ name: 'DocEntry', type: 'xsd:decimal', value: [[id]] }]
    }

    const response = await axios.post(`/api/apigateway`, apiGatewayData)
    return response.data

}

export async function getWTDataByCombinationId(code) {

    const query = new Api()
        .setMethod('POST')
        .setUrl('/QueryService_PostQuery')
        .setData({
            QueryPath: '$crossjoin(WithholdingTaxCodes,WTCombination,WTCombination/B2AG_WHT1Collection)',
            QueryOption: `$expand=WithholdingTaxCodes($select=U_B2AG_Pauta),WTCombination($select=Code,Name),WTCombination/B2AG_WHT1Collection($select=U_B2AG_WTCode,U_B2AG_WTBase)&$filter=WithholdingTaxCodes/WTCode eq WTCombination/B2AG_WHT1Collection/U_B2AG_WTCode and WTCombination/B2AG_WHT1Collection/Code eq WTCombination/Code and WTCombination/Code eq '${code}'`
        })
        .get()

    const data = await doApiCall(query)
    return data.value

}
