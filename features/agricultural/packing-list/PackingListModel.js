export function createPackingListModel(data, shipping) {

    return {
        ...data,
        U_B2AG_ShippingCompany: shipping.id
    }    
}

export function createInvoiceModel(data, shipping, order, wtData) {

    let remarks = ''
    order.OpeningRemarks ? remarks += order.OpeningRemarks : ''
    data.U_B2AG_Driver ? remarks += ` - MOTORISTA: ${data.U_B2AG_Driver}` : ''
    data.U_B2AG_Comments ? remarks += ` - ${data.U_B2AG_Comments}` : ''

    const wt = mapWTtoInvoice(wtData, data.U_B2AG_LiquidWeight)
    const sequenceCode = verifyUsageToInternalDocument(order.DocumentLines[0].Usage)

    return  {
        DocDate: data.U_B2AG_Date,
        BPL_IDAssignedToInvoice: order.BPL_IDAssignedToInvoice,
        CardCode: order.CardCode,
        CardName: order.CardName,
        Comments: data.U_B2AG_Comments,  
        SequenceCode: sequenceCode,    
        //U_B2AG_Crop: data.U_B2AG_Crop, ADICIONAR CAMPO NO OBJETO 
        DocumentLines: [{
            ItemCode: order.DocumentLines[0].ItemCode,
            Quantity: data.U_B2AG_LiquidWeight,            
            BaseEntry: order.DocEntry,
            BaseLine: order.DocumentLines[0].LineNum,            
            BaseType: 17,
            UoMEntry: order.DocumentLines[0].UoMEntry,
            WarehouseCode: order.DocumentLines[0].WarehouseCode,
            WithholdingTaxLines: wt,
            BatchNumbers: [
                {
                    BatchNumber: data.U_B2AG_Batch,
                    Quantity: data.U_B2AG_LiquidWeight
                }]
        }],        
        TaxExtension: {
            Vehicle: data.U_B2AG_LicensePlate,
            VehicleState: data.U_B2AG_PlateFederalUnit,
            Carrier: data.U_B2AG_ShippingCompany,
            Incoterms: order.TaxExtension.Incoterms,
            NetWeight: data.U_B2AG_LiquidWeight,
            GrossWeight: data.U_B2AG_LiquidWeight + data.U_B2AG_PackingWeight,
        },
        OpeningRemarks: remarks

    }
}

function mapWTtoInvoice(wtData, liquidWeight) {

    const data = wtData.map(item => {
        if(item['WTCombination/B2AG_WHT1Collection'].U_B2AG_WTBase === 'VLR') {
            return {
                WTCode: item['WTCombination/B2AG_WHT1Collection'].U_B2AG_WTCode
            }
        } else {
            return {
                WTCode: item['WTCombination/B2AG_WHT1Collection'].U_B2AG_WTCode,
                WTAmount: (item.WithholdingTaxCodes.U_B2AG_Pauta * liquidWeight).toFixed(2)
            }
        }
       
    })

    return data

}

// TO-DO: Salvar parametros em arquivo atualizavel no backend
function verifyUsageToInternalDocument(usage) {
    if(usage === 18) {
        return 34
    }
    return null
}