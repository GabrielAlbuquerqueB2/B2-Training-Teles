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

export async function createWeatherNote(WeatherNote) {
    const query = new Api()
        .setMethod('POST')
        .setUrl('/WeatherNote')
        .setData(WeatherNote)
        .get()

    const result = await doApiCall(query)
    if (result.status === 400) {
        const errorMessage = result ? result.data.message.value : 'Unknown error'
        throw new Error(errorMessage)
    }
    return result

}

export async function editWeatherNote(DocEntry, WeatherNote) {
    const query = new Api()
        .setMethod('PATCH')
        .setUrl(`/WeatherNote(${DocEntry})`)
        .setData(WeatherNote)
        .get()

    const result = await doApiCall(query)
    if (result.status === 400) {
        const errorMessage = result ? result.data.message.value : 'Unknown error'
        throw new Error(errorMessage)
    }
    return result
}

export function mapDataToSelectComponent(items) {
    return items.map((item) => {
        return {
            value: item.Code,
            description: item.Name
        }
    })
}

//Unidade De produção
export async function getAllProductionUnits() {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/ProductionUnit')
        .get()

    const data = await doApiCall(query)
    return data.value
}

export async function getProductionUnitByPostId(PostID) {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/WeatherStation')
        .setParams({
            $filter: `Code eq '${PostID}'`
        })
        .get()

    const data = await doApiCall(query)
    return data.value[0]
}

export async function getWeatherNoteById(code) {

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/WeatherNote(${code})`)
        .get()

    const data = await doApiCall(query)
    return data
}

export async function getWeatherStationByCode(code) {

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/WeatherStation('${code}')`)
        .get()

    const data = await doApiCall(query)
    return data
}

export async function getAllWeatherStation(location) {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/WeatherStation')
        // .setParams({
        //     $filter: `U_B2AG_ProductionUnitCode eq '${location}'`
        // })
        .get()

    const data = await doApiCall(query)
    const WeatherStationList = await mapWeatherStationToSelectComponent(data.value)
    return WeatherStationList
}

export async function getWeatherStationByLocation(location) {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/WeatherStation')
        .setParams({
            $filter: `U_B2AG_ProductionUnitCode eq '${location}'`
        })
        .get()

    const data = await doApiCall(query)
    return data.value
}

export async function getProductionUnitByCode(unitCode) {

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/ProductionUnit('${unitCode}')`)
        .get()

    const data = await doApiCall(query)
    return data[0].B2AG_PDU1Collection
}

export function mapWeatherStationToSelectComponent(items) {
    return items.map((item) => {
        return {
            value: item.Code,
            description: item.Name
        }
    })
}

export async function getAllWeatherNote(locations, filters) {
     const locationsFilter = locations.map(id => {
        return `WeatherStation/U_B2AG_ProductionUnitCode eq '${id}'`
    }).join(' or ')

    let filterQuery = `WeatherNote/DocEntry eq WeatherNote/B2AG_WSN1Collection/DocEntry and WeatherNote/B2AG_WSN1Collection/LineId eq 1 and WeatherNote/U_B2AG_PostId eq WeatherStation/Code and (${locationsFilter}) and WeatherNote/U_B2AG_RegisterDate ge '${filters.initalDate}' and WeatherNote/U_B2AG_RegisterDate le '${filters.finalDate}'`

    const query = new Api()
        .setMethod('Post')
        .setUrl('/QueryService_PostQuery')
        .setData({
            QueryPath: "$crossjoin(WeatherNote,WeatherNote/B2AG_WSN1Collection,WeatherStation)",
            QueryOption: `$expand=WeatherNote($select=DocEntry,DocNum,Status,Canceled,U_B2AG_RegisterDate,U_B2AG_Comments,U_B2AG_PostId),WeatherNote/B2AG_WSN1Collection($select=LineId,U_B2AG_Element,U_B2AG_Value),WeatherStation($select=Name,U_B2AG_ProductionUnitCode)&$filter=${filterQuery}&$orderby=WeatherNote/U_B2AG_RegisterDate desc`
        })
        .get()

    const data = await doApiCall(query)
    return data.value
}
