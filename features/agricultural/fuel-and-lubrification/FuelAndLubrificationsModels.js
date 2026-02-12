import { getItemAveragePriceInWarehouse } from './FuelAndLubrificationsServices'

export async function createFuelInventoryGenExitModel(data, equipment, employee, item) {    

    const avgPrice = await getItemAveragePriceInWarehouse(item.id, data.Warehouse)

    let obj = {
        BPL_IDAssignedToInvoice: data.BPLId,
        DocDate: data.Date,
        Comments: data.Comments,
        JournalMemo: `Apontamento de abastecimento`,
        U_B2AG_B2ObjectType: 'FuelAndLubrification',
        U_B2AG_Crop: data.Crop,
        U_B2AG_Cultivation: data.Cultivation,
        U_B2AG_Equipment: equipment.id ? `${equipment.id} - ${equipment.label}` : equipment,
        U_B2AG_Odometer: data.Odometer,
        U_B2AG_Operator: `${employee.id} - ${employee.label}`,
        DocumentLines: [{
            ItemCode: item.id,
            WarehouseCode: data.Warehouse,
            Quantity: data.Quantity,
            UnitPrice: avgPrice['Items/ItemWarehouseInfoCollection'].StandardAveragePrice,
            CostingCode: data.ProfitCenter,
        }]
    }
    
    return obj
}