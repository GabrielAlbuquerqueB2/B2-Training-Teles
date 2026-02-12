import { getBranchByWarehouseId, getItemAveragePriceInWarehouse } from './WarehouseExitServices'

export async function createWarehouseExitGenExitModel(data, equipment, employee) {    
    
    const documentLines = await generateDocumentLines(data.DocumentLines, data.ProfitCenter)

    let obj = {
        BPL_IDAssignedToInvoice: data.BPLId,
        DocDate: data.Date,
        Comments: data.Comments,
        JournalMemo: `Saída de Almoxarifado`,
        U_B2AG_B2ObjectType: 'WarehouseExit',
        U_B2AG_Crop: data.Crop,
        U_B2AG_Equipment: equipment.id ? `${equipment.id} - ${equipment.label}` : equipment,
        U_B2AG_Odometer: data.Odometer,
        U_B2AG_Operator: `${employee.id} - ${employee.label}`,
        DocumentLines: documentLines
    }
    
    const listOfObjects = await generateListOfObjects(documentLines, obj)
    return listOfObjects
}

async function generateDocumentLines(itemList, profitCenter) {

    const removeEmpty = itemList.filter(item => {
        return item.Item.id && item.WhsCode && item.Quantity
    })

    const promises = removeEmpty.map(async line => {
        return {
            ItemCode: line.Item.id,
            WarehouseCode: line.WhsCode,
            Quantity: line.Quantity,
            UnitPrice: await getPrice(line.Item.id, line.WhsCode),
            CostingCode: profitCenter,
            DocumentLinesBinAllocations: []
        }
    })

    return Promise.all(promises)
}

async function getPrice(itemCode, warehouseCode) {    
    const result = await getItemAveragePriceInWarehouse(itemCode, warehouseCode)    
    return result["Items/ItemWarehouseInfoCollection"].StandardAveragePrice
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