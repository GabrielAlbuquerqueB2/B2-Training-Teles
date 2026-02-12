import axios from 'axios'
import Api from '../../../../lib/api'

export function fetchTableData(gridApi) {
    gridApi.forEachNode(async (node, index) => {
        const table = node.data
        const result = await validateTables(table.TableName)
        const isCreated = isTableCreated(result)
        if (!isCreated) {
            setTableCreatedInfo(table.TableName, gridApi)
        }
    })
}

async function validateTables(tableName) {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/UserTablesMD')
        .setParams({
            $select: 'TableName',
            $filter: `TableName eq '${tableName}'`
        })
        .get()

    try {
        const result = await axios(query)
        return result.data.value
    } catch (error) {
        return []
    }
}

function isTableCreated(result) {
    if (result.length > 0) {
        return true
    } else {
        return false
    }
}

function setTableCreatedInfo(name, gridApi) {
    const node = gridApi.getRowNode(name)
    node.setDataValue('NeedToCreate', true)
}

export function getRowStyle(params) {
    if (params.data.NeedToCreate) {
        return { background: '#ffb3b3' };
    }
}

export async function createTable(table, gridApi) {
    
    const query = new Api()
        .setMethod('POST')
        .setUrl('/UserTablesMD')
        .setData({
            TableName: table.TableName,
            TableDescription: table.TableDescription,
            TableType: table.TableType
        })
        .get()

    try {
        const result = await axios(query)
        console.log(result.data)
        setNeedToCreateToFalse(gridApi, table.TableName)
    } catch (error) {
        console.log(error)
    }
}

function setNeedToCreateToFalse(gridApi, name) {
    const node = gridApi.getRowNode(name)
    node.setDataValue('NeedToCreate', false)
}