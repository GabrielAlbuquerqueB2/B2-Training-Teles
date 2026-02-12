export function createGoodsReceivedNoteModel(data, shippingCompany) {
    
    const varietyData = data.B2AG_GRN1Collection.filter(item => item.U_B2AG_Variety).map(item => {
        return {
            U_B2AG_Field: item.U_B2AG_Field,
            U_B2AG_Variety: item.U_B2AG_Variety,
            U_B2AG_Quantity: item.U_B2AG_Quantity
        }
    })

    const alanisysData = data.B2AG_GRN2Collection.map(item => {
        return {
            U_B2AG_Code: item.U_B2AG_Code,
            U_B2AG_Description: item.U_B2AG_Description,
            U_B2AG_Quantity: item.U_B2AG_Quantity,
            U_B2AG_Value: item.U_B2AG_Value
        }
    })

    return {
        ...data,
        
        U_B2AG_ShippingCompany: shippingCompany.id,
        B2AG_GRN1Collection: varietyData,
        B2AG_GRN2Collection: alanisysData
    }
}

export function editableGoodsReceivedNoteModel(data, shippingCompany) {
    
    const editableTicket = createGoodsReceivedNoteModel(data, shippingCompany)

    delete editableTicket.DocNum
	delete editableTicket.Period
	delete editableTicket.Instance
	delete editableTicket.Series
	delete editableTicket.Handwrtten
	delete editableTicket.Status
	delete editableTicket.RequestStatus
	delete editableTicket.Creator
	delete editableTicket.Remark
	delete editableTicket.DocEntry
	delete editableTicket.Canceled
	delete editableTicket.Object
	delete editableTicket.LogInst
	delete editableTicket.UserSign
	delete editableTicket.Transfered
	delete editableTicket.CreateDate
	delete editableTicket.CreateTime
	delete editableTicket.UpdateDate
	delete editableTicket.UpdateTime
	delete editableTicket.DataSource

    return editableTicket
}