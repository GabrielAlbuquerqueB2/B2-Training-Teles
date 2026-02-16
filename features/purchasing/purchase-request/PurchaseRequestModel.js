export function createPurchaseRequestModel(data, vendor, requester, equipment, attEntry) {

    const docLines = mapDocumentLines(data.DocumentLines, vendor, data.Usage)

    const comments = generateComments(data, vendor) 

    return {
        DocDate: data.DocDate,
        DocDueDate: data.DocDueDate,
        RequriedDate: data.RequriedDate,
        BPL_IDAssignedToInvoice: data.BPL_IDAssignedToInvoice,
        U_TX_NDfe: data.U_TX_NDfe,
        U_B2AG_Crop: data.U_B2AG_Crop,     
        ReqType: 171,
        Requester: requester.id,
        Comments: comments,
        U_B2AG_Equipment: `${equipment.id} - ${equipment.label}`,
        AttachmentEntry: attEntry ? attEntry.AbsoluteEntry : null,
        DocumentLines: docLines,
    }
}

function mapDocumentLines(lines, vendor, usage) {
    return lines.map(item => {
        return {
            ItemCode: item.Item.id,
            FreeText: item.FreeText,
            Quantity: item.Quantity,
            UnitPrice: item.UnitPrice,
            UoMEntry: item.UoMEntry || undefined,
            LineVendor: vendor.id,
            Usage: usage,
            WarehouseCode: item.WarehouseCode
        }
    })
        .filter(item => {
            return item.ItemCode && item.Quantity
        })
}

function generateComments(data, vendor) {
    let comment = ''
    if(data.Comments) {
        comment += data.Comments
    }
    if(vendor) {
        comment += ` - ${vendor.id} - ${vendor.label}`
    }
    if(data.U_TX_NDfe) {
        comment += ` - NF: ${data.U_TX_NDfe}`
    }
    return comment
}

export function editPurchaseRequestModel(data, vendor, requester, equipment, attEntry) {

    const docLines = mapDocumentLines(data.DocumentLines, vendor, data.Usage)

    const comments = generateComments(data, vendor) 
    let result =  {
        DocDate: data.DocDate,
        DocDueDate: data.DocDueDate,
        RequriedDate: data.RequriedDate,
        U_B2AG_Crop: data.U_B2AG_Crop,
        U_TX_NDfe: data.U_TX_NDfe,        
        ReqType: 171,
        Requester: requester.id,
        Comments: comments,
        U_B2AG_Equipment: `${equipment.id} - ${equipment.label}`,
        //AttachmentEntry: attEntry ? attEntry.AbsoluteEntry : null,
        DocumentLines: docLines,
    }

    if(!data.AttachmentEntry) {
        result = { ...result, AttachmentEntry: attEntry}
    }

    return result
}

export function createPurchaseOrderModel(data, requester, vendor, equipment) {

    const docLines = mapOrderDocumentLines(data)

    return {
        CardCode: data.DocumentLines[0].LineVendor,
        DocDate: data.DocDate,
        DocDueDate: data.DocDueDate,
        RequriedDate: data.RequriedDate,
        U_B2AG_Crop: data.U_B2AG_Crop,
        BPL_IDAssignedToInvoice: data.BPL_IDAssignedToInvoice,
        U_TX_NDfe: data.U_TX_NDfe,        
        ReqType: 171,
        Requester: requester.id,
        Comments: data.Comments,
        U_B2AG_Equipment: `${equipment.id} - ${equipment.label}`,
        DocumentLines: docLines,
    }
}

function mapOrderDocumentLines(data) {
    return data.DocumentLines.map((item, index) => {
        return {
            ItemCode: item.Item.id,
            FreeText: item.FreeText,
            Quantity: item.Quantity,
            UnitPrice: item.UnitPrice,            
            Usage: data.Usage,
            WarehouseCode: item.WarehouseCode,
            BaseType: 1470000113,
			BaseEntry: data.DocEntry,
            BaseLine: item.LineNum
        }
    })       
}