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

export function mapDataToSelectComponent(items) {
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

    const data = await doApiCall(query)
    return mapDataToSelectComponent(data.value)
}

export async function getAllCultivations() {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/Cultivation')
        .get()

    const data = await doApiCall(query)
    return mapDataToSelectComponent(data.value)
}

export async function getAllProductionUnits() {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/ProductionUnit')
        .get()

    const data = await doApiCall(query)
    return data.value
}

export async function getProductionUnitByCode(unitCode, fieldCode) {

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/ProductionUnit('${unitCode}')`)
        .get()

    const data = await doApiCall(query)
    const field = data.B2AG_PDU1Collection.filter(field => field.U_B2AG_Code === fieldCode)
    return {...data, field: field}
}

export function mapFieldsToSelectComponent(items) {
    return items.map((item) => {
        return {
            value: item.U_B2AG_Code,
            description: item.U_B2AG_Code
        }
    })
}

export function getStageOfCulture() {
    return [
        { value: "0", description: "Germinação" },
        { value: "1", description: "Desenvolvimento Foliar" },
        { value: "2", description: "Formação De Rebentos Laterais" },
        { value: "3", description: "Alongamento Da Haste" },
        { value: "4", description: "Partes Vegetativas De Plantas" },
        { value: "5", description: "Emergência Da Inflorescência" },
        { value: "6", description: "Floração" },
        { value: "7", description: "Desenvolvimento Do Fruto" },
        { value: "8", description: "Amadurecimento" },
        { value: "9", description: "Senescência" }
    ]
}

export async function createProductionAnalisys(ProductionAnalisys) {
    const query = new Api()
        .setMethod('POST')
        .setUrl('/ProductionAnalisys')
        .setData(ProductionAnalisys)
        .get()

    const result = await doApiCall(query)
    if (result.status === 400) {
        const errorMessage = result ? result.data.message.value : 'Unknown error'
        throw new Error(errorMessage)
    }
    return result
}

export async function editProductionAnalisys(DocEntry, ProductionAnalisys) {
    const query = new Api()
        .setMethod('PATCH')
        .setUrl(`/ProductionAnalisys(${DocEntry})`)
        .setData(ProductionAnalisys)
        .get()

    const result = await doApiCall(query)
    if (result.status === 400) {
        const errorMessage = result ? result.data.message.value : 'Unknown error'
        throw new Error(errorMessage)
    }
    return result
}

export async function getProductionAnalisysById(DocEntry) {

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/ProductionAnalisys(${DocEntry})`)
        .get()

    const data = await doApiCall(query)
    return data
}