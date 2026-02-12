import { getYearMonthDateFormat } from '../../../../utils/formatDate'

export async function createPurchaseDeliveryNotesModel(data, deliveryNote) {

    const destinationBranch = data.U_B2AG_DestinationBranch.split(' - ')[0]
    const shipping = data.Carrier ? data.Carrier.split(' - ')[0] : ''

    const getLinesWithValue = (collection) => {
        const promises = collection.map(async (item) => {
            const usage = data.B2AG_TFO2Collection[0].U_B2AG_Usage.split(' - ')[0]
            const warehouse = data.B2AG_TFO2Collection[0].U_B2AG_Warehouse
            const taxCode = data.B2AG_TFO2Collection[0].U_B2AG_TaxCode
            return {
                ItemCode: item.ItemCode,
                Quantity: item.Quantity,
                UnitPrice: item.UnitPrice,
                TaxCode: taxCode,
                WarehouseCode: warehouse,
                Usage: usage,
                BatchNumbers: [
                    { 
                        BatchNumber: data.B2AG_TFO2Collection[0].U_B2AG_Batch ? data.B2AG_TFO2Collection[0].U_B2AG_Batch : null,
                        Quantity: data.B2AG_TFO2Collection[0].U_B2AG_Batch ? item.Quantity : null
                    }],
            }
        });
        return Promise.all(promises);
    }

    const documentLines = await getLinesWithValue(deliveryNote.DocumentLines)
    
    return {
        BPL_IDAssignedToInvoice: destinationBranch,
        CardCode: data.DefaultVendorID,        
        JournalMemo: `B2Agri - Transferência de Estoque (${data.DocNum})`,
        U_B2AG_B2ObjectType: 'TransferOrders',
        U_B2AG_ObjectEntry: data.DocNum,
        U_B2AG_Driver: deliveryNote.U_B2AG_Driver,
        PayToCode: data.U_B2AG_SupplierAddressId,
        U_B2AG_TareWeight: data.TareWeight,
        U_B2AG_GrossWeight: data.GrossWeight,
        U_B2AG_LiquidWeight: data.LiquidWeight,
        OpeningRemarks: data.B2AG_TFO2Collection[0].U_B2AG_OpeningRemarks,
        ClosingRemarks: data.B2AG_TFO2Collection[0].U_B2AG_ClosingRemarks,
        SequenceCode: -2,
        SequenceSerial: deliveryNote.SequenceSerial,
        SeriesString: deliveryNote.SeriesString,
        SequenceModel: deliveryNote.SequenceModel,
        U_ChaveAcesso: data.U_ChaveAcesso,
        TaxDate: getYearMonthDateFormat(deliveryNote.TaxDate),
        DocDate: data.U_B2AG_Date,
        TaxExtension: {
            Incoterms: deliveryNote.TaxExtension.Incoterms,
            Vehicle: deliveryNote.TaxExtension.Vehicle,
            VehicleState: deliveryNote.TaxExtension.VehicleState,
            State: deliveryNote.TaxExtension.State, //TO DO - Alterar Estado do Fornecedor
            County: data.County,
            Carrier: shipping
        },
        DocumentLines: documentLines
    }
}