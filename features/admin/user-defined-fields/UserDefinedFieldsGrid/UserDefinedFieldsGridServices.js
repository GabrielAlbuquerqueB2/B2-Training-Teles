import axios from 'axios'
import Api from '../../../../lib/api'

export function fetchTableData(gridApi) {
    gridApi.forEachNode(async (node, index) => {        
        const field = node.data
        const result = await validateFields(field.TableName, field.Name)
        const isCreated = isFieldCreated(result)
        if (!isCreated) {
            setFieldCreatedInfo(field.Name + field.TableName, gridApi)
        }
    })
}

async function validateFields(tableName, fieldName) {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/UserFieldsMD')
        .setParams({
            $select: 'TableName,Name',
            $filter: `TableName eq '${tableName}' and Name eq '${fieldName}'`
        })
        .get()

    try {
        const result = await axios(query)
        return result.data.value
    } catch (error) {
        return []
    }
}

function isFieldCreated(result) {
    if (result.length > 0) {
        return true
    } else {
        return false
    }
}

function setFieldCreatedInfo(name, gridApi) {
    const node = gridApi.getRowNode(name)
    node.setDataValue('NeedToCreate', true)
}

export function getRowStyle(params) {
    if (params.data.NeedToCreate) {
        return { background: '#ffb3b3' };
    }
}

export async function createField(field, gridApi) {
    
    const query = new Api()
        .setMethod('POST')
        .setUrl('/UserFieldsMD')
        .setData({
            Description: field.Description,
            Name: field.Name,
            Type: field.Type,
            SubType: field.SubType,
            TableName: field.TableName,
            Size: field.Size,
        })
        .get()

    try {
        const result = await axios(query)
        console.log(result.data)
        setNeedToCreateToFalse(gridApi, field.Name, field.TableName)
    } catch (error) {
        console.log(error)
    }
}

function setNeedToCreateToFalse(gridApi, name, tablename) {
    const id = name + tablename
    const node = gridApi.getRowNode(id)
    node.setDataValue('NeedToCreate', false)
}