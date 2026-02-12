import { getBusinessPartnerByCardCode } from './GoodsReceivedNoteServices'

export async function createPurchaseDeliveryNotesModel(data, contract, transferNotes) {

    const bp = await getBusinessPartnerByCardCode(contract.CardCode)
    const address = bp.BPAddresses.filter(add => {
        return add.AddressName === contract.U_B2AG_SupplierAddressId 
        && add.AddressType === 'bo_BillTo'
    })
    const add = address[0]

    let remarks = ''
    contract.B2AG_GPC1Collection[0].U_B2AG_OpeningRemarks ? remarks += contract.B2AG_GPC1Collection[0].U_B2AG_OpeningRemarks : ''
    data.U_B2AG_Driver ? remarks += ` - MOTORISTA: ${data.U_B2AG_Driver}` : ''
    data.U_B2AG_Comments ? remarks += ` - ${data.U_B2AG_Comments}` : ''
    
    return {
        BPL_IDAssignedToInvoice: contract.U_B2AG_Branch,
        CardCode: contract.CardCode,        
        JournalMemo: `B2Agri - Recebimento de Grãos (${data.DocNum})`,
        U_B2AG_Crop: data.U_B2AG_Crop,
        U_B2AG_B2ObjectType: 'GoodsReceivedNote',
        U_B2AG_ObjectEntry: data.DocNum,
        U_B2AG_Driver: data.U_B2AG_Driver,
        PayToCode: contract.U_B2AG_SupplierAddressId,
        U_B2AG_TareWeight: data.U_B2AG_TareWeight,
        U_B2AG_GrossWeight: data.U_B2AG_GrossWeight,
        U_B2AG_LiquidWeight: data.U_B2AG_LiquidWeight,
        OpeningRemarks: remarks,
        ClosingRemarks: contract.B2AG_GPC1Collection[0].U_B2AG_ClosingRemarks,
        SequenceCode: contract.U_B2AG_SequenceCode,
        U_Motorista: data.U_B2AG_Driver,
        NumAtCard: `ROMANEIO: ${data.DocNum}`,
        TaxExtension: {
            Incoterms: contract.U_B2AG_Incoterms,
            Vehicle: data.U_B2AG_LicensePlate,
            VehicleState: data.U_B2AG_PlateFederalUnit,
            Carrier: data.U_B2AG_ShippingCompany,
            State: add.State,
            County: add.County,
            TaxId1: add.U_TX_IE
        },
        DocumentLines: [{
            ItemCode: contract.B2AG_GPC1Collection[0].U_B2AG_ItemCode,
            Quantity: data.U_B2AG_LiquidWeight,
            UnitPrice: contract.B2AG_GPC1Collection[0].U_B2AG_Pauta,
            TaxCode: contract.B2AG_GPC1Collection[0].U_B2AG_TaxCode,
            WarehouseCode: contract.B2AG_GPC1Collection[0].U_B2AG_Warehouse,
            Usage: contract.B2AG_GPC1Collection[0].U_B2AG_Usage.split(' - ')[0],
            U_B2AG_Variety: data.B2AG_SDL1Collection[0].U_B2AG_Variety,
			U_B2AG_Field: data.B2AG_SDL1Collection[0].U_B2AG_Field,
        }],
        DocumentReferences: [
            {
                RefDocEntr: transferNotes,
                RefObjType: 'rot_GoodsReceiptPO'
            }
        ]
    }
}

export async function createPurchaseDeliveryNotesThirdModel(data, contract, invoiceData) {
    console.log(contract, data)

    const bp = await getBusinessPartnerByCardCode(contract.CardCode)
    const address = bp.BPAddresses.filter(add => {
        return add.AddressName === contract.PayToCode 
        && add.AddressType === 'bo_BillTo'
    })
    const add = address[0]

    let remarks = ''
    data.U_B2AG_Driver ? remarks += ` - MOTORISTA: ${data.U_B2AG_Driver}` : ''
    data.U_B2AG_Comments ? remarks += ` - ${data.U_B2AG_Comments}` : ''
    
    return {
        BPL_IDAssignedToInvoice: contract.BPL_IDAssignedToInvoice,
        DocDate: invoiceData.dateInvoice,
        CardCode: contract.CardCode,        
        JournalMemo: `B2Agri - Originação de Grãos (${data.DocNum})`,
        U_B2AG_Crop: data.U_B2AG_Crop,
        U_B2AG_B2ObjectType: 'GoodsReceivedNote',
        U_B2AG_ObjectEntry: data.DocNum,
        U_B2AG_Driver: data.U_B2AG_Driver,
        PayToCode: contract.PayToCode,
        U_B2AG_TareWeight: data.U_B2AG_TareWeight,
        U_B2AG_GrossWeight: data.U_B2AG_GrossWeight,
        U_B2AG_LiquidWeight: data.U_B2AG_LiquidWeight,
        OpeningRemarks: remarks,
        SequenceCode: '-2',
        SequenceSerial: invoiceData.numberInvoice,
        SeriesString: invoiceData.serialInvoice,
        //SequenceModel: '39',
        U_ChaveAcesso: invoiceData.accessKeyInvoice,
        U_Motorista: data.U_B2AG_Driver,
        //NumAtCard: `ROMANEIO: ${data.DocNum}`,
        TaxExtension: {
            Incoterms: invoiceData.incoterms,
            Vehicle: data.U_B2AG_LicensePlate,
            VehicleState: data.U_B2AG_PlateFederalUnit,
            Carrier: data.U_B2AG_ShippingCompany,
            State: add.State,
            County: add.County,
            TaxId1: add.U_TX_IE
        },
        DocumentLines: [{
            ItemCode: contract.DocumentLines[0].ItemCode,
            Quantity: invoiceData.quantity,
            UnitPrice: invoiceData.unitPrice,
            BaseType: 22,
            BaseEntry: contract.DocEntry,
            BaseLine: contract.DocumentLines[0].LineNum,
            TaxCode: contract.DocumentLines[0].TaxCode,
            WarehouseCode: contract.DocumentLines[0].WarehouseCode,
            Usage: contract.DocumentLines[0].Usage,
            U_B2AG_Variety: data.B2AG_GRN1Collection[0].U_B2AG_Variety,
			U_B2AG_Field: data.B2AG_GRN1Collection[0].U_B2AG_Field,
            BatchNumbers: [
                { 
                    BatchNumber: data.U_B2AG_Batch ? data.B2AG_GRN1Collection[0].U_B2AG_Variety : null,
                    Quantity: data.U_B2AG_Batch ? invoiceData.quantity : null
                }]
        }]
    }
}