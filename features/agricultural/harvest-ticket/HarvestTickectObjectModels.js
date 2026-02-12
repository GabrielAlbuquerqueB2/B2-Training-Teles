import { getFieldWarehouseByBranchId, getCultivationById, getItemAveragePriceInWarehouse, getBusinessPartners, getWarehouseById } from './HarvestTicketServices'

export async function inventoryTransferObject(data) {
    const bplid = await getFieldWarehouseByBranchId(data.U_B2AG_BPLId)

    const stockTransferLines = await inventoryTransferLines(data, bplid)

    let obj = {
        BPLID: data.U_B2AG_BPLId,
        DocDate: data.U_B2AG_Date,
        Reference2: data.DocNum,
        FromWarehouse: bplid.U_B2AG_WhsField,
        ToWarehouse: data.U_B2AG_DestinationWhs,
        Comments: data.U_B2AG_Comments,
        JournalMemo: `B2Agri - Remessa para armazem (Romaneio: ${data.DocNum})`,
        U_B2AG_B2ObjectType: data.U_B2AG_B2ObjectType,
        U_B2AG_Crop: data.U_B2AG_Crop,
        StockTransferLines: stockTransferLines
    }

    return obj
}

async function inventoryTransferLines(data, bplid) {

    const cultivation = await getCultivationById(data.U_B2AG_Cultivation)

    return data.B2AG_PKL1Collection.map(item => {
        return (
            {
                ItemCode: cultivation.U_B2AG_ItemCode,
                WarehouseCode: data.U_B2AG_DestinationWhs,
                FromWarehouseCode: bplid.U_B2AG_WhsField,
                Quantity: item.U_B2AG_Quantity,
                U_B2AG_Variety: item.U_B2AG_Variety,
                U_B2AG_Field: item.U_B2AG_Field,
                BatchNumbers: [
                    { 
                        BatchNumber: data.U_B2AG_Batch ? item.U_B2AG_Variety : null,
                        Quantity: data.U_B2AG_Batch ? item.U_B2AG_Quantity : null
                    }
                ]
            }
        )
    })
}

export async function deliveryNoteObject(data, quantity, Incoterms, unitPrice, ClosingRemarks) {

    const details = await deliveryNotesDetails(data)
    const obj = {
        BPL_IDAssignedToInvoice: data.U_B2AG_BPLId,
        CardCode: details.CardCode,
        ShipToCode: details.ShipToCode,
        Carrier: data.U_B2AG_ShippingCompany,
        JournalMemo: 'Remessa para armazem (Romaneio: ' + data.DocNum + ')',
        ClosingRemarks: ClosingRemarks,
        Reference2: data.DocNum,
        Comments: data.U_B2AG_Comments,
        U_B2AG_B2ObjectType: data.U_B2AG_B2ObjectType,
        U_B2AG_Crop: data.U_B2AG_Crop,
        TaxExtension: {
            Incoterms: Incoterms,
            Vehicle: data.U_B2AG_LicensePlate,
            VehicleState: data.U_B2AG_PlateFederalUnit,

        },
        DocumentLines: [
            {
                ItemCode: details.ItemCode,
                Quantity: quantity,
                WarehouseCode: details.WarehouseCode,
                LineTotal: quantity * unitPrice,
                FreeText: data.U_B2AG_Batch,
                //TO-DO CORRECAO USAGE POR PARAMETRO
                Usage: 17,
            }
        ]
    }

    return obj
}

async function deliveryNotesDetails(data){
    const bplid = await getFieldWarehouseByBranchId(data.U_B2AG_BPLId)
    const cultivation = await getCultivationById(data.U_B2AG_Cultivation)
    const avgPrice = await getItemAveragePriceInWarehouse(cultivation.U_B2AG_ItemCode, bplid.U_B2AG_WhsField)
    const whsDestination = await getWarehouseById(data.U_B2AG_DestinationWhs)
    //const businessPartner = await getBusinessPartners(whsDestination.U_B2AG_BusinessPartner)

    return (
        {
            ItemCode: cultivation.U_B2AG_ItemCode,
            WarehouseCode: bplid.U_B2AG_WhsDropShip,
            UnitPrice: avgPrice['Items/ItemWarehouseInfoCollection'].StandardAveragePrice,
            CardCode: whsDestination.U_B2AG_BusinessPartner,
            ShipToCode: whsDestination.U_B2AG_CustomerAddressId,
        }
    )
}

export async function inventoryGenExitObject(data) {

    const documentLines = await createInventoryGenExitsLines(data)

    let obj = {
        BPL_IDAssignedToInvoice: data.U_B2AG_BPLId,
        Reference2: data.DocNum,
        DocDate: data.U_B2AG_Date,
        Comments: data.U_B2AG_Comments,
        JournalMemo: `B2Agri - Remessa destinada a semente (Romaneio: ${data.DocNum})`,
        U_B2AG_B2ObjectType: data.U_B2AG_B2ObjectType,
        U_B2AG_Crop: data.U_B2AG_Crop,
        DocumentLines: documentLines
    }
    return obj
}

async function createInventoryGenExitsLines(data) {

    const bplid = await getFieldWarehouseByBranchId(data.U_B2AG_BPLId)
    const cultivation = await getCultivationById(data.U_B2AG_Cultivation)
    const avgPrice = await getItemAveragePriceInWarehouse(cultivation.U_B2AG_ItemCode, bplid.U_B2AG_WhsField)

    return data.B2AG_PKL1Collection.map(item => {
        return (
            {
                ItemCode: cultivation.U_B2AG_ItemCode,
                WarehouseCode: bplid.U_B2AG_WhsField,
                Quantity: item.U_B2AG_Quantity,
                UnitPrice: avgPrice['Items/ItemWarehouseInfoCollection'].StandardAveragePrice,
                U_B2AG_Variety: item.U_B2AG_Variety,
                U_B2AG_Field: item.U_B2AG_Field,
                BatchNumbers: [
                    {
                        BatchNumber: data.U_B2AG_Batch ? item.U_B2AG_Variety : null,
                        Quantity: data.U_B2AG_Batch ? item.U_B2AG_Quantity : null
                    }
                ]
            }
        )
    })
}