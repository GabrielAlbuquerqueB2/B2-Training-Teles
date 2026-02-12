import axios from 'axios'
import Api from '../../../lib/api'

export function mapDataToSelectComponent(items) {
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

export async function getHarvestTicketById(id) {
    const query = new Api()
        .setMethod('GET')
        .setUrl(`/HarvestTicket(${id})`)
        .get()

    const data = await doApiCall(query)
    return data
}

export async function getAllCrops() {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/Crop')
        .get()

    const data = await doApiCall(query)
    return mapDataToSelectComponent(data.value)
}

export async function getAllAgriOperations() {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/AgriOperation')
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

export async function getFieldsByProductionUnit(id) {
    const query = new Api()
        .setMethod('GET')
        .setUrl(`/ProductionUnit('${id}')`)
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

export async function getAllCultivations() {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/Cultivation')
        .get()

    const data = await doApiCall(query)
    return data.value
}

export async function getCultivationById(id) {

    if (id) {
        const query = new Api()
            .setMethod('GET')
            .setUrl(`/Cultivation('${id}')`)
            .get()

        const data = await doApiCall(query)
        return data
    }
}

export async function getAnalysesByCultivation(id) {

    if (id) {
        const query = new Api()
            .setMethod('GET')
            .setUrl(`/AnalisysType?$filter=U_B2AG_Cultivation eq '${id}'`)
            .get()

        const data = await doApiCall(query)
        return data.value
    }
}

export async function getBatchesByCultivation(cultivation) {

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/$crossjoin(Cultivation,BatchNumberDetails)?$expand=Cultivation($select=Code,Name),BatchNumberDetails($select=DocEntry,Batch)&$filter=Cultivation/U_B2AG_ItemCode eq BatchNumberDetails/ItemCode and BatchNumberDetails/Status eq 'bdsStatus_Released' and Cultivation/Code eq '${cultivation}'`)
        .get()

    const data = await doApiCall(query)
    return data.value
}

export async function createHarvestTicket(harvestTicket) {
    const query = new Api()
        .setMethod('POST')
        .setUrl('/HarvestTicket')
        .setData(harvestTicket)
        .get()

    const result = await doApiCall(query)
    if (result.status === 400) {
        const errorMessage = result ? result.data.message.value : 'Unknown error'
        throw new Error(errorMessage)
    }
    return result
}

export async function updateHarvestTicket(id, harvestTicket) {
    const query = new Api()
        .setMethod('PATCH')
        .setUrl(`/HarvestTicket(${id})`)
        .setData(harvestTicket)
        .get()

        const result = await doApiCall(query)
        if (result.status === 400) {
            const errorMessage = result ? result.data.message.value : 'Unknown error'
            throw new Error(errorMessage)
        }
        return result
}

export async function cancelHarvestTicket(id) {
    const query = new Api()
        .setMethod('POST')
        .setUrl(`/HarvestTicket(${id})/Cancel`)
        .get()

        const result = await doApiCall(query)
        if (result.status === 400) {
            const errorMessage = result ? result.data.message.value : 'Unknown error'
            throw new Error(errorMessage)
        }
        return result
}

export async function closeHarvestTicket(id) {
    const query = new Api()
        .setMethod('POST')
        .setUrl(`/HarvestTicket(${id})/Close`)
        .get()

        const result = await doApiCall(query)
        if (result.status === 400) {
            const errorMessage = result ? result.data.message.value : 'Unknown error'
            throw new Error(errorMessage)
        }
        return result
}

export function getTicketTypes() {
    return [
        { value: "OwnWarehouse", description: "Remessa Armazém Próprio" },
        { value: "ThirdPartyWarehouse", description: "Remessa Armazém de Terceiro" },
        { value: "SeedShipment", description: "Remessa Destinada a Semente" }
    ]
}

export async function createStockTransfer(stockTransfer) {
    const query = new Api()
        .setMethod('POST')
        .setUrl('/StockTransfers')
        .setData(stockTransfer)
        .get()

        const result = await doApiCall(query)
        if (result.status === 400 || result.status === 403) {
            const errorMessage = result ? result.data.message.value : 'Unknown error'
            throw new Error(errorMessage)
        }
        return result
}

export async function createDeliveryNote(deliveryNote) {
    const query = new Api()
        .setMethod('POST')
        .setUrl('/DeliveryNotes')
        .setData(deliveryNote)
        .get()

        const result = await doApiCall(query)
        if (result.status === 400) {
            const errorMessage = result ? result.data.message.value : 'Unknown error'
            throw new Error(errorMessage)
        }
        return result
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

export async function getAllHarvestTicketsWithDetails(locations, filters = {}) {
    const locationsFilter = locations.map(id => {
        return `HarvestTicket/U_B2AG_ProductionUnitCode eq '${id}'`
    }).join(' or ')

    let filterQuery = `HarvestTicket/U_B2AG_Cultivation eq Cultivation/Code and (${locationsFilter}) and HarvestTicket/U_B2AG_Date ge '${filters.initalDate}' and HarvestTicket/U_B2AG_Date le '${filters.finalDate}'`

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/$crossjoin(HarvestTicket,Cultivation)?$expand=HarvestTicket($select=DocNum,U_B2AG_CCG,Canceled,Status,U_B2AG_Date,U_B2AG_TicketNumber,U_B2AG_Cultivation,U_B2AG_GrossWeight,U_B2AG_LiquidWeight,U_B2AG_Driver,U_B2AG_LicensePlate),Cultivation($select=Name)&$filter=${filterQuery}&$orderby=HarvestTicket/DocNum desc`)
        .get()

    const data = await doApiCall(query)
    const result = mapHarvestTicketsList(data)
    return result
}

function mapHarvestTicketsList(data) {
    if (!data || !data.value || !Array.isArray(data.value)) {
        return []
    }
    return data.value.map(item => {
        return {
            ...item.HarvestTicket,
            ...item.Cultivation
        }
    })
}

export async function getDeliveryPlacesByWarehouseCode(warehouseCode) {
    const query = new Api()
        .setMethod('POST')
        .setUrl('/QueryService_PostQuery')
        .setData({
            QueryPath: `$crossjoin(Warehouses,BusinessPartners,BusinessPartners/BPAddresses)`,
            QueryOption: `$expand=Warehouses($select=U_B2AG_BusinessPartner),BusinessPartners($select=CardCode,CardName),BusinessPartners/BPAddresses($select=RowNum,AddressName)&$filter=Warehouses/U_B2AG_BusinessPartner eq BusinessPartners/CardCode and BusinessPartners/CardCode eq BusinessPartners/BPAddresses/BPCode and Warehouses/WarehouseCode eq '${warehouseCode}'`
        })
        .get()

    const data = await doApiCall(query)
    const mappedData = mapDeliveryPlaces(data.value)
    return mappedData
}

function mapDeliveryPlaces(deliveryPlaces) {
    return deliveryPlaces.map(item => {
        return {
            value: '' + item['BusinessPartners/BPAddresses'].RowNum,
            description: item['BusinessPartners/BPAddresses'].AddressName
        }
    })
}

export async function getVarietiesByCultivation(id) {

    if (id) {
        const query = new Api()
            .setMethod('GET')
            .setUrl(`/Items`)
            .setParams({
                $select: 'ItemCode,U_B2AG_VarietyDescription',
                $filter: `U_B2AG_CultivationCode eq '${id}'`
            })
            .get()

        const data = await doApiCall(query)
        return mapVarietiesToSelect(data.value)
    }
}

function mapVarietiesToSelect(varieties) {
    return varieties.map(item => {
        return {
            value: '' + item.U_B2AG_VarietyDescription,
            description: item.U_B2AG_VarietyDescription
        }
    })
}

export async function getFieldWarehouseByBranchId(id) {

    if (id) {
        const query = new Api()
            .setMethod('GET')
            .setUrl(`/BusinessPlaces?$filter=BPLID eq ${id}`)
            .get()

        const data = await doApiCall(query)
        return data.value[0]
    }
}

export async function getWarehouseById(id) { 
    if (id) {
        const query = new Api()
            .setMethod('GET')
            .setUrl(`/Warehouses('${id}')`)
            .get()

        const data = await doApiCall(query)
        return data
    }
}

export async function getBusinessPartners(CardCode) {
    
        if (CardCode) {
            const query = new Api()
                .setMethod('GET')
                .setUrl(`/BusinessPartners('${CardCode}')`)
                .get()
    
            const data = await doApiCall(query)
            return data
        }
    
}

export async function getBranchByLocationId(id) {

    if (id) {
        const query = new Api()
            .setMethod('GET')
            .setUrl(`/BusinessPlaces?$filter=GlobalLocationNumber eq '${id}'`)
            .get()

        const data = await doApiCall(query)
        const result = data.value?.map(item => {
            return {
                value: item.BPLID,
                description: item.BPLName
            }
        })
        return result
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
    return data.value[0]
}

export async function getHarvestTicketReport(id, user) {
    const reportId = JSON.parse(sessionStorage.getItem("GeneralParams")).HarvestTicketReport
    const apiGatewayData = {
        params: { DocCode: reportId },
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

export async function getStockTransferByRef2(id) {
    const query = new Api()
        .setMethod('GET')
        .setUrl(`/StockTransfers?$filter=Reference2 eq '${id}'`)
        .get()

    const data = await doApiCall(query)
    return data.value
}

export async function getDeliveryNoteByRef2(id) {
    const query = new Api()
        .setMethod('GET')
        .setUrl(`/DeliveryNotes?$filter=Reference2 eq '${id}' and U_B2AG_B2ObjectType eq 'ThirdPartyWarehouse'`)
        .get()

    const data = await doApiCall(query)
    return data.value
}

export async function getInventoryGenExitByRef2(id) {
    const query = new Api()
        .setMethod('GET')
        .setUrl(`/InventoryGenExits?$filter=Reference2 eq '${id}'`)
        .get()

    const data = await doApiCall(query)
    return data.value
}