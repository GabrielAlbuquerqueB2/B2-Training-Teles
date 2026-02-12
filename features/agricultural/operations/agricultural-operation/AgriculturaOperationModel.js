import { getBranchByWarehouseId, getItemAveragePriceInWarehouse } from './AgriculturalOperationServices'

export async function createAgriculturalOperationModel(data) {

    const documentLines = await generateDocumentLines(data.DocumentLines, data.U_B2AG_Field)

    let obj = {       
        DocDate: data.U_B2AG_FinalDate,
        Comments: data.Comments,
        JournalMemo: `Apontamento de Operação Agrícola`,
        U_B2AG_Cultivation: data.U_B2AG_Cultivation,
        U_B2AG_Crop: data.U_B2AG_Crop,
        U_B2AG_FinalDate: data.U_B2AG_FinalDate,
        U_B2AG_FinalTime: data.U_B2AG_FinalTime,
        U_B2AG_InitialDate: data.U_B2AG_InitialDate,
        U_B2AG_InitialTime: data.U_B2AG_InitialTime,
        U_B2AG_TotalArea: data.U_B2AG_TotalArea,
        U_B2AG_PerformedArea: data.U_B2AG_PerformedArea,
        U_B2AG_B2TransId: data.U_B2AG_TransId,
        U_B2AG_B2ObjectType: 'AgriOperation',
        U_B2AG_AgriOperation: data.U_B2AG_AgriOperation,
        U_RDA: data.U_RDA,
        DocumentLines: documentLines
    }

    const listOfObjects = await generateListOfObjects(documentLines, obj)
    return listOfObjects
}

async function generateListOfObjects(documentLines, headerObject) {

    const uniqueBranchs = [... new Set(documentLines.map(line => { return line.WarehouseCode }))]
    
    let result = []
    for (let entry of uniqueBranchs) {
        const groupedByBranchLines = documentLines.filter(item => {
            return item.WarehouseCode === entry
        })
        if (groupedByBranchLines) {
            result.push(groupedByBranchLines)
        }
    }
    
    const promises = result.map(async exitLines => {
        const branch = await getBranchByWarehouseId(exitLines[0].WarehouseCode)
        return {
            ...headerObject,
            BPL_IDAssignedToInvoice: branch.BusinessPlaceID ,
            DocumentLines: exitLines
        }
    })

    return Promise.all(promises)
}

async function generateDocumentLines(itemList, field) {

    const removeEmpty = itemList.filter(item => {
        return item.Item.id && item.WhsCode && item.Quantity
    })

    const promises = removeEmpty.map(async line => {
        return {
            ItemCode: line.Item.id,
            WarehouseCode: line.WhsCode,
            Quantity: line.Quantity,
            UnitPrice: await getPrice(line.Item.id, line.WhsCode),
            U_B2AG_Field: field
        }
    })

    return Promise.all(promises)
}

async function getPrice(itemCode, warehouseCode) {
    const result = await getItemAveragePriceInWarehouse(itemCode, warehouseCode)
    return result.value[0]["Items/ItemWarehouseInfoCollection"].StandardAveragePrice
}