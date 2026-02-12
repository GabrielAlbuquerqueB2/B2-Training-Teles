import axios from 'axios'
import Api from '../../../../lib/api'

export function fetchTableData(gridApi) {
    gridApi.forEachNode(async (node, index) => {
        const obj = node.data
        const result = await validateObjects(obj.Code)
        const isCreated = isObjectCreated(result)
        if (!isCreated) {
            setObjectCreatedInfo(obj.Code, gridApi)
        }
    })
}

async function validateObjects(objectCode) {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/UserObjectsMD')
        .setParams({
            $select: 'Code',
            $filter: `Code eq '${objectCode}'`
        })
        .get()

    try {
        const result = await axios(query)
        return result.data.value
    } catch (error) {
        return []
    }
}

function isObjectCreated(result) {
    if (result.length > 0) {
        return true
    } else {
        return false
    }
}

function setObjectCreatedInfo(name, gridApi) {    
    const node = gridApi.getRowNode(name)
    node.setDataValue('NeedToCreate', true)
}

export function getRowStyle(params) {
    if (params.data.NeedToCreate) {
        return { background: '#ffb3b3' };
    }
}

export async function createObject(obj, gridApi) {

    delete obj.NeedToCreate
    
    const query = new Api()
        .setMethod('POST')
        .setUrl('/UserObjectsMD')
        .setData(obj)
        .get()

    try {
        const result = await axios(query)
        console.log(result.data)
        setNeedToCreateToFalse(gridApi, obj.Code)
    } catch (error) {
        console.log(error)
    }
}

function setNeedToCreateToFalse(gridApi, name) {
    const node = gridApi.getRowNode(name)
    node.setDataValue('NeedToCreate', false)
}