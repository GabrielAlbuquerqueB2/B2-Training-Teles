export function createPurchaseDeliveryNotesModel(data, purchaseOrder, expenses, addresses) {

    const docLines = mapDocumentLines(data.DocumentLines, purchaseOrder)

    const exps = expenses.filter(exp => {
        if(!exp) return false;
        return exp.LineTotal > 0
    })

    const address = addresses.filter(addr => {
        return addr.value === data.PayToCode
    })

    const finalPurchaseDeliveryNote = {
        DocDate: data.DocDate,
        BPL_IDAssignedToInvoice: purchaseOrder.BPL_IDAssignedToInvoice,
        CardCode: purchaseOrder.CardCode,
        SequenceCode: data.SequenceCode,
        SequenceSerial: data.SequenceSerial,
        SeriesString: data.SeriesString,
        U_ChaveAcesso: data.U_ChaveAcesso,  
        U_nfe_ChaveAcesso: data.U_ChaveAcesso,    
        PayToCode: data.PayToCode,         
        Comments: data.Comments,
        DocumentAdditionalExpenses: exps,
        DocumentLines: docLines,
        //AttachmentEntry: attachmentResult ? attachmentResult.AbsoluteEntry : null,  
        TaxExtension: {
            Incoterms: data.Incoterms,
            Vehicle: data.Vehicle,
            VehicleState: data.VehicleState,
            State: address[0].State,
            County: address[0].County,
            TaxId0: address[0].U_FederalTaxId ? address[0].U_FederalTaxId : address[0].U_AGRT_CnpjFornecedor,
            TaxId1: address[0].U_TX_IE
        }
    }
    return finalPurchaseDeliveryNote

}

function mapDocumentLines(lines, po) {    
    return lines.map(line => {
        const docLine = {
            ItemCode: line.Item.id,
            Quantity: line.Quantity,
            Currency: 'R$',
            UnitPrice: line.Price,
            BaseEntry: po.DocEntry,
            BaseLine: line.LineNum,
            BaseType: po.DocObjectCode === 'oPurchaseOrders' ? 22 : 18,
            UoMEntry: line.UoM,
            WarehouseCode: line.WhsCode,
            DocumentLinesBinAllocations: []
        };

        if (line.U_B2AG_Batch) {
            docLine.BatchNumbers = [
                { 
                    BatchNumber: line.U_B2AG_Batch,
                    Quantity: line.Quantity
                }
            ];
        }

        return docLine;
    });
}

export function updatePurchaseDeliveryNotesModel(data) {
    
    const finalPurchaseDeliveryNote = {
       
        U_ChaveAcesso: data.U_ChaveAcesso,  
        U_nfe_ChaveAcesso: data.U_ChaveAcesso,    
        PayToCode: data.PayToCode,         
        Comments: data.Comments,
        TaxExtension: {
            Incoterms: data.Incoterms,
            Vehicle: data.Vehicle,
            VehicleState: data.VehicleState,
        }
    }

    return finalPurchaseDeliveryNote
}