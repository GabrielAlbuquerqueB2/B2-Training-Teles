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

export function mapWarehousesToSelectComponent(items) {
    
    return items.map((item) => {
        return {
            value: item.WarehouseCode,
            description: item.WarehouseName
        }
    })
}

export async function getWarehouses(productionUnitCode) {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/Warehouses')
        .setParams({
            $select: 'WarehouseCode,WarehouseName,Location,U_B2AG_BusinessPartner,BusinessPlaceID',
            $filter: `Location eq ${productionUnitCode} and U_B2AG_AgriOperation eq 'A'`
        })
        .get()

    const result = await doApiCall(query)
    const data = mapWarehousesToSelectComponent(result.value)
    return data
}