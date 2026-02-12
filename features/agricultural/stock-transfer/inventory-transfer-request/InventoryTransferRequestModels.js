export function createInventoryTransferRequestObject(data) {

    console.log(data)

    const stockTransferLines = createInventoryTransferRequestLines(data.StockTransferLines)

    let obj = {
        BPLID: data.BPLID,
        DocDate: data.DocDate,
        FromWarehouse: data.FromWarehouse,
        ToWarehouse: data.ToWarehouse,
        Comments: data.Comments,
        JournalMemo: `B2Agri - Transferência interna de estoque`,
        StockTransferLines: stockTransferLines
    }

    return obj
}

function createInventoryTransferRequestLines(items) {

    const mappedItems = items.map(item => {
        return (
            {
                ItemCode: item.Item?.id,
                WarehouseCode: item.ToWarehouse,
                FromWarehouseCode: item.FromWarehouse,
                Quantity: item.Quantity,
            }
        )
    })

    return mappedItems.filter(item => {
        return item.ItemCode && item.Quantity
    })
}

export function createStockTransferObject(data) {

    const stockTransferLines = createStockTransferLines(data)

    let obj = {
        BPLID: data.BPLID,
        DocDate: data.DocDate,
        FromWarehouse: data.FromWarehouse,
        ToWarehouse: data.ToWarehouse,
        Comments: data.Comments,
        JournalMemo: `B2Agri - Transferência interna de estoque`,
        StockTransferLines: stockTransferLines
    }

    return obj
}

function createStockTransferLines(data) {

    const items = data.StockTransferLines

    const mappedItems = items.map(item => {
        return (
            {
                ItemCode: item.ItemCode,
                WarehouseCode: data.ToWarehouse,
                FromWarehouseCode: data.FromWarehouse,
                Quantity: item.Quantity,
                BaseType: 'InventoryTransferRequest',
                BaseLine: item.LineNum,
                BaseEntry: data.DocEntry,
            }
        )
    })

    return mappedItems.filter(item => {
        return item.ItemCode && item.Quantity
    })
}