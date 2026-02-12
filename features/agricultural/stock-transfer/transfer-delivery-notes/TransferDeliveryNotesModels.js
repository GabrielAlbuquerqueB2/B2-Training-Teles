import { getItemAveragePriceInWarehouse } from './TransferDeliveryNotesServices'

export async function createDeliveryNotesModel(data, shipping) {

    const originBranch = data.U_B2AG_OriginBranch.split(' - ')[0] 
    const usageCode = data.B2AG_TFO1Collection[0].U_B2AG_Usage.split(' - ')[0]
    const sequenceCode = verifyUsageToInternalDocument(usageCode)

    const getLinesWithValue = (collection) => {
        const promises = collection.map(async (item) => {
            const usage = item.U_B2AG_Usage.split(' - ')[0]            
            let cost = 0
            if(item.U_B2AG_BasePrice === 'C') {
                cost = await getItemAveragePriceInWarehouse(item.U_B2AG_ItemCode, item.U_B2AG_Warehouse)
            } else {
                cost = item.U_B2AG_Pauta
            }            
            return {
                ItemCode: item.U_B2AG_ItemCode,
                Quantity: item.Quantity,
                UnitPrice: cost,
                WarehouseCode: item.U_B2AG_Warehouse,
                Usage: usage,
                U_B2AG_Variety: item.U_B2AG_Variety,
                TaxCode: item.U_B2AG_TaxCode,
                BatchNumbers: [
                    { 
                        BatchNumber: item.U_B2AG_Batch ? item.U_B2AG_Batch : null,
                        Quantity: item.U_B2AG_Batch ? item.Quantity : null
                    }],
            }
        });
        return Promise.all(promises);
    }

    const documentLines = await getLinesWithValue(data.B2AG_TFO1Collection)

    let openingRemarks =  ''
    data.B2AG_TFO1Collection[0].U_B2AG_OpeningRemarks ? openingRemarks += data.B2AG_TFO1Collection[0].U_B2AG_OpeningRemarks : ''
    openingRemarks && data.Driver ? openingRemarks += ' - ' : ''
    data.Driver ? openingRemarks += `Motorista: ${data.Driver}` : '' 

    return {
        BPL_IDAssignedToInvoice: originBranch,
        CardCode: data.DefaultCustomerID,        
        JournalMemo: `B2Agri - Transferência de Estoque (${data.DocNum})`,
        U_B2AG_B2ObjectType: 'TransferOrders',
        U_B2AG_ObjectEntry: data.DocNum,
        U_B2AG_Driver: data.Driver,
        ShipToCode: data.U_B2AG_CustomerAddressId,
        PayToCode: data.U_B2AG_CustomerAddressId,
        U_B2AG_TareWeight: data.TareWeight,
        U_B2AG_GrossWeight: data.GrossWeight,
        U_B2AG_LiquidWeight: data.LiquidWeight,
        U_B2AG_Crop: data.U_B2AG_Crop,
        U_B2AG_Cultivation: data.U_B2AG_Cultivation,
        U_B2AG_DeliveryType: data.U_B2AG_DeliveryType,
        OpeningRemarks: openingRemarks,
        ClosingRemarks: data.B2AG_TFO1Collection[0].U_B2AG_ClosingRemarks,        
        SequenceCode: sequenceCode, 
        TaxExtension: {
            Incoterms: data.U_B2AG_Incoterms,
            Vehicle: data.LicensePlate,
            VehicleState: data.PlateFederalUnit,
            State: data.State,
            County: data.County,
            Carrier: shipping.id,
            TaxId1: data.FederalTaxID2,
            NetWeight: data.LiquidWeight,
		    GrossWeight: data.LiquidWeight
        },
        DocumentLines: documentLines
    }
}

function verifyUsageToInternalDocument(usage) {
    if(usage === '18') {
        return 34
    }
    return null
}