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

export async function getWarehousesByLocation(location) {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/Warehouses')
        .setParams({
            $select: 'WarehouseCode,WarehouseName,Location,BusinessPlaceID',
            $filter: `Location eq ${location}`
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

export function getEquipmentTypes() {
    return [
        { value: 'P', description: 'Próprio' },
        { value: 'T', description: 'Terceiro' },
        { value: 'C', description: 'Colaborador' },
    ]
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

export async function getAllCultivations() {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/Cultivation')
        .get()

    const result = await doApiCall(query)
    const data = mapDataToSelectComponent(result.value)
    return data
}

// TO-DO: Mapear grupos de item para parametros
export function getFuelOrLubrificationTypes() {
    return [
        { value: 109, description: 'Abastecimento' },
        { value: 110, description: 'Lubrificação' },
    ]
}

export async function getProfitCentersInFirstDimension() {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/ProfitCenters')
        .setParams({
            $select: 'CenterCode,CenterName',
            $filter: `Active eq 'tYES' and InWhichDimension eq 1`
        })
        .get()

    const data = await doApiCall(query)
    return data.value.map(item => {
        return {
            value: item.CenterCode,
            description: `${item.CenterCode} - ${item.CenterName}`
        }
    })
}

export async function getItemAveragePriceInWarehouse(itemCode, warehouseCode) {
    const query = new Api()
        .setMethod('POST')
        .setUrl('/QueryService_PostQuery')
        .setData({
            QueryPath: "$crossjoin(Items,Items/ItemWarehouseInfoCollection)",
            QueryOption: `$expand=Items($select=ItemCode),Items/ItemWarehouseInfoCollection($select=StandardAveragePrice,DefaultBin)&$filter=Items/ItemCode eq Items/ItemWarehouseInfoCollection/ItemCode and Items/ItemCode eq '${itemCode}' and Items/ItemWarehouseInfoCollection/WarehouseCode eq '${warehouseCode}'`
        })
        .get()

    const data = await doApiCall(query)
    return data.value[0]
}

export async function creatInventoryGenExit(inventoryExit) {
    const query = new Api()
        .setMethod('POST')
        .setUrl('/InventoryGenExits')
        .setData(inventoryExit)
        .get()

        const result = await doApiCall(query)
        if (result.status === 400 || result.status === 404) {
            const errorMessage = result ? result.data.message.value : 'Unknown error'
            throw new Error(errorMessage)
        }
        return result
}

export async function getWarehouseExitGenExits(locationsIds, filters = {}) {
    const locationsFilter = locationsIds.map(id => {
        return `Warehouses/Location eq ${id}`
    }).join(' or ')

    let baseFilter = `InventoryGenExits/DocEntry eq InventoryGenExits/DocumentLines/DocEntry and InventoryGenExits/DocumentLines/WarehouseCode eq Warehouses/WarehouseCode and InventoryGenExits/DocumentLines/LineNum eq 0 and InventoryGenExits/U_B2AG_B2ObjectType eq 'WarehouseExit' and (${locationsFilter}) and InventoryGenExits/DocDate ge '${filters.initalDate}' and InventoryGenExits/DocDate le '${filters.finalDate}'`

    const query = new Api()
        .setMethod('Post')
        .setUrl('/QueryService_PostQuery')
        .setData({
            QueryPath: "$crossjoin(InventoryGenExits,InventoryGenExits/DocumentLines,Warehouses)",
            QueryOption: `$expand=InventoryGenExits($select=DocEntry,DocNum,DocDate,Comments,U_B2AG_Crop,U_B2AG_Equipment,U_B2AG_Odometer,U_B2AG_Operator),InventoryGenExits/DocumentLines($select=ItemCode,ItemDescription,Quantity),Warehouses($select=WarehouseName)&$filter=${baseFilter}&$orderby=InventoryGenExits/DocDate desc`
        })
        .get()

    const data = await doApiCall(query)
    return data.value
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

export async function getAllPurchaseDeliveryNotes() {

    let query = new Api()
        .setMethod('GET')
        .setUrl('/PurchaseDeliveryNotes')
        .setParams({
            $select: 'DocEntry,DocNum,SequenceSerial,BPLName,Comments',
            $filter: `U_B2AG_WhsExit eq 'Y'`
        })
        .get()

    const data = await doApiCall(query)   

    return data.value.map((item) => {
        return {
            value: item.DocEntry,
            description: `${item.DocNum} - NF: ${item.SequenceSerial} - ${item.BPLName} - ${item.Comments}`,
        }
    })
}

export async function getPurchaseDeliveryNotesById(id) {

    let query = new Api()
        .setMethod('GET')
        .setUrl(`/PurchaseDeliveryNotes(${id})`)
        .get()

    const data = await doApiCall(query)   
    return data
}

export async function closeWarehouseExitFieldInPurchasewDeliveryNote(id) {

    let query = new Api()
        .setMethod('PATCH')
        .setUrl(`/PurchaseDeliveryNotes(${id})`)
        .setData({U_B2AG_WhsExit: 'B'})
        .get()

    const data = await doApiCall(query)   
    return data
}