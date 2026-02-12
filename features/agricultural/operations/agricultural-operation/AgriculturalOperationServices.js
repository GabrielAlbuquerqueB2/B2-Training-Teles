import axios from 'axios'
import Api from '../../../../lib/api'

export function mapDataToSelectComponent(items) {
    return items.map((item) => {
        return {
            value: item.Code,
            description: item.Name
        }
    })
}

export function mapFieldsToSelectComponent(items) {
    return items.map((item) => {
        return {
            value: item.U_B2AG_Code,
            description: item.U_B2AG_Code
        }
    })
}

export function mapWarehousesToSelectComponent(items) {
    
    return items.map((item) => {
        return {
            value: item.WarehouseCode,
            description: item.WarehouseName
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

    const data = await doApiCall(query)
    return data.value
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

export async function getAllOperations() {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/AgriOperation')
        .setParams({
            $orderby:'Name'
        })
        .get()

    const data = await doApiCall(query)
    return mapDataToSelectComponent(data.value)
}

export async function getWarehousesByLocation(location) {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/Warehouses')
        .setParams({
            $select: 'WarehouseCode,WarehouseName,Location,U_B2AG_BusinessPartner,BusinessPlaceID',
            $filter: `Location eq ${location}`
        })
        .get()

    const data = await doApiCall(query)
    return data.value.map(item => {
        return ({
            value: item.WarehouseCode,
            description: item.WarehouseName,
            U_B2AG_BusinessPartner: item.U_B2AG_BusinessPartner,
            BusinessPlaceID: item.BusinessPlaceID
        })
    })
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
    return data
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

export async function getBranchByWarehouseId(BPLID) {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/Warehouses')
        .setParams({
            $select: 'WarehouseCode,WarehouseName,BusinessPlaceID',
            $filter: `WarehouseCode eq '${BPLID}'`
        })
        .get()

    try {
        const result = await axios(query)
        return result.data.value[0]
    } catch (error) {
        return error
    }
}

export async function creatInventoryGenExit(inventoryExit) {
    const query = new Api()
        .setMethod('POST')
        .setUrl('/InventoryGenExits')
        .setData(inventoryExit)
        .get()

        const result = await doApiCall(query)
        if (result.status === 400) {
            const errorMessage = result ? result.data.message.value : 'Unknown error'
            throw new Error(errorMessage)
        }
        return result
}

/* export async function getAgriculturalOperationsExits() {
    const query = new Api()
        .setMethod('GET')
        .setUrl('/InventoryGenExits')
        .setParams({
            $select: 'DocEntry,DocNum,DocDate,Comments,U_B2AG_Crop,U_B2AG_PerformedArea,DocumentLines',
            $filter: `U_B2AG_B2ObjectType eq 'AgriOperation'`,
            $orderby: 'DocEntry desc'
        })
        .get()

    const data = await doApiCall(query)
    return data.value
} */

export async function getAgriculturalOperationsExits(branchesIds, filters) {
    // Remove branches filter from query - will filter in JavaScript
    const filterQuery = `InventoryGenExits/DocEntry eq InventoryGenExits/DocumentLines/DocEntry and InventoryGenExits/DocumentLines/WarehouseCode eq Warehouses/WarehouseCode and InventoryGenExits/DocumentLines/LineNum eq 0 and InventoryGenExits/U_B2AG_B2ObjectType eq 'AgriOperation' and InventoryGenExits/DocDate ge '${filters.initalDate}' and InventoryGenExits/DocDate le '${filters.finalDate}'`

    const query = new Api()
        .setMethod('Post')
        .setUrl('/QueryService_PostQuery')
        .setData({
            QueryPath: "$crossjoin(InventoryGenExits,InventoryGenExits/DocumentLines,Warehouses)",
            QueryOption: `$expand=InventoryGenExits($select=DocEntry,DocNum,DocDate,Comments,U_B2AG_Crop,U_B2AG_PerformedArea,U_RDA,BPL_IDAssignedToInvoice),InventoryGenExits/DocumentLines($select=ItemCode,ItemDescription,Quantity,U_B2AG_Field),Warehouses($select=WarehouseName,BusinessPlaceID)&$filter=${filterQuery}&$orderby=InventoryGenExits/DocDate desc`
        })
        .get()

    const data = await doApiCall(query)
    
    if (!data || !data.value) {
        return []
    }

    // Filter by branches in JavaScript
    let result = data.value
    if (branchesIds && branchesIds.length > 0) {
        result = result.filter(item => branchesIds.includes(item.Warehouses.BusinessPlaceID))
    }
    
    return result
}