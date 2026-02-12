import axios from 'axios'
import Api from '../../../lib/api'

export function mapDataToSelectComponent(items) {
    if (!items) return;

    return items.map((item) => {
        return {
            value: item.Code,
            description: item.Name
        }
    })
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
            return (error.response)
        })
}

export async function getAllProductionUnits() {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/ProductionUnit')
        .get()

    const result = await doApiCall(query)
    const data = mapDataToSelectComponent(result.value)
    return data
}

export async function getWarehousesByLocation(location, type) {
    if (type === 109) {
        const query = new Api()
            .setMethod('GET')
            .setUrl('/Warehouses')
            .setParams({
                $select: 'WarehouseCode,WarehouseName,Location,BusinessPlaceID',
                $filter: `Location eq ${location} and contains(WarehouseName, 'COMB')`
            })
            .get()

        const data = await doApiCall(query)
        return data.value.map(item => {
            return ({
                value: item.WarehouseCode,
                description: item.WarehouseName,
                BusinessPlaceID: item.BusinessPlaceID
            })
        })
    }
    else {

        const query = new Api()
            .setMethod('GET')
            .setUrl('/Warehouses')
            .setParams({
                $select: 'WarehouseCode,WarehouseName,Location,BusinessPlaceID',
                $filter: `Location eq ${location} and U_B2AG_AgriOperation eq 'A'`
            })
            .get()

        const data = await doApiCall(query)
        return data.value.map(item => {
            return ({
                value: item.WarehouseCode,
                description: item.WarehouseName,
                BusinessPlaceID: item.BusinessPlaceID
            })
        })
    }
}

export async function getItemInStockInWarehouse(itemCode, warehouseCode) {
    const query = new Api()
        .setMethod('POST')
        .setUrl('/QueryService_PostQuery')
        .setData({
            QueryPath: "$crossjoin(Items,Items/ItemWarehouseInfoCollection)",
            QueryOption: `$expand=Items/ItemWarehouseInfoCollection($select=InStock)&$filter=Items/ItemCode eq Items/ItemWarehouseInfoCollection/ItemCode and Items/ItemCode eq '${itemCode}' and Items/ItemWarehouseInfoCollection/WarehouseCode eq '${warehouseCode}'`
        })
        .get()

    const data = await doApiCall(query)
    return data.value[0]["Items/ItemWarehouseInfoCollection"].InStock
}

export async function getInventoryStock() {
    const query = new Api()
    .setMethod('POST')
    .setUrl('/QueryService_PostQuery')
    .setData({
        QueryPath: "$crossjoin(Items,Items/ItemWarehouseInfoCollection,Warehouses)",
        QueryOption: `$expand=Items($select=ItemCode, ItemName),Items/ItemWarehouseInfoCollection($select=WarehouseCode, InStock),Warehouses($select=WarehouseName)&$filter=Items/ItemCode eq Items/ItemWarehouseInfoCollection/ItemCode and Items/ItemWarehouseInfoCollection/WarehouseCode eq Warehouses/WarehouseCode and Items/ItemWarehouseInfoCollection/InStock gt 0`
    })
    .get()

const data = await doApiCall(query)
return data.value
}